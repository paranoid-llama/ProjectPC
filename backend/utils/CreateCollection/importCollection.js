import { gapIdentifiers, regions, regionalFormNameIdentifiers, originalRegionalFormNameIdentifiers, additionalOriginRegionalFormNameIdentifiers, firstLetterAllowedAltForms, allowedAprimonMultipleDexNums, allowedAprimonDuplicateNum} from '../../common/infoconstants/importconstants.mjs'
import { apriballs } from '../../common/infoconstants/miscconstants.mjs'
import { regionalFormMons, multipleRegionalFormMons, allAltFormMons, interchangeableAltFormMons, nonBreedableAltFormMons, nonBreedableAltRegIdentifiers } from '../../common/infoconstants/pokemonconstants.mjs'
import {setOwnedPokemonList} from './../createCollection.js'
import allPokemon from '../aprimonAPI/allpokemoninfo.js'
import rgbHex from 'rgb-hex'
import { getPossibleEggMoves, getImgLink } from '../schemavirtuals/collectionvirtuals.js'
import { capitalizeFirstLetter } from '../schemavirtuals/infoandotherfuncs.js'

function formatImportQuery(query, lastItem=false) {
    return (query === undefined || typeof query === 'object') ? lastItem ? '' : '&' : lastItem ? `&${query}` : `&${query}&`
}

function setEMQueries(EM1, EM2, EM3, EM4, putFirstAnd) {
    const emQuery = EM1 === undefined ? '' : `${putFirstAnd ? '&' : ''}${EM1}&${EM2}&${EM3}&${EM4}`
    return emQuery
}

function formatImportedValues(type, arr, gapRows, gapIdType='none', colorsArr=[], otherData=[]) {
    //gapIdType essentially controls which arr (dexNum or name, pref dexNum) is used to identify gaps list (to display generation name and categorize list)
    if (type === 'gapIdxs') {
        const gapIdByName = gapIdType === 'names'
        const gapRowIdxs = gapIdByName ? arr.map((v, idx) => {
            const hasGapIdentifier = gapIdentifiers.map((gi) => {
                if (v.length !== 0) {
                    const isRegionName = regions.includes(gi)
                    const check = isRegionName ? v[0].toLowerCase() === gi.toLowerCase() : v[0].toLowerCase().includes(gi.toLowerCase())
                    return check
                }
                return false
            })
            const isGap = v.length === 0 || (hasGapIdentifier.includes(true))
            return isGap ? idx : undefined
        }).filter(idx => idx !== undefined) : 
        arr.map((v, idx) => {
            const isGap = v.length === 0 || (v[0].includes('#') ? (v[0] !== undefined && isNaN((v[0].slice(v[0].indexOf('#')+1), v[0].length))) : (v[0] !== undefined && isNaN(v[0])))  
            return isGap ? idx : undefined
        }).filter(idx => idx !== undefined)
        return gapRowIdxs
    } else if (type === 'dexNum') {
        const formattedDexNums = arr.filter((item, idx) => !gapRows.includes(idx)).flat().map((dexNum) => dexNum.includes('#') ? parseInt(dexNum.slice(dexNum.indexOf('#')+1, dexNum.length)) : parseInt(dexNum))
        return formattedDexNums
    } else if (type === 'names') {
        const formattedNames = arr.filter((item, idx) => !gapRows.includes(idx)).flat()
        return formattedNames
    } else if (type === 'balls') {
        const formattedBallInfo = arr.filter((item, idx) => !gapRows.includes(idx))
        return formattedBallInfo
    } else if (type === 'HA') {
        const isColors = colorsArr.length !== 0
        if (isColors) {
            return formatColorData(arr, gapRows, colorsArr)
        } else {
            return arr.filter((item, idx) => !gapRows.includes(idx)).map((item) => item.includes(true))
        }
    } else if (type === 'emColors') {
        return formatColorData(arr, gapRows, colorsArr)
    } else if (type === 'EMs') {
        const formattedEM1 = arr.filter((item, idx) => !gapRows.includes(idx))
        const formattedEM2 = otherData.EM2.filter((item, idx) => !gapRows.includes(idx))
        const formattedEM3 = otherData.EM3.filter((item, idx) => !gapRows.includes(idx))
        const formattedEM4 = otherData.EM4.filter((item, idx) => !gapRows.includes(idx))
        const fullEMInfo = formattedEM1.map((item, idx) => item.concat(formattedEM2[idx], formattedEM3[idx], formattedEM4[idx]))
        return fullEMInfo
    }
}

const formatColorData = (colorData, gapRows, colors) => {
    const getRoundedRGBValue = (rgbValue) => (Math.round((rgbValue*255)*1000)/1000)
    const formattedArr = colorData.filter((item, idx) => !gapRows.includes(idx)).map((row) => {
        if (Object.keys(row).length === 0) {
            return false
        }
        return row.values.map((cell) => {
            if (cell.userEnteredFormat === undefined) {
                return false
            }
            const hexColor = `#${rgbHex(getRoundedRGBValue(cell.userEnteredFormat.backgroundColor.red), getRoundedRGBValue(cell.userEnteredFormat.backgroundColor.green), getRoundedRGBValue(cell.userEnteredFormat.backgroundColor.blue))}`
            return colors.includes(hexColor)
        }) 
    })
    return formattedArr
}

const detectBadRanges = (data) => {
    const faultyRanges = data.valueRanges.map((valueRange, idx) => valueRange.values === undefined ? `ranges=${valueRange.range}`.replace(/'/g, '') : undefined).filter((range) => range !== undefined)
    const hasFaultyRange = faultyRanges.length !== 0
    const issue = hasFaultyRange ? 'Wrong Column' : 'none'
    return {issue: issue, ranges: faultyRanges}
}

//long note for detecting regional pokemon names in collection imports: 
//Since we support importing every naming convention (first letter region identifiers, region identifying original forms of regional form pokemon, etc), i separated
//the Regional Form Pokemon (RFP) (ex Galarian Meowth) name import and Original Form of Regional Form Pokemon (OFRFP) (ex regular Meowth).
//Supporting these naming conventions can continue indefinitely, but first letter importing (ex Meowth-K and Meowth-A or K-Meowth) wont continue if theres any overlap in the first letters
//but ONLY if they overlap WITHIN OFRFP regions or RFP regions
// ex if a future region name is Paltura with Palturan pokemon, we can't support RFP first letter importing since it overlaps with Paldea. However, OFRFP importing remains unchanged 
// As of March 2024, the set of RFP regions (alola, galar, hisui, paldea) and OFRFP regions (kanto, johto, hoenn, unova, alola(alola only has one and thats decidueye))
// have no internal first letter overlaps. 

const detectRFPInNameImport = (basePokemonName, namesArr, pokemonName, isTauros=false, breed='none', otherBreeds=[]) => { //breed and otherBreeds are an array of identifiers for the breeds (ex Aqua and Water)
    const importedIdx = []
    const setDisplay = {}
    const breedType = isTauros && (breed.includes('Aqua') ? 'Aqua' : breed.includes('Blaze') ? 'Blaze' : 'Combat')
    const isMultipleRegionalFormMon = multipleRegionalFormMons.includes(basePokemonName)
    const regionOfMultipleRegionalFormMon = isMultipleRegionalFormMon && regions.filter((region, idx) => idx >= 6).map((region) => {
        if (pokemonName.toLowerCase().includes(region)) {
            return pokemonName.toLowerCase().slice(0, region.length)
        }
        return undefined
    }).filter(item => item !== undefined)[0]
    const regionalFormPokemonInNames = namesArr.filter((name, idx) => {
        const hasRegionalIdentifier = regionalFormNameIdentifiers.map((identifier) => (name.toLowerCase().includes(identifier)) && (isMultipleRegionalFormMon ? name.toLowerCase().includes(regionOfMultipleRegionalFormMon) : true)).includes(true)
        const isPokemon = name.toLowerCase().includes(basePokemonName.toLowerCase())
        const hasBreedIdentifier = isTauros && breed.map(breedId => name.toLowerCase().includes(breedId.toLowerCase())).includes(true)
        const isNotOtherBreeds = !(otherBreeds.map(breedId => name.toLowerCase().includes(breedId.toLowerCase())).includes(true))
        const isRegionalPokemon = isTauros ? 
            ((isPokemon && hasRegionalIdentifier) && 
            ((breedType === 'Combat' && isNotOtherBreeds) || (hasBreedIdentifier && isNotOtherBreeds))) : 
            (isPokemon && hasRegionalIdentifier)
        if (isRegionalPokemon) {
            importedIdx.push(idx)
            if (name !== pokemonName) {
                setDisplay.displayName = name
            }
        }
        return isRegionalPokemon
    })
    return regionalFormPokemonInNames.length > 0 ? {bool: true, importedIdx: importedIdx[0], ...setDisplay} : {bool: false}
}

//this function checks the name of the original form of regional form pokemon if their naming convention specificies the origin region (ex. Meowth-Kanto).
//by the time this function is called the original form pokemon and the regional form are already separated, so we don't have to worry about overlap with the identifiers or the first letter of the identifiers
const detectOFRFPInNameImport = (pokemonName, namesArr) => {
    const importedIdx = []
    const setDisplay = {}
    const originRegionIdentifiers = additionalOriginRegionalFormNameIdentifiers.pokemonName !== undefined ? [...originalRegionalFormNameIdentifiers, additionalOriginRegionalFormNameIdentifiers.pokemonName] : originalRegionalFormNameIdentifiers
    const regionalFormPokemonInNames = namesArr.filter((name, idx) => {
        const hasOriginRegionIdentifier = originRegionIdentifiers.map((identifier) => name.toLowerCase().includes(identifier)).includes(true)
        const isPokemon = name.includes(pokemonName)
        const isOriginalRegionalPokemon = isPokemon && hasOriginRegionIdentifier
        if (isOriginalRegionalPokemon) {
            importedIdx.push(idx)
            if (name !== pokemonName) {
                setDisplay.displayName = name
            }
        }
        return isOriginalRegionalPokemon
    })
    return regionalFormPokemonInNames.length > 0 ? {bool: true, importedIdx: importedIdx[0], ...setDisplay} : {bool: false}
}

const detectAltFormsInNameImport = (basePokemonName, namesArr, pokemonName, identifier, otherIdentifiers, canFirstLetter) => {
    const nameFormats = canFirstLetter ? [identifier.toLowerCase(), `-${identifier[0].toLowerCase()}`, `${identifier[0].toLowerCase()}-`, ...otherIdentifiers] : [identifier.toLowerCase(), ...otherIdentifiers]
    const otherGender = nameFormats[0] === 'male' ? 'female' : undefined
    const importedIdx = []
    const setDisplay = {}
    const alternateFormPokemonInNames = namesArr.filter((name, idx) => {
        const hasIdentifier = nameFormats.map((format) => {
            if (basePokemonName === 'Minior' && format === 'r-') { //I have to include this if since it catches other forms of minior if formatted like Minior-Blue, and i still want to catch formatting like R-Minior (red minior)
                return (name.toLowerCase().includes(format) && name.indexOf('-') === 1)
            }
            if (nonBreedableAltFormMons.includes(pokemonName)) { //this function takes "Sinistea" and "Poltchageist" (phony forms), which needs to be handled accordingly
                return name.toLowerCase().includes(format) || name.toLowerCase() === basePokemonName.toLowerCase()
            }
            return otherGender !== undefined ? (name.toLowerCase().includes(format) && !name.toLowerCase().includes(otherGender)) : name.toLowerCase().includes(format)
        }).includes(true)
        
        const isPokemon = name.toLowerCase().includes(basePokemonName.toLowerCase())
        // if (basePokemonName === 'Sinistea' && isPokemon) {
        //     console.log(pokemonName)
        //     console.log(name)
        //     console.log(hasIdentifier)
        // }
        const isAltFormPokemon = isPokemon && hasIdentifier
        // if (isPokemon) {
        //     console.log('IS POKEMON!')
        // }
        // if (hasIdentifier) {
        //     console.log('HAS IDENTIFIER!')
        // }
        if (isAltFormPokemon) {
            importedIdx.push(idx)
            if (name !== pokemonName) {
                setDisplay.displayName = name
            }
        }
        return isAltFormPokemon
    })
    // console.log(`1: ${pokemonName} 2:${alternateFormPokemonInNames[0]}`)
    return alternateFormPokemonInNames.length > 0 ? {bool: true, importedIdx: importedIdx[0], ...setDisplay} : {bool: false}
}

//sets isHA/emCount/EMs fields based on params provided to it, so I don't need a million if statements in the setBallData
const checkIfChangeField = (notImportingInfo, field, specificBallComboData, fieldData, idx, peripheryInfo) => {
    const {haFieldImportType='none', possibleEggMoves=[]} = peripheryInfo

    if (specificBallComboData[field] !== undefined && field === 'isHA' && notImportingInfo) {
        return true
    }
    if (field === 'isHA' && !notImportingInfo && specificBallComboData.isHA !== undefined) {
        if (haFieldImportType !== 'colors') {
            if (fieldData === true) {
                return true
            }
        }
        if (haFieldImportType === 'colors') {
            if (fieldData[idx] !== undefined && fieldData[idx] === true) {
                return true
            }
        }
    }
    if (specificBallComboData.EMs !== undefined && !notImportingInfo) {
        if (field === 'emCount') {
            if (fieldData !== undefined && fieldData[idx] !== undefined && fieldData[idx] === true) {
                return true
            }
        }
        if (field === 'EMs') {
            if (fieldData !== undefined && fieldData !== undefined && fieldData.length !== 0) {
                const newEMsArr = fieldData.filter((em) => em !== undefined).filter((em) => possibleEggMoves.map(pem => pem.toLowerCase()).includes(em.toLowerCase()))
                return {changeFields: true, EMs: newEMsArr, emCount: newEMsArr.length}
            }
        }
    } else {
        return false
    }
}

//sets ball info based on ball data import type
const setBallData = (pokemon, importType, ballData, ballOrder, peripheryFieldsImport) => {
    const collectionBallData = pokemon.balls
    const {notImportingHAInfo=true, isHAInfoType, isHAInfo, possibleEggMoves, notImportingEMColors=true, emColorData, notImportingEMs=true, EMData} = peripheryFieldsImport
    const maxEMs = possibleEggMoves !== undefined && (possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length)
    if (importType === 'checkbox') {
        apriballs.forEach((apriball) => {
            if (!ballOrder.includes(apriball) && collectionBallData[apriball] !== undefined) {
                delete collectionBallData[apriball]
            }
        })
        ballOrder.forEach((ball, idx) => {
            const specificBallData = ballData[idx]
            if ((specificBallData === true) && (collectionBallData[ball] !== undefined)) {
                collectionBallData[ball].isOwned = true
                const setIsHATrue = checkIfChangeField(notImportingHAInfo, 'isHA', collectionBallData[ball], isHAInfo, idx, {haFieldImportType: isHAInfoType})
                const setEmCountMax = checkIfChangeField(notImportingEMColors, 'emCount', collectionBallData[ball], emColorData, idx, {haFieldImportType: 'none'})
                const setEMs = checkIfChangeField(notImportingEMs, 'EMs', collectionBallData[ball], EMData, idx, {possibleEggMoves})
                const changingEmCount = setEmCountMax !== undefined && setEmCountMax !== false
                if (setIsHATrue) {
                    collectionBallData[ball].isHA = true
                }
                if (changingEmCount) {
                    collectionBallData[ball].emCount = maxEMs
                }
                if (setEMs !== undefined && setEMs !== false) {
                    if (changingEmCount) {
                        collectionBallData[ball].EMs = setEMs.EMs
                    } else {
                        collectionBallData[ball].EMs = setEMs.EMs
                        collectionBallData[ball].emCount = setEMs.emCount
                    }
                }
            } 
        })
    } else if (importType === 'image') {
        apriballs.forEach((apriball) => {
            if (!ballOrder.includes(apriball) && collectionBallData[apriball] !== undefined) {
                delete collectionBallData[apriball]
            }
        })
        ballOrder.forEach((ball, idx) => {
            const specificBallData = ballData[idx]
            //essentially, if ball is undefined meaning it's trailing at the end of the order list with no data even included in the arr (how formula imports work)
            //OR the pokemon doesnt have the ball combo OR there's no image data
            if ((specificBallData === undefined) || (collectionBallData[ball] === undefined) || specificBallData.trim() === '') {
                null
            } else if (specificBallData.trim() !== '' && specificBallData !== undefined && collectionBallData[ball] !== undefined) {
                collectionBallData[ball].isOwned = true
                const setIsHATrue = checkIfChangeField(notImportingHAInfo, 'isHA', collectionBallData[ball], isHAInfo, idx, {haFieldImportType: isHAInfoType})
                const setEmCountMax = checkIfChangeField(notImportingEMColors, 'emCount', collectionBallData[ball], emColorData, idx, {})
                const setEMs = checkIfChangeField(notImportingEMs, 'EMs', collectionBallData[ball], EMData, idx, {importingEmColors: !notImportingEMColors, possibleEggMoves})
                const changingEmCount = setEmCountMax !== undefined && setEmCountMax !== false
                if (setIsHATrue) {
                    collectionBallData[ball].isHA = true
                }
                if (changingEmCount) {
                    collectionBallData[ball].emCount = maxEMs
                }
                if (setEMs !== undefined && setEMs !== false) {
                    if (changingEmCount) {
                        collectionBallData[ball].EMs = setEMs.EMs
                    } else {
                        collectionBallData[ball].EMs = setEMs.EMs
                        collectionBallData[ball].emCount = setEMs.emCount
                    }
                }
            }
        }) 
    }
    return collectionBallData
}

//this function formats the successful import indexes with respect to the calculated gap rows to get the actual row numbers of the spreadsheet.
const formatImportRow = (importIdx, gapRows, rowStart) => {
    let row = importIdx + rowStart
    gapRows.forEach((gapRow) => {
        if (row > gapRow) {
            row+=1
        }
    })
    return row
}

const setCollection = (identifier, names, ballData, gapRows, ballOrder, collectionGen, rowStart, isHAData=undefined, HADataType, emColorData=undefined, EMData=undefined) => {
    const collection = setOwnedPokemonList(collectionGen, [], [], {}, true).flat().flat().filter(p => p !== undefined)
    // console.log(collection.slice(300, collection.length))
    const identifierType = typeof identifier[0] === 'number' ? 'dexNums' : 'names'
    const notImportingHAInfo = isHAData === undefined
    const notImportingEMColors = emColorData === undefined
    const notImportingEMs = EMData === undefined
    const noDexNums = identifierType !== 'dexNums'
    const successfulImportRows = []
    const possibleUnsuccessfulImportRows = []
    const possibleUnsuccessfulEMImportRows = []
    const formattedNames = names.map((name) => name.toLowerCase().trim())
    const listOrderRef = names.map((name, idx) => {return {name, order: idx}})
    const dexNumOrderRef = identifierType === 'dexNums' ? identifier.map((dexNum, idx) => {return {dexNum, order: idx}}) : formattedNames.map((name, idx) => {return {name, order: idx}})
    const trueGapRows = gapRows.map((gapRow) => gapRow+rowStart)
    // console.log(collection.slice(350))
    const setCollectionScope = collection.filter((pokemon, idx) => {
        // console.log(pokemon.name)
        const isRegionalFormMon = regionalFormMons.map((regionalMon) => pokemon.name.includes(regionalMon)).includes(true)
        const isAltForm = !pokemon.name.includes('Any') && (pokemon.name.includes("(") || pokemon.name.includes('♀') || pokemon.name.includes('♂') || nonBreedableAltFormMons.includes(pokemon.name))
        const isInterchangeableAltFormMon = !isAltForm && interchangeableAltFormMons.map(iAltMon => pokemon.name.includes(iAltMon)).includes(true) // this is singled out as we support interchangeable alt form mons just being a singular entity in collections
        // console.log(`name: ${pokemon.name} isRegionalFormMon: ${isRegionalFormMon}`)
        if (isRegionalFormMon) {
            const isRegionalForm = pokemon.name === 'Mr. Mime' ? pokemon.name.includes('Galarian') : pokemon.name.includes(" ")
            const isTauros = pokemon.name.includes('Paldean Tauros')
            if (isTauros) {
                const breedIdentifiers = pokemon.name.includes('Blaze') ? ['Blaze', 'Fire'] : pokemon.name.includes('Aqua') ? ['Aqua', 'Water'] : ['Combat']
                const otherBreedIdentifiers = breedIdentifiers.includes('Combat') ? ['Aqua', 'Water', 'Blaze', 'Fire'] : breedIdentifiers.includes('Aqua') ? ['Combat', 'Blaze', 'Fire'] : ['Combat', 'Aqua', 'Water']
                const isPokemonInImportedNamesList = detectRFPInNameImport(pokemon.originalPokemon, names, pokemon.name, true, breedIdentifiers, otherBreedIdentifiers) 
                if (isPokemonInImportedNamesList.importedIdx !== undefined) {
                    successfulImportRows.push(formatImportRow(isPokemonInImportedNamesList.importedIdx, trueGapRows, rowStart))
                }
                if (isPokemonInImportedNamesList.displayName !== undefined) {
                    pokemon.displayName = isPokemonInImportedNamesList.displayName
                }
                return isPokemonInImportedNamesList.bool
            }
            if (isRegionalForm) { //with the way this is set up, im only ever comparing regional form pokemon from our naming convention to the identifiers. 
                const isPokemonInImportedNamesList = detectRFPInNameImport(pokemon.originalPokemon, names, pokemon.name)
                if (isPokemonInImportedNamesList.importedIdx !== undefined) {
                    successfulImportRows.push(formatImportRow(isPokemonInImportedNamesList.importedIdx, trueGapRows, rowStart))
                }
                if (isPokemonInImportedNamesList.displayName !== undefined) {
                    pokemon.displayName = isPokemonInImportedNamesList.displayName
                }
                return isPokemonInImportedNamesList.bool
            } else {
                const noOriginRegionIdentifier = formattedNames.map(pokemon => pokemon.trim()).includes(pokemon.name.toLowerCase())
                const isPokemonInImportedNamesList = noOriginRegionIdentifier ? true : detectOFRFPInNameImport(pokemon.name, names)
                if (isPokemonInImportedNamesList.importedIdx !== undefined || isPokemonInImportedNamesList === true) {
                    const idx = noOriginRegionIdentifier ? formattedNames.map(pokemon => pokemon.trim()).indexOf(pokemon.name.toLowerCase()) : isPokemonInImportedNamesList.importedIdx
                    successfulImportRows.push(formatImportRow(idx, trueGapRows, rowStart))
                }
                if (isPokemonInImportedNamesList.displayName !== undefined) {
                    pokemon.displayName = isPokemonInImportedNamesList.displayName
                }
                return isPokemonInImportedNamesList.bool !== undefined ? isPokemonInImportedNamesList.bool : true
            }
        }
        if (isAltForm) {
            const formIdentifier = pokemon.name.includes('♀') ? 'Female' : 
                pokemon.name.includes('♂') ? 'Male' : 
                pokemon.name.includes('Basculin') ? pokemon.name.slice(pokemon.name.indexOf('(') + 1, pokemon.name.indexOf('-')) :
                nonBreedableAltFormMons.includes(pokemon.name) ? nonBreedableAltRegIdentifiers[pokemon.name] : 
                pokemon.name.slice(pokemon.name.indexOf('(') + 1, pokemon.name.indexOf(')'))
            const otherIdentifiers = pokemon.name.includes('Shellos') ? 
                (pokemon.name.includes('East') ? ['blue', '-b', 'b-'] : pokemon.name.includes('West') && ['pink', '-p', 'p-']) : 
                pokemon.name.includes('♀') ? ['♀', '-♀', '♀-'] : pokemon.name.includes('♂') ? ['♂', '-♂', '♂-'] : 
                []
            const isNidoran = pokemon.name.includes('Nidoran')
            const originalPokemon = isNidoran ? 'Nidoran' : nonBreedableAltFormMons.includes(pokemon.name) ? pokemon.name : pokemon.originalPokemon
            // console.log(formIdentifier)
            const canFirstLetter = firstLetterAllowedAltForms.includes(originalPokemon)
            const isPokemonInImportedNamesList = detectAltFormsInNameImport(originalPokemon, names, pokemon.name, formIdentifier, otherIdentifiers, canFirstLetter)
            if (isPokemonInImportedNamesList.importedIdx !== undefined) {
                successfulImportRows.push(formatImportRow(isPokemonInImportedNamesList.importedIdx, trueGapRows, rowStart))
            }
            if (isPokemonInImportedNamesList.displayName !== undefined) {
                pokemon.displayName = isPokemonInImportedNamesList.displayName
            }
            return isPokemonInImportedNamesList.bool
        }
        if (isInterchangeableAltFormMon) {
            //note: pokemon in this section come out as '*pokemonname* (Any)'
            const isPokemonInImportedNamesList = formattedNames.includes(interchangeableAltFormMons.filter(iAltFormMon => pokemon.name.includes(iAltFormMon))[0].toLowerCase())
            const hasOtherFormsInList = !noDexNums ? identifier.filter(dexNum => dexNum === pokemon.natDexNum).length > 1 : formattedNames.filter((name) => name.includes(pokemon.name.slice(0, pokemon.name.indexOf(' ')).toLowerCase().trim())).length > 1
            if (isPokemonInImportedNamesList && hasOtherFormsInList) { //this checks if, for example, the user has 'Oricorio' in their list but also has 'Oricorio (Baile)', and causes 'Oricorio' to fail since the form is unidentified AND other forms are present. the error gets reported in the forEach
                const errorMessage = `Detected ${pokemon.name} (Changeable Alternate Form Pokemon) with an unidentified form name, and other forms of the same pokemon is present. Remove other form names if you want to have any form, or identify the form name.`
                possibleUnsuccessfulImportRows.push({row: formatImportRow(idx, trueGapRows, rowStart), pokemonName: pokemon.name, errorMessage})
                return false
            }
            if (isPokemonInImportedNamesList === true) {
                const idx = formattedNames.indexOf(pokemon.name.toLowerCase())
                successfulImportRows.push(formatImportRow(idx, trueGapRows, rowStart))
            }
            return isPokemonInImportedNamesList
        }
        const isPokemonInImportedNamesList = identifierType === 'dexNums' ? identifier.includes(pokemon.natDexNum) : formattedNames.includes(pokemon.name.toLowerCase())
        if (isPokemonInImportedNamesList === true) {
            const idx = identifierType === 'dexNums' ? identifier.indexOf(pokemon.natDexNum) : formattedNames.indexOf(pokemon.name.toLowerCase())
            successfulImportRows.push(formatImportRow(idx, trueGapRows, rowStart))
        }
        return isPokemonInImportedNamesList
    }).sort((a,b) => {
        const aName = (!noDexNums && (a.displayName === undefined)) ? a.natDexNum : (a.displayName !== undefined && a.displayName !== '') ? a.displayName.toLowerCase().trim() : a.name.toLowerCase().trim()
        const bName = (!noDexNums && (b.displayName === undefined)) ? b.natDexNum : (b.displayName !== undefined && b.displayName !== '') ? b.displayName.toLowerCase().trim() : b.name.toLowerCase().trim()
        const aRef = (!noDexNums && (a.displayName === undefined)) ? dexNumOrderRef[identifier.indexOf(aName)].order : listOrderRef[formattedNames.indexOf(aName)].order
        const bRef = (!noDexNums && (b.displayName === undefined)) ? dexNumOrderRef[identifier.indexOf(bName)].order : listOrderRef[formattedNames.indexOf(bName)].order
        
        if (aRef < bRef) {
            return -1
        } else if (aRef > bRef) {
            return 1
        } else {
            return 1
        }
    })
   
    const possibleEggMoves = (emColorData !== undefined || EMData !== undefined) && getPossibleEggMoves(setCollectionScope, collectionGen)
    
    formattedNames.forEach((pokemonName, idx) => {
        const dexNum = !noDexNums ? identifier[idx] : undefined
        const allowedToHaveDuplicateDexNums = allowedAprimonMultipleDexNums.includes(dexNum)
        const isAnyFormInterchangeableAltFormMon = interchangeableAltFormMons.map(mon => mon.toLowerCase()).includes(pokemonName.toLowerCase())
        const errorInfo = setCollectionScope.map((collectionPokemon) => {
            const isAltFormMon = collectionPokemon.displayName !== undefined
            const useDisplayName = isAltFormMon && collectionPokemon.displayName !== '' 
            const nameComparator = useDisplayName ? collectionPokemon.displayName.toLowerCase().trim() : collectionPokemon.name.toLowerCase().trim()
            const nameIsInList = pokemonName.trim() === nameComparator
            const dexNumIsInList = !noDexNums ? collectionPokemon.natDexNum === dexNum : undefined
            const rightNameWrongNum = !noDexNums ? nameIsInList && !dexNumIsInList : undefined
            const wrongNameRightNum = !noDexNums ? !nameIsInList && dexNumIsInList : undefined
            const nameAndDexNumMismatch = (!noDexNums && !allowedToHaveDuplicateDexNums) ? (rightNameWrongNum || wrongNameRightNum) : undefined
            return noDexNums ? {nameIsInList, collectionName: useDisplayName ? collectionPokemon.displayName : collectionPokemon.name} : {
                nameIsInList, 
                dexNumIsInList, 
                nameAndDexNumMismatch, 
                collectionName: useDisplayName ? collectionPokemon.displayName : collectionPokemon.name, 
                dexNum: collectionPokemon.natDexNum,
                misMatchInfo: nameAndDexNumMismatch ? rightNameWrongNum ? 'rightNameWrongNum' : wrongNameRightNum && 'wrongNameRightNum' : undefined
            }
        })
        const nameDexMismatchObj = errorInfo.filter((info) => info.nameAndDexNumMismatch !== undefined && info.nameAndDexNumMismatch !== false)[0]
        
        const dexNumNotFound = errorInfo.filter(info => info.dexNumIsInList !== undefined && info.dexNumIsInList !== true).length === 0
        const multipleSameDexNum = errorInfo.filter(info => (info.dexNumIsInList !== undefined && info.dexNumIsInList !== true) && info.nameIsInList !== true).length !== 1
        const nameNotFound = errorInfo.filter(info => info.nameIsInList === false).length === 0 
        // console.log(`name: ${pokemonName} dexNumNotFound: ${dexNumNotFound} nameNotFound: ${nameNotFound} nameDexMismatch: ${nameDexMismatchObj}`)
        if (!noDexNums && nameDexMismatchObj !== undefined && nameDexMismatchObj.nameAndDexNumMismatch === true) {
            const errorMessage = nameDexMismatchObj.misMatchInfo === 'rightNameWrongNum' ? `Detected ${nameDexMismatchObj.collectionName} in the imported names column, but they had the wrong dex number (#${dexNum}, expected #${nameDexMismatchObj.dexNum}). Double-check that it imported correctly.` : 
                                    `Detected #${nameDexMismatchObj.dexNum} in the imported dex # column, but they had the wrong name/an unidentified name (${names[idx]}, expected ${nameDexMismatchObj.collectionName}). Double-check that it imported correctly and, if not, that the name and dex # are correct and matching.`
            possibleUnsuccessfulImportRows.push({row: formatImportRow(idx, trueGapRows, rowStart), pokemonName: names[idx], errorMessage})
        } else if (!noDexNums && dexNumNotFound) {
            const hitmonErrorMessage = `Evolved forms of the Tyrogue line are unsupported in aprimon collections.`
            const errorMessage =  `Used Dex #${dexNum} to find the pokemon, but it did not match a pokemon in our database, or it is a pokemon that is unsupported in aprimon collections. Double check that the dex number matches the name ${names[idx]}.` 
            const useHitmonMessage = pokemonName.toLowerCase().includes('hitmon')
            possibleUnsuccessfulImportRows.push({row: formatImportRow(idx, trueGapRows, rowStart), pokemonName: names[idx], errorMessage: useHitmonMessage ? hitmonErrorMessage : errorMessage})
        } else if (nameNotFound) {
            if (isAnyFormInterchangeableAltFormMon) {
                const errorMessage = `Detected '${names[idx]}' (Changeable Alternate Form Pokemon) with an unidentified form name, and other forms of the same pokemon is present. Remove other form names if you want to have any form, or identify the form name.`
                possibleUnsuccessfulImportRows.push({row: formatImportRow(idx, trueGapRows, rowStart), pokemonName: names[idx], errorMessage})
            } else {
                const hitmonErrorMessage = `Evolved forms of the Tyrogue line are unsupported in aprimon collections.`
                const altFormIdentifierMissing = `This pokemon has non-interchangeable alternate forms, and the form name is missing or unidentified. Double-check that it is present, correctly spelled, and conforms to the name format.`
                const errorMessage = `Used Name '${names[idx]}' to find the pokemon, but it did not match a pokemon in our database. Double check that the name is spelled correctly and conforms to the name format.`
                const useHitmonMessage = pokemonName.toLowerCase().includes('hitmon')
                const useAltFormIdentifierMissing = allAltFormMons.map(mon => mon.toLowerCase()).includes(pokemonName)
                possibleUnsuccessfulImportRows.push({row: formatImportRow(idx, trueGapRows, rowStart), pokemonName: names[idx], errorMessage: useHitmonMessage ? hitmonErrorMessage : useAltFormIdentifierMissing ? altFormIdentifierMissing : errorMessage})
            }
        } else if (!noDexNums && multipleSameDexNum) {
            const numOfSameDexNum = identifier.filter((num) => num === dexNum).length 
            
            const multipleSameDexNum = numOfSameDexNum > 1
            const isntWithinAllowedDuplicates = allowedToHaveDuplicateDexNums && (numOfSameDexNum > allowedAprimonDuplicateNum[allowedAprimonMultipleDexNums.indexOf(dexNum)])
            if (multipleSameDexNum && isntWithinAllowedDuplicates) {
                const pokemonSpecies = setCollectionScope.filter((pokemon) => pokemon.displayName !== false && pokemon.displayName === pokemonName)[0].originalPokemon
                const firstIdx = identifier.indexOf(dexNum)
                const lastIdx = identifier.indexOf(dexNum, identifier.indexOf(dexNum)+(numOfSameDexNum-1))
                if (lastIdx === idx) {
                    const errorMessage = `Found a number of pokemon with the same dex number that exceeds the allowed amount (Found ${numOfSameDexNum} ${pokemonSpecies}s, when there should only be max ${allowedAprimonDuplicateNum[allowedAprimonMultipleDexNums.indexOf(dexNum)]}). Double check and ensure everything imported correctly.`
                    possibleUnsuccessfulImportRows.push({row: `${formatImportRow(firstIdx, trueGapRows, rowStart)} - ${formatImportRow(lastIdx, trueGapRows, rowStart)}`, pokemonName: names[idx], errorMessage})
                }
            }
        }
    })

    const checkboxBallData = ballData[0].includes(false) || ballData[0].includes(true)
 
    const setBallInfo = setCollectionScope.map((pokemon, idx) => {

        const allAllowedBallsNotInBallScope = !(Object.keys(pokemon.balls).map(ball => ballOrder.includes(ball)).includes(true))

        if (allAllowedBallsNotInBallScope) {
            const errorMessage = `${capitalizeFirstLetter(pokemon.name)}'s only legal ball combos are balls that you have excluded (${Object.keys(pokemon.balls).map((ball, idx) => `${idx !== 0 ? ' ' : ''}${capitalizeFirstLetter(ball)}`)}), so the import failed.`
            possibleUnsuccessfulImportRows.push({row: formatImportRow(idx, trueGapRows, rowStart), pokemonName: pokemon.name, errorMessage})
            return undefined
        }

        const useName = pokemon.displayName !== undefined
        const useDisplayName = useName && pokemon.displayName !== ''
        const useDexNums = !noDexNums && !useDisplayName && !useName
        const idxIdentifier = useDexNums ? pokemon.natDexNum : useDisplayName ? pokemon.displayName.toLowerCase() : pokemon.name.toLowerCase()
        
        const pokemonIdx = useDexNums ? identifier.indexOf(idxIdentifier) : formattedNames.indexOf(idxIdentifier)

        const importedBallInfo = ballData[pokemonIdx]

        const actualBallInfo = importedBallInfo !== undefined && importedBallInfo
        const noBallData = !checkboxBallData && importedBallInfo !== undefined && importedBallInfo.length === 0

        const specificIsHAData = !notImportingHAInfo && isHAData[pokemonIdx]
        const pokemonPossibleEggMoves = (!notImportingEMColors || !notImportingEMs) && possibleEggMoves[pokemon.name]
        const noEMs = pokemonPossibleEggMoves.length === 0
        const specificEmColorData = !notImportingEMColors && emColorData[pokemonIdx]
        const specificEMData = (!notImportingEMs && pokemonPossibleEggMoves !== undefined) && EMData[pokemonIdx].filter(em => em !== undefined).filter((em) => pokemonPossibleEggMoves.map((pem) => pem.toLowerCase()).includes(em.toLowerCase()))
        const EMsThatDontImport = specificEMData !== false && EMData[pokemonIdx].filter(em => em !== undefined).filter((em) => !pokemonPossibleEggMoves.map(pem => pem.toLowerCase()).includes(em.toLowerCase())).filter(em => em.toLowerCase() !== 'n/a')
        
        if (specificEMData !== undefined && EMsThatDontImport.length !== 0 && !noEMs) {
            possibleUnsuccessfulEMImportRows.push({row: formatImportRow(pokemonIdx, trueGapRows, rowStart), pokemonName: useDisplayName ? pokemon.displayName : pokemon.name, EMs: EMsThatDontImport})
        }
        
        const peripheryFieldsImport = {notImportingHAInfo, isHAInfoType: HADataType, isHAInfo: specificIsHAData,
                                        possibleEggMoves: pokemonPossibleEggMoves, notImportingEMColors, emColorData: specificEmColorData,
                                        notImportingEMs, EMData: specificEMData}

        if (importedBallInfo === undefined || noBallData) {
            return pokemon
        } else {
            const newBallInfo = setBallData(pokemon, checkboxBallData ? 'checkbox' : 'image', importedBallInfo, ballOrder, peripheryFieldsImport)
            pokemon.balls = newBallInfo
            return pokemon
        }
    }).filter(p => p !== undefined)

    //set temporary info
    setBallInfo.forEach((p) => {
        p.imgLink = getImgLink(p)
    })
    
    return {collection: setBallInfo, successfulRows: successfulImportRows.sort((a, b) => a>b ? 1 : -1), possibleUnsuccessfulRows: possibleUnsuccessfulImportRows, possibleUnsuccessfulEMs: !notImportingEMs ? possibleUnsuccessfulEMImportRows : undefined}
}

export {formatImportQuery, setEMQueries, formatImportedValues, setCollection, detectBadRanges}
