import { apriballLiterals } from "../../../common/infoconstants/miscconstants.mjs"
import { interchangeableAltFormMons } from "../../../common/infoconstants/pokemonconstants.mjs"

const getPokemonChange = (individualPokeInfo, monAdded, currAddedPoke, currRemovedPoke, groupChanges=false, oldGroupFormData, newGroupFormData) => {
    //monAdded is if the mon was NOT selected when the user clicked, and is now selected. can be gathered from the onChange
    if (groupChanges !== true) {
        const removeFromChangesArr = {addedPokemon: false, removedPokemon: false}
        currAddedPoke.forEach(mon => {
            if (individualPokeInfo.id === mon.id) {
                removeFromChangesArr.addedPokemon = true
            }
        })
        currRemovedPoke.forEach(mon => {
            if (individualPokeInfo.id === mon.id) {
                removeFromChangesArr.removedPokemon = true
            }
        }) 
        const addToAnArr = !Object.values(removeFromChangesArr).includes(true)
        const addToArr = addToAnArr && (monAdded ? 'addedPoke' : 'removedPoke')
        const newAddedPokeArr = removeFromChangesArr.addedPokemon ? currAddedPoke.filter(mon => mon.id !== individualPokeInfo.id) : addToArr === 'addedPoke' ? [...currAddedPoke, individualPokeInfo] : currAddedPoke
        const newRemovedPokeArr = removeFromChangesArr.removedPokemon ? currRemovedPoke.filter(mon => mon.id !== individualPokeInfo.id) : addToArr === 'removedPoke' ? [...currRemovedPoke, individualPokeInfo] : currRemovedPoke
        return {addedPokemon: newAddedPokeArr, removedPokemon: newRemovedPokeArr}
    } else {
        const oldGroupIds = oldGroupFormData.map(mon => mon.id)
        const newGroupIds = newGroupFormData.map(mon => mon.id)
        const uniqueInOld = oldGroupFormData.filter(mon => newGroupIds.indexOf(mon.id) === -1)
        const uniqueInNew = newGroupFormData.filter(mon => oldGroupIds.indexOf(mon.id) === -1)
        const updatedPokemon = [...uniqueInOld, ...uniqueInNew]
        const pokemonChangesArrs = {addedPokemon: currAddedPoke, removedPokemon: currRemovedPoke}

        for (let pokemon of updatedPokemon) {
            const removeFromChangesArr = {addedPokemon: false, removedPokemon: false}
            const monWasAdded = newGroupFormData.filter(mon => mon.id === pokemon.id).length !== 0
            currAddedPoke.forEach(mon => {
                if (pokemon.id === mon.id) {
                    removeFromChangesArr.addedPokemon = true
                }
            })
            currRemovedPoke.forEach(mon => {
                if (pokemon.id === mon.id) {
                    removeFromChangesArr.removedPokemon = true
                }
            }) 
            const addToAnArr = !Object.values(removeFromChangesArr).includes(true)
            const addToArr = addToAnArr && (monWasAdded ? 'addedPoke' : 'removedPoke')
            if (!addToAnArr) {
                if (removeFromChangesArr.addedPokemon) {
                    pokemonChangesArrs.addedPokemon = pokemonChangesArrs.addedPokemon.filter(mon => mon.id !== pokemon.id)
                } else {
                    pokemonChangesArrs.removedPokemon = pokemonChangesArrs.removedPokemon.filter(mon => mon.id !== pokemon.id)
                }
            } else if (addToArr === 'addedPoke') {
                pokemonChangesArrs.addedPokemon = [...pokemonChangesArrs.addedPokemon, pokemon]
            } else if (addToArr === 'removedPoke') {
                pokemonChangesArrs.removedPokemon = [...pokemonChangesArrs.removedPokemon, pokemon]
            }
        }
        return pokemonChangesArrs
    }
    
}

const scopeSingleChange = (groupInfo, pokemonInfo, formData, updatePokemonChange=false, currAddedPoke=[], currRemovedPoke=[]) => {
    const {group, subGroup} = groupInfo
    const {name, id, natDexNum} = pokemonInfo

    const hasSubGroup = subGroup !== undefined
    const selected = hasSubGroup ? formData[group][subGroup].map(mon => mon.id).includes(id) : formData[group].map(mon => mon.id).includes(id)
    const oldFormData = hasSubGroup ? formData[group][subGroup] : formData[group]
    if (selected) {
        const newScopeFormData = hasSubGroup ? 
            {...formData, [group]: {...formData[group], [subGroup]: formData[group][subGroup].filter(poke => poke.id !== id)}} :
            {...formData, [group]: formData[group].filter(poke => poke.id !== id)}
        if (updatePokemonChange) {
            const newPokemonChangesData = getPokemonChange(pokemonInfo, false, currAddedPoke, currRemovedPoke)
            return {pokemon: newScopeFormData, ...newPokemonChangesData}
        }
        return newScopeFormData
    } else {
        const newScopeFormData = hasSubGroup ? 
            {...formData, [group]: {...formData[group], [subGroup]: [...formData[group][subGroup], {name, natDexNum, id}]}} :
            {...formData, [group]: [...formData[group], {name, natDexNum, id}]}
        if (subGroup === 'interchangeable') {
            const selectingAny = !name.includes('(') || name.includes('Any')
            const selectingForm = name.includes('(') && !name.includes('Any')
            if (selectingAny) {
                newScopeFormData.alternateForms.interchangeable = newScopeFormData.alternateForms.interchangeable.filter(poke => (!poke.id.includes(natDexNum) || (poke.id.includes(natDexNum) && (!poke.name.includes('(') || poke.name.includes('Any')))))
                if (updatePokemonChange) {
                    const newPokemonChangesData = getPokemonChange({}, false, currAddedPoke, currRemovedPoke, true, oldFormData, newScopeFormData.alternateForms.interchangeable)
                    return {pokemon: newScopeFormData, ...newPokemonChangesData}
                }
            } else if (selectingForm) {
                newScopeFormData.alternateForms.interchangeable = newScopeFormData.alternateForms.interchangeable.filter(poke => (poke.id !== `${natDexNum}-a` && poke.id !== `${natDexNum}-any`))
                if (updatePokemonChange) {
                    const newPokemonChangesData = getPokemonChange({}, false, currAddedPoke, currRemovedPoke, true, oldFormData, newScopeFormData.alternateForms.interchangeable)
                    return {pokemon: newScopeFormData, ...newPokemonChangesData}
                }
            }
        }
        if (updatePokemonChange) {
            const newPokemonChangesData = getPokemonChange(pokemonInfo, true, currAddedPoke, currRemovedPoke)
            return {pokemon: newScopeFormData, ...newPokemonChangesData}
        }
        return newScopeFormData
    }
}

const filterLegalBalls = (scopeTotal, ballScope, massType, hasSubGroup, groupInfo) => {
    const {group, subGroup} = groupInfo
    const totalList = hasSubGroup ? scopeTotal[group][subGroup] : scopeTotal[group]
    const currentBallsLegality = ballScope.map(ball => apriballLiterals.includes(ball) ? 'apriball' : ball)
    const currentBallsFormatted = currentBallsLegality.filter((ball, idx) => currentBallsLegality.indexOf(ball) === idx)
    const filteredMons = totalList.filter(mon => mon.legalBalls.map(lB => currentBallsFormatted.includes(lB)).includes(true))

    const finalList = massType === 'any' ? filteredMons.map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}}).filter(poke => !(poke.name.includes('(')) || (poke.name.includes('Any'))) :
        massType === 'allForms' ? filteredMons.map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}}).filter(poke => poke.name.includes('(') && !poke.name.includes('Any')) : 
        filteredMons.map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}})

    return finalList
}

const getFormDataPath = (formData, massType, groupInfo, hasSubGroup) => {
    const {group, subGroup} = groupInfo
    const pokemonFormDataPath = hasSubGroup ? 
            massType === 'any' ? formData[group][subGroup].filter(poke => !(poke.name.includes('(')) || (poke.name.includes('Any'))) :
            massType === 'allForms' ? formData[group][subGroup].filter(poke => poke.name.includes('(') && !poke.name.includes('Any')):
            formData[group][subGroup] : formData[group]
    return pokemonFormDataPath
}

const scopeMassChange = (groupInfo, massType, formData, scopeTotal, ballScope, updatePokemonChange=false, currAddedPoke=[], currRemovedPoke=[]) => {
    const {group, subGroup} = groupInfo
    //mass types --- all (include all), none (include none), Babies (include all babies), Adults (include all Adults), 
    //               any (include all 'any' in interchangeable alt forms), allForms (include all forms in interchangeable alt forms)
    const adjustedSubGroup = group === 'babyAdultMons' ? `${subGroup}${massType}` : subGroup
    const hasSubGroup = subGroup !== undefined
    if (group === 'babyAdultMons' && massType === 'none') {
        const newScopeFormData = {...formData, [group]: {...formData[group], [`${subGroup}Babies`]: [], [`${subGroup}Adults`]: []}}
        if (updatePokemonChange) {
            const allOldFormData = [...formData[group][`${subGroup}Babies`], ...formData[group][`${subGroup}Adults`]]
            const newPokemonChangesData = getPokemonChange({}, false, currAddedPoke, currRemovedPoke, true, allOldFormData, [])
            return {pokemon: newScopeFormData, ...newPokemonChangesData}
        }
        return newScopeFormData
    }

    const totalPath = filterLegalBalls(scopeTotal, ballScope, massType, hasSubGroup, {group, subGroup: adjustedSubGroup})
    const formDataPath = getFormDataPath(formData, massType, {group, subGroup: adjustedSubGroup}, hasSubGroup)
    const doNothing = massType === 'none' ? formDataPath.length === 0 : totalPath.length === formDataPath.length
    if (doNothing) {
        return 'doNothing'
    } else if (massType === 'none') {
        const newScopeFormData = hasSubGroup ? 
            {...formData, [group]: {...formData[group], [adjustedSubGroup]: []}} : 
            {...formData, [group]: []}
        
        if (updatePokemonChange) {
            const newPokemonChangesData = getPokemonChange({}, false, currAddedPoke, currRemovedPoke, true, hasSubGroup ? formData[group][adjustedSubGroup] : formData[group], [])
            return {pokemon: newScopeFormData, ...newPokemonChangesData}
        }

        return newScopeFormData
    } else {
        const newScopeFormData = hasSubGroup ? 
            {...formData, [group]: {...formData[group], [adjustedSubGroup]: totalPath}} : 
            {...formData, [group]: totalPath}

        if (updatePokemonChange) {
            const newPokemonChangesData = getPokemonChange({}, false, currAddedPoke, currRemovedPoke, true, hasSubGroup ? formData[group][adjustedSubGroup] : formData[group], hasSubGroup ? newScopeFormData[group][adjustedSubGroup] : newScopeFormData[group])
            return {pokemon: newScopeFormData, ...newPokemonChangesData}
        }

        return newScopeFormData
    }
}

const ballScopeChange = (ball, ballFormData, pokemonFormData, scopeOneArr, useRemovedPokemonArr=false, removedPokemonArr=[]) => {
    const ballSelected = ballFormData.includes(ball)
    const newBallArr = ballSelected ? ballFormData.filter(b => b !== ball) : [...ballFormData, ball]
    if (newBallArr.length === 0) {
        return 'doNothing'
    }
    if (useRemovedPokemonArr && !ballSelected) {
        const individualBallLegality = apriballLiterals.includes(ball) ? 'apriball' : ball
        const currentBallsLegality = newBallArr.map(ball => apriballLiterals.includes(ball) ? 'apriball' : ball)
        const currentBallsFormatted = currentBallsLegality.filter((ball, idx) => currentBallsLegality.indexOf(ball) === idx)
        const nowHasApriballLiterals = currentBallsFormatted.includes('apriball')
        const nowHasSpecialBall = !apriballLiterals.includes(ball)
        if (nowHasApriballLiterals || nowHasSpecialBall) {
            const newRemovedPokemonArr = removedPokemonArr.filter(mon => !mon.legalBalls.includes(individualBallLegality))
            const removedFromRemovedList = removedPokemonArr.length !== newRemovedPokemonArr.length
            if (removedFromRemovedList) {
                return {ballFormData: newBallArr, changePokemonScope: true, newRemovedPokemonArr}
            }     
        }
    }
    if (ballSelected) {//if we're removing a ball, this checks if the ball is the only legal combo for certain pokemon and excludes them
        const currentBallsLegality = newBallArr.map(ball => apriballLiterals.includes(ball) ? 'apriball' : ball)
        const currentBallsFormatted = currentBallsLegality.filter((ball, idx) => currentBallsLegality.indexOf(ball) === idx)
        const hasNoApriballLiterals = !currentBallsFormatted.includes('apriball')
        const hasNoSpecialBall = !apriballLiterals.includes(ball) && !currentBallsFormatted.includes(ball)
        if (hasNoApriballLiterals || hasNoSpecialBall) {
            const pokemonToRemove = scopeOneArr.filter(mon => (
                // mon.legalBalls.length === 1 && mon.legalBalls[0] === 'apriball'
                !mon.legalBalls.map(lB => currentBallsFormatted.includes(lB)).includes(true)
            ))
            const removedPokemon = pokemonToRemove.length !== 0
            if (useRemovedPokemonArr && removedPokemon) {
                return {ballFormData: newBallArr, changePokemonScope: true, newRemovedPokemonArr: pokemonToRemove}
            }
            if (removedPokemon) { 
                //below is used to remove any reference to the original obj, since we don't spread into it with this one. idk if this is necessary but i think itll avoid issues
                const newFormData = JSON.parse(JSON.stringify(pokemonFormData)) 
                pokemonToRemove.forEach((pokemon) => {
                    const valuePath = pokemon.subGroup === undefined ? newFormData[pokemon.group] : newFormData[pokemon.group][pokemon.subGroup]
                    if (pokemon.subGroup !== undefined) {
                        newFormData[pokemon.group][pokemon.subGroup] = valuePath.filter(p => p.id !== pokemon.imgLink)
                    } else {
                        newFormData[pokemon.group] = valuePath.filter(p => p.id !== pokemon.imgLink)
                    }
                })
                return {ballFormData: newBallArr, changePokemonScope: true, newPokemonScopeData: newFormData}
            }
        }
    }
    return {ballFormData: newBallArr, changePokemonScope: false}
}

const excludedCombosChange = (monInfo, ball, combosFormData) => {
    const firstMonExclusion = combosFormData[monInfo.name] === undefined
    const monCombosState = firstMonExclusion ? {natDexNum: monInfo.natDexNum, imgLink: monInfo.imgLink, excludedBalls: [ball]} : 
        combosFormData[monInfo.name].excludedBalls.includes(ball) ? 
            {...combosFormData[monInfo.name], excludedBalls: combosFormData[monInfo.name].excludedBalls.filter(b => b !== ball)} : 
            {...combosFormData[monInfo.name], excludedBalls: [...combosFormData[monInfo.name].excludedBalls, ball]} 

    if (monCombosState.excludedBalls.length === 0) {
        const fullExcludedCombosState = {...combosFormData}
        delete fullExcludedCombosState[monInfo.name]
        return fullExcludedCombosState
    } else {
        const fullExcludedCombosState = {...combosFormData, [monInfo.name]: monCombosState}
        return fullExcludedCombosState
    }
}

const getExcludedCombosChange = (oldExcludedCombos, newExcludedCombos) => {
    const pokemonArr1 = Object.keys(oldExcludedCombos)
    const pokemonArr2 = Object.keys(newExcludedCombos)
    const uniquePokemon = {removedPokemon: [...pokemonArr1.filter(name => !pokemonArr2.includes(name))], addedPokemon: [...pokemonArr2.filter(name => !pokemonArr1.includes(name))]}
    const oneArrUniqueMons = Object.values(uniquePokemon).flat()
    const ballChanges = {}
    pokemonArr1.forEach(mon => {
        if (oneArrUniqueMons.includes(mon)) {
            null
        } else {
            const oldBallsArr = oldExcludedCombos[mon].excludedBalls
            const newBallsArr = newExcludedCombos[mon].excludedBalls
            const uniqueBalls = {removedBalls: [...oldBallsArr.filter(ball => !newBallsArr.includes(ball))], addedBalls: [...newBallsArr.filter(ball => !oldBallsArr.includes(ball))]}
            
            const oneArrUniqueBalls = Object.values(uniqueBalls).flat()
            if (oneArrUniqueBalls.length !== 0) {
                const unchangedBalls = oldBallsArr.filter(ball => newBallsArr.includes(ball))
                ballChanges[mon] = {natDexNum: oldExcludedCombos[mon].natDexNum, imgLink: oldExcludedCombos[mon].imgLink, ...uniqueBalls, unchangedBalls}
            }
        }
    })
    if ((oneArrUniqueMons.length !== 0) || (Object.keys(ballChanges).length !== 0)) {
        return {
            changed: true, 
            pokemonChange: {
                removedPokemon: uniquePokemon.removedPokemon.map(pName => {return {name: pName, ...oldExcludedCombos[pName]}}),
                addedPokemon: uniquePokemon.addedPokemon.map(pName => {return {name: pName, ...newExcludedCombos[pName]}})
            }, 
            ballChange: Object.keys(ballChanges).map(pName => {return {name: pName, ...ballChanges[pName]}})
        }
    } else {
        return {changed: false}
    }
}

const creationInitializeScopeFormData = (importedCollection, pokemonGroups, collectionGen) => {
    const noImport = Object.values(importedCollection).length === 0
    const pokemonGroupKeys = Object.keys(pokemonGroups)
    const formData = {}
    const formDataMonFormat = (monInfo) => {return {name: monInfo.name, natDexNum: monInfo.natDexNum, id: monInfo.imgLink}}
    const noRegionalForms = collectionGen === 6 || collectionGen === 'bdsp'
    pokemonGroupKeys.forEach((group) => {
        const nestedGroups = Object.keys(pokemonGroups[group])
        const hasNestedGroups = !Array.isArray(pokemonGroups[group])
        if (hasNestedGroups) { //theres only 2 layers to these groups
            formData[group] = {}
            nestedGroups.forEach((nestedGroup) => {
                formData[group][nestedGroup] = []
            })
        } else {
            formData[group] = []
        }
    })
    if (noImport) {
        const hasBabyAdultMonSection = pokemonGroups.babyAdultMons !== undefined //accounting for the possibility a gen does not have any baby/adult mons (though idk if thisll ever happen since pikachu exists)
        const hasAlternateFormSection = pokemonGroups.alternateForms !== undefined 
        if (pokemonGroups.breedables.regionalForms !== undefined) {
            formData.breedables.regionalForms = pokemonGroups.breedables.regionalForms.map((pinfo) => formDataMonFormat(pinfo))  
        }
        if (Array.isArray(formData.breedables)) {
            formData.breedables = pokemonGroups.breedables.map((pinfo) => formDataMonFormat(pinfo))
        } else {
            formData.breedables.regular = pokemonGroups.breedables.regular.map((pinfo) => formDataMonFormat(pinfo))
        }
        if (hasBabyAdultMonSection) {
            if (pokemonGroups.babyAdultMons.regularBabies !== undefined) {
                formData.babyAdultMons.regularBabies = pokemonGroups.babyAdultMons.regularBabies.map((pinfo) => formDataMonFormat(pinfo))
            }
            if (pokemonGroups.babyAdultMons.incenseAdults !== undefined) {
                formData.babyAdultMons.incenseAdults = pokemonGroups.babyAdultMons.incenseAdults.map((pinfo) => formDataMonFormat(pinfo))
            }
        }
        if (hasAlternateFormSection) {
            if (pokemonGroups.alternateForms.breedable !== undefined) {
                formData.alternateForms.breedable = pokemonGroups.alternateForms.breedable.map((pinfo) => formDataMonFormat(pinfo))
            }
            if (pokemonGroups.alternateForms.interchangeable !== undefined) {
                formData.alternateForms.interchangeable = pokemonGroups.alternateForms.interchangeable.filter(pinfo => pinfo.name.includes('(')).map((pinfo) => formDataMonFormat(pinfo))
                }
            }
        return formData
    } else {
        importedCollection.forEach((pokemon) => {
            const fields = {field: ''}
            Object.keys(pokemonGroups).forEach((groupName) => {
                const hasNestedGroups = !Array.isArray(pokemonGroups[groupName])
                if (hasNestedGroups) {
                    const nestedGroupKeys = Object.keys(pokemonGroups[groupName])
                    const nestedGroups = Object.values(pokemonGroups[groupName])
                    nestedGroups.forEach((nestedGroup, nGrIdx) => {
                        nestedGroup.forEach((pokemonInGroup) => {
                            const comparator = interchangeableAltFormMons.includes(pokemonInGroup.name) ? `${pokemonInGroup.name} (Any)` : pokemonInGroup.name
                            if (comparator === pokemon.name) {
                                fields.field = groupName
                                fields.nestedField = nestedGroupKeys[nGrIdx]
                            }
                        })
                    })
                } else {
                    pokemonGroups[groupName].forEach((pokemonInGroup) => {
                        if (pokemonInGroup.name === pokemon.name) {
                            fields.field = groupName
                        }
                    })
                }
            })
            if (fields.nestedField !== undefined) {
                formData[fields.field][fields.nestedField].push(formDataMonFormat(pokemon))
            } else {
                formData[fields.field].push(formDataMonFormat(pokemon))
            }
        })
        return formData
    }
}

export {scopeSingleChange, scopeMassChange, ballScopeChange, excludedCombosChange, getExcludedCombosChange, creationInitializeScopeFormData}