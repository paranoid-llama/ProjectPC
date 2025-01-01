import { sortByDexNum } from "../../../common/sortingfunctions/sortbydexnum.mjs"
import { legendaryPokemon, effectiveNonBreedable, evolvedRegionals, pokeAdults, pokeBabies, pokeIncenseAdults, pokeIncenseBabies, interchangeableAltFormMons } from "../../../common/infoconstants/pokemonconstants.mjs"

const comparisonPokemonFormat = (ball, isOnhand, ballData, pokemon, eggMoveData, highlyWanted) => {
    const peripheryInfoLocation = isOnhand ? pokemon : ballData
    const isHAData = peripheryInfoLocation.isHA === undefined ? {} : {isHA: peripheryInfoLocation.isHA}
    const emData = peripheryInfoLocation.emCount === undefined ? {} : {emCount: peripheryInfoLocation.emCount, EMs: peripheryInfoLocation.EMs, isMaxEMs: eggMoveData[pokemon.name].length === peripheryInfoLocation.emCount || peripheryInfoLocation.emCount === 4}
    const wanted = highlyWanted ? {wanted: true} : {}
    const onhandId = isOnhand ? {onhandId: pokemon._id} : {}
    return {
        ball,
        ...isHAData,
        ...emData,
        ...onhandId,
        ...wanted
    }
}

const babyAdultEquivalency = (p) => {
    if (pokeAdults.includes(p.name)) {return pokeBabies[pokeAdults.indexOf(p.name)]}
    if (pokeBabies.includes(p.name)) {return pokeAdults[pokeBabies.indexOf(p.name)]}
    if (pokeIncenseAdults.includes(p.name)) {return pokeIncenseBabies[pokeIncenseAdults.indexOf(p.name)]}
    if (pokeIncenseBabies.includes(p.name)) {return pokeIncenseAdults[pokeIncenseBabies.indexOf(p.name)]}
    return undefined
}

const iAltFormEquivalency = (p) => {
    //equivalency is only if the reference list has non-'Any' iAltForm, as it can be offered as 'Any' form if the other list has it.
    //no other logic needed since if a list has 'Any' forms, then it cannot have any specific forms. 
    //decided against including an option to equalize every specific form to each other since that would be too much work for a feature people probably won't use.
    if (p.name.includes('Any')) {return undefined} //cannot compare 'Any' forms to specific forms, can only go reverse.
    if (!p.name.includes('Any')) {return `${p.name.slice(0, p.name.indexOf('('))}(Any)`}
}

const pokemonFallsInOpts = (p, advOpts) => {
    const isLegendary = legendaryPokemon.includes(p.name)
    const isNonBreedable = effectiveNonBreedable.includes(p.name)
    const isEvolvedRegional = evolvedRegionals.includes(p.name)
    // if (!isLegendary && !isNonBreedable && !isEvolvedRegional) {return {include: true}}
    if (isLegendary) {return {include: advOpts.legendary, notBreedable: true}}
    if (isNonBreedable) {return {include: advOpts.nonBreedable, notBreedable: true}}
    if (isEvolvedRegional) {return {include: advOpts.evolvedRegional, notBreedable: true}}
    return {include: true}
    //will only be able to compare between collections if its on-hand for these types of pokemon
}

//currently the function below doesnt differentiate between legendary/non-legendary pokemon, so it will say you can offer legendaries if both collections
//have them. might be worth changing down the line.
const compareLists = (refList, compareFromList, specificOpts, advOpts, eggMoveData, ignoreEMs, onHandPokemon) => { 
    const comparedList = onHandPokemon === undefined ? [] : onHandPokemon
    //this object is used as a reference for which specific form/ball combos were offered for 'Any' forms, so there's no duplicates. 
    const interchangeableToAnyRef = {}
    for (let iFormMon of interchangeableAltFormMons) {
        interchangeableToAnyRef[iFormMon] = []
    }
    //this object is used so that multiple of the same pokemon/ball combo of a valid on-hand aren't used
    const onhandBallComboRef = {}
    refList.forEach(pokemon => {
        //isOnhandList always refers to the refList.
        if (pokemon.disabled === true) {return} 
        const isOnhandList = pokemon.ball !== undefined
        const includePokemon = pokemonFallsInOpts(pokemon, advOpts)
        if (!includePokemon.include) {return}
        //below operation is to establish equivalency between baby/adult pokemon and between any form - other interchangeable alt forms.
        const isInterchangeableAltFormPokemon = interchangeableAltFormMons.map(mon => pokemon.name.includes(mon)).includes(true)
        const equivalentPokemon = isInterchangeableAltFormPokemon ? iAltFormEquivalency(pokemon) : advOpts.equalizeBabyAdults ? babyAdultEquivalency(pokemon) : undefined
        // console.log(equivalentPokemon)

        const otherListPokemonLiteral = compareFromList.filter(p => p.name === pokemon.name)[0]
        
        const otherListPokemonEquivalent = equivalentPokemon !== undefined ? compareFromList.filter(p => p.name === equivalentPokemon)[0] : undefined
        const otherListPokemonData = (otherListPokemonLiteral !== undefined && otherListPokemonLiteral.disabled !== true) ? otherListPokemonLiteral : otherListPokemonEquivalent !== undefined ? otherListPokemonEquivalent : undefined
        // console.log(otherListPokemonLiteral)
        if (otherListPokemonData === undefined || otherListPokemonData.disabled === true) {return}
        const differentPokemonData = otherListPokemonData.name !== pokemon.name

        const iAltFormDiffSpecies = (differentPokemonData && isInterchangeableAltFormPokemon) && interchangeableAltFormMons.filter((iAlt) => pokemon.name.includes(iAlt))[0]
        const babyAdultEquivalent = advOpts.equalizeBabyAdults && (otherListPokemonLiteral === undefined || otherListPokemonLiteral.disabled === true) && !isInterchangeableAltFormPokemon
        const otherListOwnedData = otherListPokemonData.balls
        const maxEMs = !ignoreEMs && (eggMoveData[pokemon.name].length >= 4 ? 4 : eggMoveData[pokemon.name].length)
        if (!isOnhandList) {
            if (includePokemon.notBreedable === true) {return} 
            Object.keys(pokemon.balls).forEach(ball => {
                const ballData = pokemon.balls[ball]
                const otherListBallData = otherListOwnedData[ball]
                const noOtherBallData = otherListBallData === undefined || otherListBallData.disabled === true
                const noComparisonToBeMade = ballData.disabled === true || noOtherBallData
                const theyHaveBallPending = (otherListBallData !== undefined) && otherListBallData.pending === true
                if (noComparisonToBeMade) {return}
                if (theyHaveBallPending) {return}
                const hasOnHandVer = onHandPokemon.filter(p => {
                    const matchesPokemon = pokemon.name === p.name
                    const matchesBall = p.balls.filter(ohBallData => ohBallData.ball === ball).length !== 0
                    const isHAIfInOpts = specificOpts.ha === false ? true : (p.isHA !== undefined ? p.isHA === true : true)
                    const isMaxEMsIfInOpts = ignoreEMs ? true : specificOpts.em === false ? true : (p.emCount === undefined ? true : p.emCount === maxEMs)
                    //above two lines might actually be unnecessary, but im going to keep it there anyway.
                    const takeOnhandVer = matchesPokemon && matchesBall && isHAIfInOpts && isMaxEMsIfInOpts
                    return takeOnhandVer
                }).length !== 0
                if (hasOnHandVer) {return}
                //below block is if reflist has multiple int alt forms while compareTo list has 'Any'. To prevent duplication of balls provided (if multiple
                //forms have the same ball which is unowned for 'Any'), we use this ref to keep track of it.
                const otherIAltFormProvided = iAltFormDiffSpecies && interchangeableToAnyRef[iAltFormDiffSpecies].includes(ball)
                if (otherIAltFormProvided) {return}
                const providedByAdultBabyLiteral = babyAdultEquivalent && refList.filter(p => p.name === equivalentPokemon).map((pData) => {
                    const eqBallData = pData.balls[ball]
                    const notDisabled = eqBallData.disabled !== true
                    const isOwned = eqBallData.isOwned === true
                    const HAFitsOpts = specificOpts.ha === true ? (eqBallData.isHA === undefined ? true : eqBallData.isHA) : true
                    const EMFitsOpts = specificOpts.em === true ? (eqBallData.emCount === undefined ? true : eqBallData.emCount === maxEMs) : true
                    return (notDisabled && isOwned && HAFitsOpts && EMFitsOpts)
                }).includes(true)
                if (providedByAdultBabyLiteral) {return}
                if (specificOpts.ha === true && (ballData.isHA !== undefined && ballData.isHA === false)) {return}
                if (!ignoreEMs && (specificOpts.em === true && (ballData.emCount !== undefined && ballData.emCount !== maxEMs))) {return}
                if (ballData.isOwned === true && otherListBallData.isOwned === false) {
                    if (iAltFormDiffSpecies) {
                        interchangeableToAnyRef[iAltFormDiffSpecies].push(ball)
                    }
                    // if (babyAdultEquivalent) {
                    //     multiplePokemonRef[otherListPokemonData.name].push(ball)
                    // }
                    const pokemonDataThere = comparedList.filter(p => p.name === pokemon.name).length !== 0
                    if (pokemonDataThere) {
                        const idxOfPokemon = comparedList.map((p, idx) => {return {name: p.name, idx}}).filter(p => p.name === pokemon.name)[0].idx
                        comparedList[idxOfPokemon].balls.push(comparisonPokemonFormat(ball, false, ballData, pokemon, eggMoveData, otherListBallData.highlyWanted !== undefined))
                    } else {
                        const forRef = differentPokemonData ? {for: otherListPokemonData.name} : {}
                        comparedList.push({name: pokemon.name, natDexNum: pokemon.natDexNum, id: pokemon.imgLink, ...forRef, balls: [comparisonPokemonFormat(ball, false, ballData, pokemon, eggMoveData, otherListBallData.highlyWanted !== undefined)]})
                    }
                    
                }
            })
        } else {
            const otherListBallData = otherListOwnedData[pokemon.ball]
            const noComparisonToBeMade = otherListBallData === undefined || otherListBallData.disabled === true
            if (noComparisonToBeMade) {return}
            const otherOnHandHasProvidedPokeBallCombo = onhandBallComboRef[pokemon.name] !== undefined && onhandBallComboRef[pokemon.name].includes(pokemon.ball)
            if (otherOnHandHasProvidedPokeBallCombo) {return}
            const otherIAltFormProvided = iAltFormDiffSpecies && interchangeableToAnyRef[iAltFormDiffSpecies].includes(pokemon.ball)
            if (otherIAltFormProvided) {return}
            const providedByAdultBabyLiteral = babyAdultEquivalent && refList.filter(p => p.name === equivalentPokemon).map((pData) => {
                const eqBallData = pData
                const HAFitsOpts = specificOpts.ha === true ? (eqBallData.isHA === undefined ? true : eqBallData.isHA) : true
                const EMFitsOpts = specificOpts.em === true ? (eqBallData.emCount === undefined ? true : eqBallData.emCount === maxEMs) : true
                return (HAFitsOpts && EMFitsOpts)
            }).includes(true)
            if (providedByAdultBabyLiteral) {return}
            if (specificOpts.ha === true && (pokemon.isHA === false)) {return}
            if (!ignoreEMs && (specificOpts.em === true && (pokemon.emCount !== maxEMs))) {return}
            if (pokemon.reserved !== undefined && pokemon.reserved >= pokemon.qty) {return}
            if (otherListBallData.isOwned === false) {
                const pokemonDataThere = comparedList.filter(p => p.name === pokemon.name).length !== 0
                if (iAltFormDiffSpecies) {
                    interchangeableToAnyRef[iAltFormDiffSpecies].push(pokemon.ball)
                }
                onhandBallComboRef[pokemon.name] = onhandBallComboRef[pokemon.name] !== undefined ? [...onhandBallComboRef[pokemon.name], pokemon.ball] : [pokemon.ball]
                if (pokemonDataThere) {
                    const idxOfPokemon = comparedList.map((p, idx) => {return {name: p.name, idx}}).filter(p => p.name === pokemon.name)[0].idx
                    comparedList[idxOfPokemon].balls.push(comparisonPokemonFormat(pokemon.ball, true, {}, pokemon, eggMoveData, otherListBallData.highlyWanted !== undefined))
                } else {
                    const forRef = differentPokemonData ? {for: otherListPokemonData.name} : {}
                    comparedList.push({name: pokemon.name, natDexNum: pokemon.natDexNum, id: pokemon.imgLink, ...forRef, balls: [comparisonPokemonFormat(pokemon.ball, true, {}, pokemon, eggMoveData, otherListBallData.highlyWanted !== undefined)]})
                }
                
            }
        }
    })
    return comparedList
}

const compareCollections = (userCol, ownerCol, opts, advOpts, userEggMoveData, ownerEggMoveData, ignoreEMs) => {
    //4 comparison operations:
    // 1. userCol's ownedPokemon list with ownerCol's ownedPokemon list (checks what userCol can offer)
    // 2. userCol's onhand list with ownerCol's ownedPokemon list (checks what userCol can offer)
    // 3. ownerCol's ownedPokemon list with userCol's ownedPokemon list (checks what userCol can receive)
    // 4. ownerCol's onhand list with userCol's ownedPokemon list (checks what userCol can receive)
    const offerableOnhandPokemon = compareLists(userCol.onHand, ownerCol.ownedPokemon, opts.userList, advOpts, userEggMoveData, ignoreEMs)
    const offerableBreedablePokemon = opts.userList.onhand === true ? offerableOnhandPokemon : compareLists(userCol.ownedPokemon, ownerCol.ownedPokemon, opts.userList, advOpts, userEggMoveData, ignoreEMs, offerableOnhandPokemon)
    const canOffer = sortByDexNum('NatDexNumL2H', [...offerableBreedablePokemon])

    const receivableOnhandPokemon = compareLists(ownerCol.onHand, userCol.ownedPokemon, opts.ownerList, advOpts, ownerEggMoveData, ignoreEMs)
    const receivableBreedablePokemon = opts.ownerList.onhand === true ? receivableOnhandPokemon : compareLists(ownerCol.ownedPokemon, userCol.ownedPokemon, opts.ownerList, advOpts, ownerEggMoveData, ignoreEMs, receivableOnhandPokemon)
    const canReceive = sortByDexNum('NatDexNumL2H', [...receivableBreedablePokemon])

    return {canOffer, canReceive}
}

const reFormatToIndividual = (comparedList, onlyOnePart=false) => {
    if (onlyOnePart) {
        const reFormattedList = []
        comparedList.forEach(pokemon => {
            const forData = pokemon.for !== undefined ? {for: pokemon.for} : {}
            pokemon.balls.forEach(ballData => {
                reFormattedList.push({
                    name: pokemon.name,
                    natDexNum: pokemon.natDexNum,
                    id: pokemon.id,
                    ...forData,
                    ...ballData
                })
            })
        })
        return reFormattedList
    }
    const reFormattedList = {canOffer: [], canReceive: []}
    comparedList.canOffer.forEach((pokemon) => {
        const forData = pokemon.for !== undefined ? {for: pokemon.for} : {}
        pokemon.balls.forEach(ballData => {
            reFormattedList.canOffer.push({
                name: pokemon.name,
                natDexNum: pokemon.natDexNum,
                id: pokemon.id,
                ...forData,
                ...ballData
            })
        })
    })
    comparedList.canReceive.forEach((pokemon) => {
        const forData = pokemon.for !== undefined ? {for: pokemon.for} : {}
        pokemon.balls.forEach(ballData => {
            reFormattedList.canReceive.push({
                name: pokemon.name,
                natDexNum: pokemon.natDexNum,
                id: pokemon.id,
                ...forData,
                ...ballData
            })
        })
    })
    return reFormattedList
}

const reFormatIndividualRow = (comparedList, onlyOnePart=false) => {
    const reFormattedToIndividual = reFormatToIndividual(comparedList, onlyOnePart)
    const reReFormattedList = {canOffer: [], canReceive: []}
    if (onlyOnePart) {
        const reReFormattedList = []
        reFormattedToIndividual.forEach((p, idx) => {
            const pNum = idx+1
            const rowNum = Math.ceil(pNum/6)
            const rowNumUninitialized = reReFormattedList[rowNum-1] === undefined
            if (rowNumUninitialized) {
                reReFormattedList[rowNum-1] = [p]
            } else {
                reReFormattedList[rowNum-1].push(p)
            }
        })
        return reReFormattedList
    }
    reFormattedToIndividual.canOffer.forEach((p, idx) => {
        const pNum = idx+1
        const rowNum = Math.ceil(pNum/6)
        const rowNumUninitialized = reReFormattedList.canOffer[rowNum-1] === undefined
        if (rowNumUninitialized) {
            reReFormattedList.canOffer[rowNum-1] = [p]
        } else {
            reReFormattedList.canOffer[rowNum-1].push(p)
        }
    })
    reFormattedToIndividual.canOffer.forEach((p, idx) => {
        const pNum = idx+1
        const rowNum = Math.ceil(pNum/6)
        const rowNumUninitialized = reReFormattedList.canReceive[rowNum-1] === undefined
        if (rowNumUninitialized) {
            reReFormattedList.canReceive[rowNum-1] = [p]
        } else {
            reReFormattedList.canReceive[rowNum-1].push(p)
        }
    })
    return reReFormattedList
}

export {compareCollections, reFormatToIndividual, reFormatIndividualRow}