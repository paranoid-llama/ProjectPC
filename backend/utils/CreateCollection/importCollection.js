import
    {gapIdentifiers, 
    regions, 
    regionalFormNameIdentifiers, 
    regionalFormMons, multipleRegionalFormMons,
    originalRegionalFormNameIdentifiers, 
    firstLetterAllowedAltForms, 
    interchangeableAltFormMons,
    allowedAprimonMultipleDexNums, allowedAprimonDuplicateNum}
from '../../infoconstants.js'
import {setOwnedPokemonList} from './../createCollection.js'
import allPokemon from '../aprimonAPI/allpokemoninfo.js'
import rgbHex from 'rgb-hex'
import { getPossibleEggMoves } from '../schemavirtuals/collectionvirtuals.js'

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
            const isGap = v.length === 0 || (v[0] !== undefined && isNaN(v[0]))
            return isGap ? idx : undefined
        }).filter(idx => idx !== undefined)
        return gapRowIdxs
    } else if (type === 'dexNum') {
        const formattedDexNums = arr.filter((item, idx) => !gapRows.includes(idx)).flat().map((idx) => parseInt(idx))
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
//long note for detecting regional pokemon names in collection imports: 
//Since we support importing every naming convention (first letter region identifiers, region identifying original forms of regional form pokemon, etc), i separated
//the Regional Form Pokemon (RFP) (ex Galarian Meowth) name import and Original Form of Regional Form Pokemon (OFRFP) (ex regular Meowth).
//Supporting these naming conventions can continue indefinitely, but first letter importing (ex Meowth-K and Meowth-A or K-Meowth) wont continue if theres any overlap in the first letters
//but ONLY if they overlap WITHIN OFRFP regions or RFP regions
// ex if a future region name is Paltura with Palturan pokemon, we can't support first letter importing since it overlaps with Paldea. However, OFRFP importing remains unchanged 
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
        const isPokemon = name.includes(basePokemonName)
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
    const regionalFormPokemonInNames = namesArr.filter((name, idx) => {
        const hasOriginRegionIdentifier = originalRegionalFormNameIdentifiers.map((identifier) => name.toLowerCase().includes(identifier)).includes(true)
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
    const importedIdx = []
    const setDisplay = {}
    const alternateFormPokemonInNames = namesArr.filter((name, idx) => {
        const hasIdentifier = nameFormats.map((format) => {
            if (basePokemonName === 'Minior' && format === 'r-') { //I have to include this if since it catches other forms of minior if formatted like Minior-Blue, and i still want to catch formatting like R-Minior (red minior)
                return (name.toLowerCase().includes(format) && name.indexOf('-') === 1)
            }
            return name.toLowerCase().includes(format)
        }).includes(true)
        const isPokemon = name.includes(basePokemonName)
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
    const {haFieldImportType='none', importingEmColors=false, possibleEggMoves=[]} = peripheryInfo
   
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
    if (specificBallComboData.EMs !== undefined) {
        if (field === 'emCount' && !notImportingInfo) {
            if (fieldData !== undefined && fieldData[idx] !== undefined && fieldData[idx] === true) {
                return true
            }
        }
        if (field === 'EMs' && !notImportingInfo) {
            if (fieldData !== undefined && fieldData[idx] !== undefined && fieldData[idx].length !== 0) {
                const newEMsArr = fieldData[idx].filter((em) => possibleEggMoves.map(pem => pem.toLowerCase()).includes(em.toLowerCase()))
                if (importingEmColors === false) {
                    return {changeFields: true, setEMsOnly: false, EMs: newEMsArr, emCount: newEMsArr.length}
                } else if (importingEmColors === true) {
                    return {changeFields: true, setEMsOnly: true, EMs: newEMsArr}
                }
            }
            
        }
    }
}

//sets ball info based on ball data import type
const setBallData = (pokemon, importType, ballData, ballOrder, peripheryFieldsImport) => {
    const collectionBallData = pokemon.balls
    const {notImportingHAInfo=true, isHAInfoType, isHAInfo, possibleEggMoves, notImportingEMColors=true, emColorData, notImportingEMs=true, EMData} = peripheryFieldsImport
    const maxEMs = possibleEggMoves !== undefined && (possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length)
    if (importType === 'checkbox') {
        ballOrder.forEach((ball, idx) => {
            const specificBallData = ballData[idx]
            if ((ballData[idx] === true) && (collectionBallData[ball] !== undefined)) {
                collectionBallData[ball].isOwned = true
                const setIsHATrue = setFieldToTrue(notImportingHAInfo, 'isHA', collectionBallData[ball], isHAInfo, idx, {haFieldImportType: isHAInfoType})
                const setEmCountMax = checkIfChangeField(notImportingEMColors, 'emCount', collectionBallData[ball], emColorData, idx)
                const setEMs = checkIfChangeField(notImportingEMs, 'EMs', collectionBallData[ball], EMData, idx, {importingEmColors: !notImportingEMColors, possibleEggMoves})
                if (setIsHATrue) {
                    collectionBallData[ball].isHA = true
                }
                if (setEmCountMax) {
                    collectionBallData[ball].emCount = maxEMs
                }
                if (setEMs !== undefined) {
                    if (setEMs.setEMsOnly === false) {
                        collectionBallData[ball].EMs = setEMs.EMs
                        collectionBallData[ball].emCount = setEMs.emCount
                    } else {
                        collectionBallData[ball].EMs = setEMs.EMs
                    }
                }
            } 
        })
    } else if (importType === 'image') {
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
                if (setIsHATrue) {
                    collectionBallData[ball].isHA = true
                }
                if (setEmCountMax) {
                    collectionBallData[ball].emCount = maxEMs
                }
                if (setEMs !== undefined) {
                    if (setEMs.setEMsOnly === false) {
                        collectionBallData[ball].EMs = setEMs.EMs
                        collectionBallData[ball].emCount = setEMs.emCount
                    } else {
                        collectionBallData[ball].EMs = setEMs.EMs
                    }
                }
                // if ((collectionBallData[ball].isHA !== undefined) && notImportingHAInfo) {
                //     collectionBallData[ball].isHA = true
                // }
                // if (collectionBallData[ball].isHA !== undefined && !notImportingHAInfo) {
                //     if (isHAInfoType !== 'colors') {
                //         if (isHAInfo === true) {
                //             collectionBallData[ball].isHA = true
                //         }
                //     }
                //     if (isHAInfoType === 'colors') {
                //         if (isHAInfo[idx] !== undefined && isHAInfo[idx] === true) {
                //             collectionBallData[ball].isHA = true
                //         }
                //     }
                // }  
            }
        }) 
    }
    return collectionBallData
}

//this function formats the successful import indexes with respect to the calculated gap rows to get the actual row numbers of the spreadsheet.
const formatSuccessfulImportRow = (importIdxs, gapRows, rowStart) => {
    const formattedIdxs = importIdxs.map((idx) => {
        const row = idx + rowStart
        gapRows.forEach((gap) => {
            if ((gap + rowStart) < row) {
                row+=1
            }
        })
        return row
    })
    return formattedIdxs
}

const setCollection = (identifier, names, ballData, gapRows, ballOrder, collectionGen, isHAData=undefined, HADataType, emColorData=undefined, EMData=undefined) => {
    const collection = setOwnedPokemonList(collectionGen, {}, true).flat().flat().filter(p => p !== undefined)
    const identifierType = typeof identifier[0] === 'number' ? 'dexNums' : 'names'
    const notImportingHAInfo = isHAData === undefined
    const notImportingEMColors = emColorData === undefined
    const notImportingEMs = EMData === undefined
    const noDexNums = identifierType !== 'dexNums'
    const successfulImportIdxs = []
    const possibleUnsuccessfulImportIdxs = []
    const listOrderRef = names.map((name, idx) => {return {name, order: idx}})
    const dexNumOrderRef = identifierType === 'dexNums' && identifier.map((dexNum, idx) => {return {dexNum, order: idx}})
    const formattedNames = names.map((name) => name.toLowerCase())
    
    // console.log(collection.slice(350))
    const setCollectionScope = collection.filter((pokemon, idx) => {
        // console.log(pokemon.name)
        const isRegionalFormMon = regionalFormMons.map((regionalMon) => pokemon.name.includes(regionalMon)).includes(true)
        const isAltForm = pokemon.name.includes("(") || pokemon.name.includes('♀') || pokemon.name.includes('♂')
        const isInterchangeableAltFormMon = !isAltForm && interchangeableAltFormMons.includes(pokemon.name) // this is singled out as we support interchangeable alt form mons just being a singular entity in collections
        // console.log(`name: ${pokemon.name} isRegionalFormMon: ${isRegionalFormMon}`)
        if (isRegionalFormMon) {
            const isRegionalForm = pokemon.name.includes(" ")
            const isTauros = pokemon.name.includes('Paldean Tauros')
            if (isTauros) {
                const breedIdentifiers = pokemon.name.includes('Blaze') ? ['Blaze', 'Fire'] : pokemon.name.includes('Aqua') ? ['Aqua', 'Water'] : ['Combat']
                const otherBreedIdentifiers = breedIdentifiers.includes('Combat') ? ['Aqua', 'Water', 'Blaze', 'Fire'] : breedIdentifiers.includes('Aqua') ? ['Combat', 'Blaze', 'Fire'] : ['Combat', 'Aqua', 'Water']
                const isPokemonInImportedNamesList = detectRFPInNameImport(pokemon.originalPokemon, names, pokemon.name, true, breedIdentifiers, otherBreedIdentifiers) 
                if (isPokemonInImportedNamesList.importedIdx !== undefined) {
                    successfulImportIdxs.push(isPokemonInImportedNamesList.importedIdx)
                }
                if (isPokemonInImportedNamesList.displayName !== undefined) {
                    pokemon.displayName = isPokemonInImportedNamesList.displayName
                }
                return isPokemonInImportedNamesList.bool
            }
            if (isRegionalForm) { //with the way this is set up, im only ever comparing regional form pokemon from our naming convention to the identifiers. 
                const isPokemonInImportedNamesList = detectRFPInNameImport(pokemon.originalPokemon, names, pokemon.name)
                if (isPokemonInImportedNamesList.importedIdx !== undefined) {
                    successfulImportIdxs.push(isPokemonInImportedNamesList.importedIdx)
                }
                if (isPokemonInImportedNamesList.displayName !== undefined) {
                    pokemon.displayName = isPokemonInImportedNamesList.displayName
                }
                return isPokemonInImportedNamesList.bool
            } else {
                const isPokemonInImportedNamesList = names.map(pokemon => pokemon.trim()).includes(pokemon.name) ? true : detectOFRFPInNameImport(pokemon.name, names)
                if (isPokemonInImportedNamesList.importedIdx !== undefined) {
                    successfulImportIdxs.push(isPokemonInImportedNamesList.importedIdx)
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
                pokemon.name.slice(pokemon.name.indexOf('(') + 1, pokemon.name.indexOf(')'))
            const otherIdentifiers = pokemon.name.includes('♀') ? ['♀', '-♀', '♀-'] : pokemon.name.includes('♂') ? ['♂', '-♂', '♂-'] : []
            // console.log(formIdentifier)
            const isNidoran = pokemon.name.includes('Nidoran')
            const canFirstLetter = firstLetterAllowedAltForms.includes(pokemon.originalPokemon) || (isNidoran && firstLetterAllowedAltForms.includes(pokemon.name))  
            const isPokemonInImportedNamesList = detectAltFormsInNameImport(isNidoran ? 'Nidoran' : pokemon.originalPokemon, names, pokemon.name, formIdentifier, otherIdentifiers, canFirstLetter)
            if (isPokemonInImportedNamesList.importedIdx !== undefined) {
                successfulImportIdxs.push(isPokemonInImportedNamesList.importedIdx)
            }
            if (isPokemonInImportedNamesList.displayName !== undefined) {
                pokemon.displayName = isPokemonInImportedNamesList.displayName
            }
            return isPokemonInImportedNamesList.bool
        }
        if (isInterchangeableAltFormMon) {
            const isPokemonInImportedNamesList = names.includes(pokemon.name)
            if (isPokemonInImportedNamesList === true) {
                successfulImportIdxs.push()
            }
            return isPokemonInImportedNamesList
        }
        const isPokemonInImportedNamesList = identifierType === 'dexNums' ? identifier.includes(pokemon.natDexNum) : formattedNames.includes(pokemon.name.toLowerCase())
        if (isPokemonInImportedNamesList === true) {
            successfulImportIdxs.push()
        }
        return isPokemonInImportedNamesList
    }).sort((a,b) => {
        const aName = (!noDexNums && (a.displayName === undefined)) ? a.natDexNum : (a.displayName !== undefined && a.displayName !== '') ? a.displayName.toLowerCase() : a.name.toLowerCase()
        const bName = (!noDexNums && (b.displayName === undefined)) ? b.natDexNum : (b.displayName !== undefined && b.displayName !== '') ? b.displayName.toLowerCase() : b.name.toLowerCase()
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
    const possibleEggMoves = (emColorData !== undefined) && getPossibleEggMoves(setCollectionScope, collectionGen)
    
    formattedNames.forEach((pokemonName, idx) => {
        if (noDexNums) {
            const isInList = setCollectionScope.map((collectionPokemon) => {
                const nameComparator = collectionPokemon.displayName !== undefined && collectionPokemon.displayName !== '' ? collectionPokemon.displayName : collectionPokemon.name
                return pokemonName === nameComparator
            }).filter((thing) => thing !== false)[0]
            if (isInList !== true) {
                possibleUnsuccessfulImportIdxs.push(idx)
            }
        } else {
            const dexNum = identifier[idx]
            if (dexNum === undefined) { //frankly idk if this should ever happen. it possibly can if the user doesnt populate the dex num in that one row for whatever reason.
                possibleUnsuccessfulImportIdxs.push(idx)
            } else {
                const numOfSameDexNum = identifier.filter((num) => num === dexNum).length 
                const multipleSameDexNum = numOfSameDexNum > 1
                const isAllowedToHaveDuplicates = allowedAprimonMultipleDexNums.includes(dexNum)
                const isntWithinAllowedDuplicates = isAllowedToHaveDuplicates && (numOfSameDexNum > allowedAprimonDuplicateNum[allowedAprimonMultipleDexNums.indexOf(dexNum)])
                if (multipleSameDexNum && isntWithinAllowedDuplicates) {
                    possibleUnsuccessfulImportIdxs.push(idx)
                }
            }
        }
    })

    const checkboxBallData = ballData[0].includes(false) || ballData[0].includes(true)
 
    const setBallInfo = setCollectionScope.map((pokemon, idx) => {
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
        const specificEmColorData = !notImportingEMColors && emColorData[pokemonIdx]
        const specificEMData = (!notImportingEMs && pokemonPossibleEggMoves !== undefined) && EMData[pokemonIdx]
        
        const peripheryFieldsImport = {notImportingHAInfo, isHAInfoType: HADataType, isHAInfo: specificIsHAData,
                                        possibleEggMoves, notImportingEMColors, emColorData: specificEmColorData,
                                        notImportingEMs, EMData: specificEMData}

        if (importedBallInfo === undefined || noBallData) {
            return pokemon
        } else {
            const newBallInfo = setBallData(pokemon, checkboxBallData ? 'checkbox' : 'image', importedBallInfo, ballOrder, peripheryFieldsImport)
            pokemon.balls = newBallInfo
            return pokemon
        }
        
    })
    return setBallInfo
}

export {formatImportQuery, setEMQueries, formatImportedValues, setCollection}
