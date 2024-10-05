import collection from "../../../src/app/slices/collection"
import { ownedPokemonEdit } from "../backendrequests/ownedpokemonedit"
import getIndividualPokemonObjBackend from "../backendrequests/getindividualpokemonobj"
import { apriballLiterals } from "../../../common/infoconstants/miscconstants.mjs"
import { sortList } from "../../../common/sortingfunctions/customsorting.mjs"

const saveScopeChangesAndGetNewList = async(addedPokemon, removedPokemon, collectionState, collectionGen, collectionId, collectionAutoSort, collectionAutoSortKey, ballScope, ballLegalityInfo, demo=false, demoColData={}) => {
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
                ballScope.forEach(ball => {
                    const legalityBall = apriballLiterals.includes(ball) ? 'apriball' : ball
                    const pokemonLegalBalls = ballLegalityInfo.filter(mon => mon.imgLink === poke.imgLink)[0].legalBalls
                    if (pokemonLegalBalls.includes(legalityBall) && poke.balls[ball] === undefined) {
                        const newBallObjRef = JSON.parse(JSON.stringify(pokemon.balls[Object.keys(pokemon.balls)[0]]))
                        Object.keys(newBallObjRef).forEach((key) => {
                            const accompanyingValue = key === 'isOwned' || key === 'isHA' ? false : key === 'emCount' ? 0 : key === 'EMs' && []
                            newBallObjRef[key] = accompanyingValue
                        })
                        newListDisplayState[idx].balls[ball] = newBallObjRef
                    }
                })
                Object.keys(newListDisplayState[idx].balls).forEach(ball => {
                    if (newListDisplayState[idx].balls[ball].disabled === true) {
                        delete newListDisplayState[idx].balls[ball].disabled //resets excluded ball info
                    }
                })
            } 
        })
    }

    if (backendRequestPokeInfo.pokemon.length !== 0) {
        const backendNewListState = JSON.parse(JSON.stringify(newListDisplayState)).map(mon => {
            delete mon.imgLink
            delete mon.possibleGender
            return mon
        })
        const newAddedPokemonAndEMData = demo ? await getIndividualPokemonObjBackend(backendRequestPokeInfo.pokemon, ballScope, demoColData) : 
            await ownedPokemonEdit(collectionGen, backendNewListState, collectionId, true, backendRequestPokeInfo.pokemon, ballScope)
        
        if (!newAddedPokemonAndEMData.ok) {
            return newAddedPokemonAndEMData
        }
        const finalListState = collectionAutoSort === true ? sortList(collectionAutoSortKey, [...newListDisplayState, ...newAddedPokemonAndEMData.load.newPokemon]) : [...newListDisplayState, ...newAddedPokemonAndEMData.load.newPokemon]
        // const backendListFormat = finalListState.map((mon) => {return mon.disabled ? {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, disabled: true, balls: mon.balls} : {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, balls: mon.balls}})
        const updatedEggMoveInfo = newAddedPokemonAndEMData.load.updatedEggMoves
        return {ok: true, load: {list: finalListState, updatedEggMoveInfo, updatedHomeGames: newAddedPokemonAndEMData.load.updatedHomeGames}}
    } else {
        const finalListState = collectionAutoSort === true ? sortList(collectionAutoSortKey, newListDisplayState) : newListDisplayState
        if (demo) {
            return {ok: true, load: {list: finalListState}}
        }
        const backendListFormat = finalListState.map((mon) => {return mon.disabled ? {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, disabled: true, balls: mon.balls} : {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, balls: mon.balls}})
        const res = await ownedPokemonEdit(collectionGen, backendListFormat, collectionId, false)
        if (!res.ok) {return res}
        return {ok: res.ok, load: finalListState}
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

const saveExcludedCombos = (addedPokemon, removedPokemon, ballChangedPokemon,  collectionListState) => {
    const newListRef = JSON.parse(JSON.stringify(collectionListState))

    const newCollectionListState = newListRef.map((pokemon) => {
        const isAddedMon = addedPokemon.filter(mon => mon.imgLink === pokemon.imgLink).length !== 0
        const isRemovedMon = removedPokemon.filter(mon => mon.imgLink === pokemon.imgLink).length !== 0
        const isBallChangedMon = ballChangedPokemon.filter(mon => mon.imgLink === pokemon.imgLink).length !== 0
        if (isAddedMon) {
            const excludedBalls = addedPokemon.filter(mon => mon.imgLink === pokemon.imgLink)[0].excludedBalls
            Object.keys(pokemon.balls).forEach(ball => {
                const disableBall = excludedBalls.includes(ball)
                if (disableBall) {
                    pokemon.balls[ball].disabled = true
                }
            })
        } else if (isRemovedMon) {
            Object.keys(pokemon.balls).forEach(ball => {
                if (pokemon.balls[ball].disabled !== undefined) {
                    delete pokemon.balls[ball].disabled
                }
            })
        } else if (isBallChangedMon) {
            const addedBalls = ballChangedPokemon.filter(mon => mon.imgLink === pokemon.imgLink)[0].addedBalls
            const removedBalls = ballChangedPokemon.filter(mon => mon.imgLink === pokemon.imgLink)[0].removedBalls
            Object.keys(pokemon.balls).forEach(ball => {
                const reEnableBall = removedBalls.includes(ball)
                const disableBall = addedBalls.includes(ball)
                if (pokemon.balls[ball].disabled !== undefined && reEnableBall) {
                    delete pokemon.balls[ball].disabled
                } else if (pokemon.balls[ball].disabled === undefined && disableBall) {
                    pokemon.balls[ball].disabled = true
                }
            })
        }
        return pokemon
    })

    return newCollectionListState
}
export {saveScopeChangesAndGetNewList, saveBallScopeChanges, saveExcludedCombos}