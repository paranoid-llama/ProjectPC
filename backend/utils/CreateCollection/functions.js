// import { apriballLiterals, specialBalls } from '../../../common/infoconstants/miscconstants.js'
import { apriballLiterals, specialBalls, homeCompatibleGames, genGames } from '../../common/infoconstants/miscconstants.mjs'
import { uniqueAlternateFormPokemon, uniqueRegionalFormPokemon } from '../../common/infoconstants/pokemonconstants.mjs'

//JSON.parse(JSON.stringify(ownedBallList)) ---- this makes a new ref for the owned ball list allowing changes in one alt form to not affect the other

// function getGroupFromAPI(pokemon, collectionGen) {
//     //gets a bit messy since the scope data is organized differently depending on the gen
//     const breedableNonBreedableNoNested = collectionGen === 6 || collectionGen === 'bdsp'
//     const info = pokemon.info
//     if (info.regionalForm && info.special) { //currently only applies to Mr. Mime as of April 2024 (pokemon with regional form and baby pre-evolution)
//         return {group: 'babyAdultMons', subGroup: info.special.incenseMon === true ? 'incense' : 'regular'}
//     } else if (info.regionalForm) {
//         //group: legendaries applies to the kanto bird trio, which will be caught in this section of the if stack. no other mons with regional form mons (and who
//         //have .regionalForms in the info section) belong in groups other than breedables.
//         return breedableNonBreedableNoNested ? {group: 'breedables'} :  info.legendary === true ? {group: 'legendaries'} : {group: 'breedables', subGroup: 'regionalForms'}
//     } else if (info.special) {
//         return {group: 'babyAdultMons', subGroup: info.special.incenseMon === true ? 'incense' : 'regular'}
//     } else if (info.evolvedRegional && breedableNonBreedableNoNested) {
//         return {group: 'babyAdultMons', subGroup: info.special.incenseMon === true ? 'incense' : 'regular'}
//     } else if (info.legendary) {
//         return {group: 'legendaries'}
//     } else if (info.nonBreedable) {
//         return breedableNonBreedableNoNested ? {group: 'nonBreedables'} : {group: 'nonBreedables', subGroup: info.ultraBeast === true ? 'ultraBeasts' : info.paradoxPokemon === true ? 'paradoxPokemon' : 'regular'}
//     } else {
//         return breedableNonBreedableNoNested {group: 'breedables'}
//     }
// }

function handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen, importing=false, setType=false, alternateFormScope={}, otherRequiredScope=[]) {
    const multiplePokemon = []
    const nonBreedableAltForm = pokemon.info.alternateForm.nonBreedable !== undefined
    const altForms = pokename !== 'Alcremie' && (pokemon.info.specialAlternateForms !== undefined ? Object.keys(pokemon.info.specialAlternateForms.name) : pokename === 'Vivillon' ? pokemon.info.alternateForm.name : Object.keys(pokemon.info.alternateForm.name))
    const altFormType = setType ? {type: 'alternateForms'} : {}
    const altFormNestedType = setType ? 
        pokemon.info.alternateForm.interchangeable !== undefined ? {nestedType: 'interchangeable'} : 
        nonBreedableAltForm ? {nestedType: 'nonBreedable'} : 
        pokename === 'Vivillon' ? {nestedType: 'vivillon'} : 
        pokename === 'Alcremie' ? {nestedType: 'alcremie'} : {nestedType: 'breedable'} : {}
    const importAltIdentifier = importing ? {originalPokemon: pokename} : {}
    if (uniqueAlternateFormPokemon.includes(pokename)) {
        const handlerFunction = pokename === 'Basculin' ? handleBasculin : 
                                pokename === 'Rockruff' ? handleRockruff : 
                                pokename === 'Flabébé' ? handleFlabébé : 
                                pokename === 'Vivillon' && handleVivillon
        const specificScope = pokename === 'Vivillon' ? alternateFormScope.vivillon : pokename === 'Alcremie' ? alternateFormScope.alcremie : alternateFormScope.breedable
        return pokename === 'Alcremie' ? 
            handleAlcremie(pokemon.info.alternateForm.sweets, pokemon.info.alternateForm.creams, pokename, pokemon, ownedBallList, parsedGen, importing, setType, altFormType, altFormNestedType, specificScope) : 
            handlerFunction(altForms, pokename, pokemon, ownedBallList, parsedGen, importing, setType, altFormType, altFormNestedType, specificScope)
    } else {
        altForms.forEach((form, idx) => {
            const formName = pokemon.info.alternateForm.name[form]
            const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))} 
            //we add stipulation below since ppl collecting nonbreedable alt form (as of april 2024, only sinistea and poltchageist antiques) is very rare, so we mark
            //the phony form as just the regular pokemon
            //though we set the display name
            const finalName = (nonBreedableAltForm && idx === 0) ? pokename : pokename + ' ' + `(${formName})`
            const specificScope = nonBreedableAltForm ? (idx === 0 ? otherRequiredScope : alternateFormScope.nonBreedable) : pokemon.info.alternateForm.interchangeable !== undefined ? alternateFormScope.interchangeable : alternateFormScope.breedable
            const includeMon = (importing || setType) ? true : specificScope.filter(mon => mon.name === finalName).length !== 0
            // const displayName = (setType || !importing) ? {} : (nonBreedableAltForm && idx === 0) ? {displayName: pokename + ' ' + `(${formName})`} : {displayName: ''}
            const displayName = (setType || !importing) ? {} : {displayName: ''}
            const fullType = (nonBreedableAltForm && idx === 0 && setType) ? {type: 'breedables', nestedType: 'regular'} : {...altFormType, ...altFormNestedType}
            if (includeMon) {
                multiplePokemon.push(
                    {
                        name: finalName,
                        ...displayName,
                        natDexNum: pokemon.info.natDexNum,
                        gen: pokemon.gen,
                        ...balls,
                        ...fullType,
                        ...importAltIdentifier
                    }
                )
            }
        })
    }
    return multiplePokemon
}

function handleRegionalForms(pokemonInfo, ownedBallList, pokename, gen, multiplePokemonArr, importing=false, setType=false, regionalFormScope=[], regularFormScope=[]) {
    const copyOfArr = multiplePokemonArr
    const regionalForms = pokemonInfo.info.regionalForm.forms
    const importAltIdentifier = importing ? {originalPokemon: pokename} : {}
    const altFormType = setType ? {type: 'breedables'} : {}
    const altFormNestedType = setType ? {nestedType: 'regionalForms'} : {}
    const displayName = (setType || !importing) ? {} : {displayName: ''}
    if (uniqueRegionalFormPokemon.includes(pokename)) {
        const handlerFunction = pokename === 'Tauros' && handlePaldeanTauros
        const specificScope = pokename === 'Tauros' ? regionalFormScope.filter(mon => mon.name.includes('Tauros')) : []
        return handlerFunction(regionalForms, pokename, pokemonInfo, ownedBallList, gen, multiplePokemonArr, importing, setType, altFormType, altFormNestedType, specificScope)
    } else {
        regionalForms.forEach((regionF) => {
            const formName = regionF.name + " " + capitalizeFirstLetter(pokename)
            const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
            const isInGen = gen === 'home' ? homeCompatibleGames.filter(gameData => getBallPath(pokemonInfo, gen, '', '', false, true) === gameData.game && gameData.compatible).length !== 0 : gen >= regionF.gen
            const includePokemon = ((importing || setType) && isInGen) ? true : (isInGen && regionalFormScope.filter(mon => mon.name === formName).length !== 0)
            if (includePokemon) {
                copyOfArr.push(
                    {
                        name: formName,
                        ...displayName,
                        natDexNum: pokemonInfo.info.natDexNum,
                        gen: pokemonInfo.gen,
                        ...balls,
                        ...altFormType,
                        ...altFormNestedType,
                        ...importAltIdentifier
                    }
                )
            }
        })
    }
    return copyOfArr
}

function setBallInfo(pokemon, genKey, ballLegality, isHomeCollection=false) {
    const hasHAAndIsLegal = (pokemon.info.HA.hasHA && (ballLegality.haIsLegal === true)) || (ballLegality.haIsLegal === true && pokemon.name === 'ferroseed') 
    //ferroseed is the only one who escapes this since his evo has an HA but he doesn't, but people tend to collect him as having HA anyway. I do not believe
    //there will be another exception like this, so I'm singling him out here. 

    // const hasEMs = isHomeCollection ? (getBallPath(pokemon, 'home', '', '', true).eggmoves ? true : false) : (pokemon.specificGenInfo[genKey].eggmoves ? true : false)
    const hasEMs = isHomeCollection ? false : (pokemon.specificGenInfo[genKey].eggmoves ? true : false) //ems are disabled for home collections
    if (hasHAAndIsLegal === false && hasEMs === false) {
        return {isOwned: false}
    } else if (hasHAAndIsLegal === true && hasEMs === false) {
        return {isOwned: false, isHA: false}
    } else if (hasHAAndIsLegal === false && hasEMs === true) {
        return {isOwned: false, emCount: 0, EMs: []}
    } else {
        return {isOwned: false, isHA: false, emCount: 0, EMs: []}
    }
}

function getBallPath(pokemon, gen, formattedGen, game, getPathWithEMs=false, getImportedGen=false) {
    if (gen === 'home') {
        const genInfos = Object.keys(pokemon.specificGenInfo)
        const latestGen = pokemon.name === 'spinda' ? pokemon.specificGenInfo.gen7 : pokemon.specificGenInfo[genInfos[genInfos.length-1]]
        // ^^ as of june 2024 spinda still cannot be transferred between bdsp/home, so there are actually more legal balls in gen 7 than there are in gen 8 for spinda.
        //very likely this is a one off and we won't see another pokemon like this again, so we'll set it as the only exception
        if (latestGen.balls.apriball === undefined) { //indicates its a gen with two games, such as gen 8 with SWSH and BDSP
            const games = Object.keys(latestGen.balls)
            const availableGamesToTakeLegality = games.filter(game => homeCompatibleGames.filter(hGame => hGame.game === game && hGame.compatible).length !== 0)
            const latestCompatibleGameLegality = latestGen.balls[availableGamesToTakeLegality[availableGamesToTakeLegality.length-1]]
            if (getImportedGen) {
                return availableGamesToTakeLegality[availableGamesToTakeLegality.length-1]
            }
            return getPathWithEMs ? latestGen : latestCompatibleGameLegality
        } else {
            if (getImportedGen) {
                return parseInt(pokemon.name === 'spinda' ? '7' : genInfos[genInfos.length-1].slice(3))
            }
            return getPathWithEMs ? latestGen : latestGen.balls
        }
    } else if (game !== "") {
        return getPathWithEMs ? pokemon.specificGenInfo[formattedGen] : pokemon.specificGenInfo[formattedGen].balls[game]
    } else {
        return getPathWithEMs ? pokemon.specificGenInfo[formattedGen] : pokemon.specificGenInfo[formattedGen].balls
    }
}

function capitalizeFirstLetter(pokename) {
    return pokename.charAt(0).toUpperCase() + pokename.slice(1)
}

//this function handles baby and incense mons - mons where the user needs to have one or the other. no overlap so i can separate both cases.
function handleIncenseAndBabyMons(pokemon) {
    if (pokemon.info.special === undefined) {
        const pokename = capitalizeFirstLetter(pokemon.name)
        const pokeNatDexNum = pokemon.info.natDexNum
        const pokeGen = pokemon.gen
        return { pokename, pokeNatDexNum, pokeGen }
    }
    //when importing we make an instance of a collection with every pokemon, then filter by their name list. therefore we need both adult and baby.
    else {
        const adultChildType = pokemon.info.special.hasBabyMon ? 'regular' : 'incense'
        const child = pokemon.info.special.child
        const childName = capitalizeFirstLetter(child.name)
        const childNatDexNum = child.natDexNum
        const childGen = child.gen
        const adultName = capitalizeFirstLetter(pokemon.name)
        const adultNatDexNum = pokemon.info.natDexNum
        const adultGen = pokemon.gen
        return {childName, childNatDexNum, childGen, adultName, adultNatDexNum, adultGen, adultChildType}
    }
}

//this function returns an owned ball list based on legality
function setOwnedBallList(genKey, ballLegality, fullPokemonInfo, onlyGettingLegalBalls=false, isHomeCollection=false) {
    const ownedBallList = {}
    const legalBalls = []
    if (ballLegality.apriball.isLegal === true) {
        apriballLiterals.forEach((b) => {
            
            ownedBallList[b] = setBallInfo(fullPokemonInfo, genKey, ballLegality.apriball, isHomeCollection)
        })
        legalBalls.push('apriball')
    } 
    specialBalls.forEach((b) => {
        if (b === 'beast' && genKey === 'gen6') {
            null
        } else if (ballLegality[b].isLegal === true) {
            legalBalls.push(b)
            ownedBallList[b] = setBallInfo(fullPokemonInfo, genKey, ballLegality[b], isHomeCollection)
        }
    })
    return onlyGettingLegalBalls ? legalBalls : ownedBallList
}

function removeBallsOutsideScope(pokemon, ballScope, excludedCombos, importedBallInfo) {
    const newPokemon = pokemon
    const noImportedBallInfo = importedBallInfo === undefined || Object.keys(importedBallInfo).length === 0
    if (Array.isArray(newPokemon)) {
        newPokemon.forEach((poke, idx) => {
            const hasExcludedCombos = excludedCombos[poke.name] !== undefined
            const particularPokemonHasNoBallInfo = pokemon === undefined || !noImportedBallInfo && importedBallInfo[idx] === undefined || (!noImportedBallInfo && importedBallInfo[idx] !== undefined && newPokemon !== undefined && importedBallInfo[idx].name !==  newPokemon[idx].name)
            Object.keys(poke.balls).forEach(ball => {
                if (!noImportedBallInfo && !particularPokemonHasNoBallInfo) {
                    newPokemon[idx].balls[ball] = importedBallInfo.filter(pokeInfo => pokeInfo.name === poke.name)[0].balls[ball]
                }
                if (!ballScope.includes(ball)) {
                    delete newPokemon[idx].balls[ball]
                    return 
                }
                if (hasExcludedCombos && excludedCombos[poke.name].excludedBalls.includes(ball)) {
                    newPokemon[idx].balls[ball].disabled = true
                }
            })
        })
    } else {
        const hasExcludedCombos = excludedCombos[newPokemon.name] !== undefined
        Object.keys(newPokemon.balls).forEach(ball => {
            if (!noImportedBallInfo) {
                newPokemon.balls[ball] = importedBallInfo.balls[ball]
            }
            if (!ballScope.includes(ball)) {
                delete newPokemon.balls[ball]
                return 
            }
            if (hasExcludedCombos && excludedCombos[newPokemon.name].excludedBalls.includes(ball)) {
                newPokemon.balls[ball].disabled = true
            }
        })
    } 
    return newPokemon
}

//these functions apply to alternate form pokemon who have special cases, and must be singled out. see infoconstants/uniqueAlternateFormPokemon for more info. 
function handleBasculin(altForms, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}, breedableAltFormScope=[]) {
    const multiplePokemon = []
    const displayName = (setType || !importing) ? {} : {displayName: ''}
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach(form => {
        const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
        const formName = name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`
        const whiteStriped = formName.includes('White-Striped')
        const includeWhiteStriped = (whiteStriped && (gen >= 9 || gen === 'home'))
        const includeMon = (importing || setType) ? true : breedableAltFormScope.filter(mon => mon.name === formName).length !== 0
        if (((whiteStriped && includeWhiteStriped) || (!whiteStriped)) && includeMon) {
            multiplePokemon.push(
                {
                    name: formName,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            )
        }
    })
    return multiplePokemon
}

function handleRockruff(altForms, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}, breedableAltFormScope=[]) {
    const multiplePokemon = []
    const displayName = (setType || !importing) ? {} : {displayName: ''} 
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach((form) => {
        const formName = name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`
        const includeMon = (importing || setType) ? true : breedableAltFormScope.filter(mon => mon.name === formName).length !== 0
        if (pokemonInfo.info.alternateForm.name[form] === 'Dusk' && includeMon) {
            const copyOfOwnedBallList = JSON.parse(JSON.stringify(ownedBallList))
            Object.keys(ownedBallList).forEach(ball => {
                delete copyOfOwnedBallList[ball].isHA
            })
            const diffBalls = setType ? {} : {balls: copyOfOwnedBallList} 
            multiplePokemon.push(
                {
                    name: formName,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...diffBalls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            )
        } else {
            if (includeMon) {
                multiplePokemon.push(
                    {
                        name: formName,
                        ...displayName,
                        natDexNum: pokemonInfo.info.natDexNum,
                        gen: pokemonInfo.gen,
                        ...balls,
                        ...altFormType,
                        ...altFormNestedType,
                        ...importAltIdentifier
                    }
                )
            }
        }
    })
    return multiplePokemon
}

function handleFlabébé(altForms, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}, breedableAltFormScope=[]) {
    const multiplePokemon = []
    const displayName = (setType || !importing) ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach(form => {
        const formName = name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`
        const includeMon = (importing || setType) ? true : breedableAltFormScope.filter(mon => mon.name === formName).length !== 0
        if (gen === 7 && form === 'Blue' && includeMon) {
            const copyOfOwnedBallList = JSON.parse(JSON.stringify(ownedBallList))
            Object.keys(ownedBallList).forEach(ball => {
                delete copyOfOwnedBallList[ball].isHA
            })
            const diffBalls = setType ? {} : {balls: copyOfOwnedBallList}
            multiplePokemon.push(
                {
                    name: formName,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...diffBalls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            ) 
        } else {
            if (includeMon) {
                multiplePokemon.push(
                    {
                        name: formName,
                        ...displayName,
                        natDexNum: pokemonInfo.info.natDexNum,
                        gen: pokemonInfo.gen,
                        ...balls,
                        ...altFormType,
                        ...altFormNestedType,
                        ...importAltIdentifier
                    }
                )
            }
        }
    })
    return multiplePokemon
}

function handleVivillon(patterns, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}, vivillonFormScope=[]) {
    const multiplePokemon = []
    const displayName = (setType || !importing) ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    const adjustedPatterns = gen === 7 ? patterns.filter(p => p !== 'Fancy') : patterns //fancy pattern is an event only pattern in gen 6/7, and when vivillon was reintroduced in scarlet/violet, it became the ONLY pattern obtainable. Funny.
    adjustedPatterns.forEach(pattern => {
        const formName = name + ' ' + `(${pattern})`
        const includeMon = (importing || setType) ? true : vivillonFormScope.filter(mon => mon.name === formName).length !== 0
        if (includeMon) {
            multiplePokemon.push(
                {
                    name: formName,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            )
        }
    })
    return multiplePokemon
}

function handleAlcremie(sweets, creams, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}, alcremieFormScope) {
    const multiplePokemon = []
    const allAlcremieForms = []
    const displayName = (setType || !importing) ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    for (let sweet of sweets) {
        for (let cream of creams) {
            allAlcremieForms.push(`${sweet} ${cream}`)
        }
    }
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    allAlcremieForms.forEach(alcremieForm => {
        const formName = name + ' ' + `(${alcremieForm})`
        const includeMon = (importing || setType) ? true : alcremieFormScope.filter(mon => mon.name === formName).length !== 0
        if (includeMon) {
            multiplePokemon.push(
                {
                    name: formName,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            )
        }
    })
    return multiplePokemon
}


//these functions apply to regional form pokemon who have special cases, and must be singled out. see infoconstants/uniqueRegionalFormPokemon for more info.
function handlePaldeanTauros(regionalForms, name, pokemonInfo, ownedBallList, gen, multiplePokemonArr, importing=false, setType=false, altFormType={}, altFormNestedType={}, paldeanTaurosScope=[]) {
    const copyOfArr = multiplePokemonArr
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    const displayName = (setType || !importing) ? {} : {displayName: ''}
    regionalForms.forEach((regionF) => {
        if ((regionF.gen <= gen) || gen === 'home') {
            const formName1 = regionF.name + " " + capitalizeFirstLetter(name) //Paldean Tauros
            const formName2 = regionF.name + " " + capitalizeFirstLetter(name) + " " + `(${regionF.special[0]})` //Paldean Tauros (Blaze)
            const formName3 = regionF.name + " " + capitalizeFirstLetter(name) + " " + `(${regionF.special[1]})` //Paldean Tauros (Aqua)
            const includeForm1 = (importing || setType) ? true : paldeanTaurosScope.filter(mon => mon.name === formName1).length !== 0
            const includeForm2 = (importing || setType) ? true : paldeanTaurosScope.filter(mon => mon.name === formName2).length !== 0
            const includeForm3 = (importing || setType) ? true : paldeanTaurosScope.filter(mon => mon.name === formName3).length !== 0
            if (includeForm1) {
                const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
                copyOfArr.push({
                    name: formName1,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                })
            }
            if (includeForm2) {
                const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
                copyOfArr.push({
                    name: formName2,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                })
            }
            if (includeForm3) {
                const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
                copyOfArr.push({
                    name: formName3,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                })
            }
        }
    })
    return copyOfArr
}



export {handleAlternateForms, handleRegionalForms, handleIncenseAndBabyMons, setBallInfo, getBallPath, setOwnedBallList, removeBallsOutsideScope}