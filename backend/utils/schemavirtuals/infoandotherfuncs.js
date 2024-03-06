const gen1Info = require('./../../routes/aprimonAPI/gen1/gen1info')
const gen2Info = require('./../../routes/aprimonAPI/gen2/gen2info')
const gen3Info = require('./../../routes/aprimonAPI/gen3/gen3info')
const gen4Info = require('./../../routes/aprimonAPI/gen4/gen4info')
const gen5Info = require('./../../routes/aprimonAPI/gen5/gen5info')
const gen6Info = require('./../../routes/aprimonAPI/gen6/gen6info')
const gen7Info = require('./../../routes/aprimonAPI/gen7/gen7info')
const gen8Info = require('./../../routes/aprimonAPI/gen8/gen8info')
const gen9Info = require('./../../routes/aprimonAPI/gen9/gen9info')
const {incenseBabiesWithExclusiveEMs, incenseAdultsWithExclusiveEMs, regionalFormMons, altFormMonsWithExclusiveEMs, babiesOfGen1Pokemon, babiesOfGen2Pokemon, babiesOfGen3Pokemon} = require('./../../infoconstants.js')


function selectPokemonInfo(name, pokeGen, natDexNum) {
    if (babiesOfGen1Pokemon.includes(name)) {
        return gen1Info.filter(p => (p.info.special !== undefined) && p.info.special.child.name === name.toLowerCase())[0]
    } else if (babiesOfGen2Pokemon.includes(name)) {
        return gen2Info.filter(p => (p.info.special !== undefined) && p.info.special.child.name === name.toLowerCase())[0]
    } else if (babiesOfGen3Pokemon.includes(name)) {
        return gen3Info.filter(p => (p.info.special !== undefined) && p.info.special.child.name === name.toLowerCase())[0]
    } else {
        const genInfoArr = pokeGen === 1 ? gen1Info : 
            pokeGen === 2 ? gen2Info : 
            pokeGen === 3 ? gen3Info : 
            pokeGen === 4 ? gen4Info :
            pokeGen === 5 ? gen5Info :
            pokeGen === 6 ? gen6Info : 
            pokeGen === 7 ? gen7Info :
            pokeGen === 8 ? gen8Info :
            pokeGen === 9 && gen9Info
        return genInfoArr.filter(pokemon => 
            pokemon.info.natDexNum === natDexNum ||
            (pokemon.info.special !== undefined && pokemon.info.special.child.natDexNum === natDexNum)
            )[0]
    }
}

function exclusiveEMs(emsPath) {
    return emsPath !== undefined ? emsPath : []
}

function handleIncenseMonEMs(eggMoves, game, key) {
    const isBDSP = game === 'bdsp'
    const usumOnlyEMs = game === '7' && eggMoves[`usumAnd${key}FormOnly`] !== undefined ? eggMoves[`usumAnd${key}FormOnly`] : [] //currently not separating collections by SM or USUM so just putting all USUM moves in gen 7 collections, though I could
    const extraEMs = exclusiveEMs(eggMoves[`${key}FormOnly`])
    const extraEMsBDSP = isBDSP && eggMoves[`bdspAnd${key}FormOnly`] !== undefined ? 
        eggMoves[`bdspAnd${key}FormOnly`] : []
    return [...usumOnlyEMs, ...extraEMs, ...extraEMsBDSP]
}

function handleMeowthEMs(eggMoves, name, game) { //meowth EMs get a little confusing when he has 3 regionals and certain EMs can be learned on each one or by 2 of them, etc. and it all depends on the gen
    const isBDSP = game === 'bdsp'
    const isGen7 = game === '7'
    if (name === 'Meowth') {
        return isBDSP ? [...eggMoves.regFormOnly, ...eggMoves.regAndRegionalForm1Only, ...bdspOnly] : [...eggMoves.regFormOnly, ...eggMoves.regAndRegionalForm1Only]
    }
    else if (name === 'Alolan Meowth') {
        return isGen7 ? eggMoves.regionalFormOnly : [...eggMoves.regAndRegionalForm1Only, ...eggMoves.regionalForm1Only]
    } else if (name === 'Galarian Meowth') {
        return [...eggMoves.regionalForm2Only]
    }
}

function handleAlternateFormEMs(eggMoves, name, gen) { //2 alt form pokemon have different EMs currently.
    if (name.includes('Basculin')) {
        if (gen !== '9') {
            return []
        } else {
            if (name.includes('Red-Striped') || name.includes('Blue-Striped')) {
                return eggMoves.altForm1and2Only
            } else {
                return eggMoves.altForm3Only
            }
        }
    } else if (name.includes('Indeedee')) {
        if (name.includes('Male')) {
            return eggMoves.altForm1Only
        } else {
            return eggMoves.altForm2Only
        }
    }
}

const handleDifferentFormEMs = (isRegionalVariant, hasRegionalVariant, incenseMonExclusiveEMs, altFormWithExclusiveEMs, collectionGen, gen, p, eggMovePath, normEMs) => {
    if (collectionGen === 8) {
        const gameExclusiveMoves = exclusiveEMs(eggMovePath[`${gen}Only`])
        if (isRegionalVariant) {
            const extraEMs = exclusiveEMs(eggMovePath.regionalFormOnly)
            if (p.name.includes('Meowth')) {
                return normEMs.concat(handleMeowthEMs(eggMovePath, p.name, gen), gameExclusiveMoves)
            }
            return normEMs.concat(extraEMs, gameExclusiveMoves)
        } else if (hasRegionalVariant && gen !== 'bdsp') {
            const extraEMs = exclusiveEMs(eggMovePath.regFormOnly)
            const farfetchdSwshRegFormMoves = p.name === "Farfetch'd" ? eggMovePath.swshAndRegFormOnly : []
            return normEMs.concat(extraEMs, farfetchdSwshRegFormMoves, gameExclusiveMoves)
        } else if (incenseMonExclusiveEMs) {
            const isBabyMon = incenseBabiesWithExclusiveEMs.includes(p.name)
            const dataKey = isBabyMon ? 'baby' : 'adult'
            return normEMs.concat(handleIncenseMonEMs(eggMovePath, gen, dataKey), gameExclusiveMoves)
        } else if (altFormWithExclusiveEMs) { 
            const extraEMs = handleAlternateFormEMs(eggMovePath, p.name, gen)
            return normEMs.concat(extraEMs)
        } else {
            return normEMs.concat(gameExclusiveMoves)
        }
    } else {
        if (isRegionalVariant) {
            if (p.name.includes('Meowth')) {
                return normEMs.concat(handleMeowthEMs(eggMovePath, p.name, gen))
            }
            return normEMs.concat(exclusiveEMs(eggMovePath.regionalFormOnly))
        } else if (hasRegionalVariant) {
            return normEMs.concat(exclusiveEMs(eggMovePath.regFormOnly))
        } else if (incenseMonExclusiveEMs) {
            const isBabyMon = incenseBabiesWithExclusiveEMs.includes(p.name)
            const dataKey = isBabyMon ? 'baby' : 'adult'
            return normEMs.concat(handleIncenseMonEMs(eggMovePath, gen, dataKey))
        } else if (altFormWithExclusiveEMs) {
            const extraEMs = handleAlternateFormEMs(eggMovePath, p.name, gen)
            return normEMs.concat(extraEMs)
        } 
    }
}

const handleGen8EMs = (eggMovePath, normEMs, game) => {
    const gameExclusiveMoves = exclusiveEMs(eggMovePath[`${game}Only`])
    return normEMs.concat(gameExclusiveMoves)
}

module.exports =  {
    handleGen8EMs, 
    handleDifferentFormEMs, 
    selectPokemonInfo
}