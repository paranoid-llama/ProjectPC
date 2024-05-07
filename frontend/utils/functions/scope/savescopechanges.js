import collection from "../../../src/app/slices/collection"
import { ownedPokemonEdit } from "../backendrequests/ownedpokemonedit"
import { apriballLiterals } from "../../../src/infoconstants"
import { sortList } from "../sortfilterfunctions/sortingfunctions"

const saveScopeChangesAndGetNewList = async(addedPokemon, removedPokemon, collectionState, collectionGen, collectionId, collectionAutoSort, collectionAutoSortKey, ballScope) => {
    const newListDisplayState = JSON.parse(JSON.stringify(collectionState))
    //only need to update the list display state, since we'll use that list to update the backend ownedPokemon list, and any disabled pokemon
    //in list display arr is never shown in the list anyway
    //we need to take the collection state since the list display state may already be filtered by filter keys, etc. this also means we need to 
    //reset all filter keys when we update the state.
    const backendRequestPokeInfo = {pokemon: addedPokemon}
    for (let rPoke of removedPokemon) {
        newListDisplayState.forEach((poke, idx) => {
            if (rPoke.id === poke.imgLink) {
                newListDisplayState[idx].disabled = true
            }
        })
    }
    for (let aPoke of addedPokemon) {
        newListDisplayState.forEach((poke, idx) => {
            if (aPoke.id === poke.imgLink) {
                backendRequestPokeInfo.pokemon = backendRequestPokeInfo.pokemon.filter(mon => mon.id !== aPoke.id)
                delete newListDisplayState[idx].disabled
            } 
        })
    }
    if (backendRequestPokeInfo.pokemon.length !== 0) {
        const newPokemonInfo = await ownedPokemonEdit(collectionGen, [], collectionId, true, backendRequestPokeInfo.pokemon, false, )
        const finalListState = collectionAutoSort === true ? sortList(collectionAutoSortKey, [...newListDisplayState, ...newPokemonInfo]) : [...newListDisplayState, ...newPokemonInfo]
        const backendListFormat = finalListState.map((mon) => {return mon.disabled ? {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, disabled: true, balls: mon.balls} : {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, balls: mon.balls}})
        const updatedEggMoveInfo = await ownedPokemonEdit(collectionGen, backendListFormat, collectionId, false, [], true)
        return {list: finalListState, updatedEggMoveInfo}
    } else {
        const finalListState = collectionAutoSort === true ? sortList(collectionAutoSortKey, newListDisplayState) : newListDisplayState
        const backendListFormat = finalListState.map((mon) => {return mon.disabled ? {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, disabled: true, balls: mon.balls} : {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, balls: mon.balls}})
        await ownedPokemonEdit(collectionGen, backendListFormat, collectionId, false)
        return finalListState
    }
}

//returns new ownedPokemon list with updated data
const saveBallScopeChanges = (newBallScope, addedBalls, collectionListState, legalBallInfo, removedPokemon) => {
    const newListRef = JSON.parse(JSON.stringify(collectionListState))
    // const addedBallsLegality = addedBalls.map(ball => apriballLiterals.includes(ball) ? 'apriball' : ball)
    // const addedBallsFormatted = addedBallsLegality.filter((ball, idx) => addedBallsLegality.indexOf(ball) === idx)
    const newCollectionListState = newListRef.map((pokemon) => {
        const inRemovedPokemonArr = removedPokemon.length === 0 ? false : removedPokemon.filter(rPoke => rPoke.imgLink === pokemon.imgLink).length !== 0
        const isDisabledPokemon = pokemon.disabled !== undefined
        if (isDisabledPokemon) {
            return pokemon
        }
        if (inRemovedPokemonArr) {
            pokemon.disabled = true
            return pokemon
        } else {
            Object.keys(pokemon.balls).forEach(ball => {
                const ballIsIncluded = newBallScope.includes(ball)
                if (ballIsIncluded) {
                    null
                } else {
                    delete pokemon.balls[ball]
                }
            })
            if (addedBalls.length !== 0) {
                const pokemonLegalityInfo = legalBallInfo.filter(mon => mon.imgLink === pokemon.imgLink)[0].legalBalls
                addedBalls.forEach(ball => {
                    const addedBallLegality = apriballLiterals.includes(ball) ? 'apriball' : ball
                    if (pokemonLegalityInfo.includes(addedBallLegality)) {
                        const newBallObjRef = JSON.parse(JSON.stringify(pokemon.balls[Object.keys(pokemon.balls)[0]]))
                        Object.keys(newBallObjRef).forEach((key) => {
                            const accompanyingValue = key === 'isOwned' || key === 'isHA' ? false : key === 'emCount' ? 0 : key === 'EMs' && []
                            newBallObjRef[key] = accompanyingValue
                        })
                        pokemon.balls[ball] = newBallObjRef
                    }
                })
            }
            
            return pokemon
        }
    })
    return newCollectionListState
}

export {saveScopeChangesAndGetNewList, saveBallScopeChanges}