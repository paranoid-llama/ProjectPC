import {useNavigate} from "react-router-dom";
import { createNewCollection } from "../../utils/functions/backendrequests/newcollection";
import { useState, useTransition, useRef, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import {Box, Typography, Button} from "@mui/material";
import Header from "../components/titlecomponents/subcomponents/header";
import BodyWrapper from "../components/partials/routepartials/bodywrapper";
import BodyWithBanner from "../components/partials/routepartials/bodywithbanner";
import CreationProgress from "../components/collectioncreation/creationprogress";
import CollectionTypeSelection from "../components/collectioncreation/stepcomponents/typeselection/collectiontypeselection";
import ImportSelection from "../components/collectioncreation/stepcomponents/importselection/shared/importselection";
import ScopeSelection from "../components/collectioncreation/stepcomponents/scopeselection/shared/scopeselection";
import OptionSelection from "../components/collectioncreation/stepcomponents/optionsselection/shared/optionselection";
import ReviewFinalizeBase from "../components/collectioncreation/stepcomponents/finalize/shared/reviewfinalizebase";
import { selectAdjArrItem, capitalizeFirstLetter } from "../../utils/functions/misc";
import { getPokemonGroups } from "../../utils/functions/backendrequests/getpokemongroups";
import { ballIntros, apriballs, genGames } from "../infoconstants";
import { sortByDexNum, customSortCollectionListLogic } from "../../utils/functions/sortfilterfunctions/sortingfunctions";
import './newCollection.css'

export default function NewCollection(userid) {
    const navigate = useNavigate()
    const steps = [0, 25, 50, 75, 100]
    //progressBar and body should be the exact same always, just separating it allows the body to update later and apply transition effects via keyframes
    // const [creationProgress, setCreationProgress] = useState({progressBar: 0, body: 0})
    const [creationProgress, setCreationProgress] = useState(0)
    const [formBodyProgress, setFormBodyProgress] = useState(0)

    const progressRef = useRef(creationProgress)
    const [formData, setFormData] = useState({})
   
    // console.log(`Ref value: ${progressRef.current} progressBarValue: ${creationProgress}`)

    const getSlideClasses = (stepPercent) => {
        if (stepPercent === progressRef.current || stepPercent === creationProgress) {
            if (progressRef.current === creationProgress) {
                return 'none'
            }
            if (stepPercent === creationProgress) {
                const slideClass = progressRef.current > creationProgress ? 'creation-step-slide-right-enter' : 'creation-step-slide-left-enter'
                return slideClass
            }
            if (stepPercent === progressRef.current) {
                const slideClass = progressRef.current > creationProgress ? 'creation-step-slide-right-exit' : 'creation-step-slide-left-exit'
                return slideClass
            }
        } else {
            return 'none'
        }
    }

    const slideClasses = {
        step1: getSlideClasses(0),
        step2: getSlideClasses(25),
        step3: getSlideClasses(50),
        step4: getSlideClasses(75),
        step5: getSlideClasses(100)
    }

    useEffect(() => {
        progressRef.current = creationProgress
    }, [creationProgress])


    const handleCollectionTypeChange = (e, type, subType, subTypeValue) => {
        setFormData({collectionType: {type, subType, subTypeValue}})
        setCreationProgress(25)
        //allows transition effect to occur. if can be improved please do, as this solution re-renders the component twice
        setTimeout(() => {
            setFormBodyProgress(25)
        }, 500)
    }

    const getScopeFormData = (importedCollection, pokemonGroups, collectionGen) => {
        const noImport = Object.values(importedCollection).length === 0
        const pokemonGroupKeys = Object.keys(pokemonGroups)
        const formData = {}
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
                formData.breedables.regionalForms = pokemonGroups.breedables.regionalForms.map((pinfo) => {return {name: pinfo.name, natDexNum: pinfo.natDexNum, id: pinfo.imgLink}})  
            }
            if (Array.isArray(formData.breedables)) {
                formData.breedables = pokemonGroups.breedables.map((pinfo) => {return {name: pinfo.name, natDexNum: pinfo.natDexNum, id: pinfo.imgLink}})
            } else {
                formData.breedables.regular = pokemonGroups.breedables.regular.map((pinfo) => {return {name: pinfo.name, natDexNum: pinfo.natDexNum, id: pinfo.imgLink}})
            }
            if (hasBabyAdultMonSection) {
                if (pokemonGroups.babyAdultMons.regularBabies !== undefined) {
                    formData.babyAdultMons.regularBabies = pokemonGroups.babyAdultMons.regularBabies.map((pinfo) => {return {name: pinfo.name, natDexNum: pinfo.natDexNum, id: pinfo.imgLink}})
                }
                if (pokemonGroups.babyAdultMons.incenseAdults !== undefined) {
                    formData.babyAdultMons.incenseAdults = pokemonGroups.babyAdultMons.incenseAdults.map((pinfo) => {return {name: pinfo.name, natDexNum: pinfo.natDexNum, id: pinfo.imgLink}})
                }
            }
            if (hasAlternateFormSection) {
                if (pokemonGroups.alternateForms.breedable !== undefined) {
                    formData.alternateForms.breedable = pokemonGroups.alternateForms.breedable.map((pinfo) => {return {name: pinfo.name, natDexNum: pinfo.natDexNum, id: pinfo.imgLink}})
                }
                if (pokemonGroups.alternateForms.interchangeable !== undefined) {
                    formData.alternateForms.interchangeable = pokemonGroups.alternateForms.interchangeable.filter(pinfo => pinfo.name.includes('(')).map((pinfo) => {return {name: pinfo.name, natDexNum: pinfo.natDexNum, id: pinfo.imgLink}})
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
                                if (pokemonInGroup.name === pokemon.name) {
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
                    formData[fields.field][fields.nestedField].push({name: pokemon.name, natDexNum: pokemon.natDexNum, id: pokemon.imgLink})
                } else {
                    formData[fields.field].push({name: pokemon.name, natDexNum: pokemon.natDexNum, id: pokemon.imgLink})
                }
            })
            return formData
        }
    }

    //aggregates all pokemongroup data into one array and assigns group and subgroup keys to each pokemon. used for mass changes to particular pokemon (such
    //as changing ball scope) which requires their group/subgroup data to change the form data.
    const getOneArrData = (pokemonGroups, includeGroups=true, onlyIds=false) => {
        const groupKeys = Object.keys(pokemonGroups)
        const groupKeysWithSubGroups = groupKeys.filter(gK => !(Array.isArray(pokemonGroups[gK])))
        const subGroupKeys = {}
        groupKeysWithSubGroups.forEach(gK => {
            subGroupKeys[gK] = Object.keys(pokemonGroups[gK])
        })
        const groupKeysWithoutSubGroups = groupKeys.filter(gK => !groupKeysWithSubGroups.includes(gK))

        const totalPokemonData = []

        groupKeysWithSubGroups.forEach((gK) => {
            subGroupKeys[gK].forEach((sGK) => {
                const groupInfo = includeGroups ? {group: gK, subGroup: sGK} : {}
                totalPokemonData.push(pokemonGroups[gK][sGK].map(mon => {return onlyIds ? mon.id !== undefined ? mon.id : mon.imgLink : {...mon, ...groupInfo}}))
            })
        })
        groupKeysWithoutSubGroups.forEach(gK => {
            const groupInfo = includeGroups ? {group: gK} : {}
            totalPokemonData.push(pokemonGroups[gK].map(mon => {return onlyIds ? mon.id !== undefined ? mon.id : mon.imgLink : {...mon, ...groupInfo}}))
        })

        return !onlyIds ? sortByDexNum('NatDexNumL2H', totalPokemonData.flat()) : totalPokemonData.flat()
    }

    const setScopeState = async(importedCollection, collectionGen, ballScope) => {
        const pokemonGroups = await getPokemonGroups(collectionGen)
        const scopeFormData = getScopeFormData(importedCollection, pokemonGroups, collectionGen)
        const oneArrTotal = getOneArrData(pokemonGroups)
        const customSortState = Object.values(importedCollection).length !== 0 ? {customSort: importedCollection.map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}})} : {}
        setFormData({...formData, importedCollection, ballScope, scope: {gen: collectionGen, total: pokemonGroups, formData: scopeFormData, oneArrTotal}, ...customSortState})
    }

    const handleImportedCollectionChange = (e, data, ballScope=[]) => {
        setCreationProgress(50)
        const genNum = typeof formData.collectionType.subTypeValue === 'string' && formData.collectionType.subTypeValue !== 'home' ? genGames.filter(data => data.games.includes(formData.collectionType.subTypeValue))[0].gen : formData.collectionType.subTypeValue
        const baseBalls = formData.collectionType.subTypeValue !== 'home' ? apriballs.filter(ball => ballIntros[ball] !== undefined ? ballIntros[ball] <= genNum : true) : apriballs
        const fullBallScope = {total: baseBalls, importedBallScope: ballScope, formData: ballScope.length === 0 ? baseBalls : ballScope}
        setTimeout(() => {
            if (formData.scope === undefined || formData.scope.gen !== formData.collectionType.subTypeValue) {
                //if they go to the scope selection screen and go back to change the collection gen, this updates it as scope obj keeps track of its gen
                setScopeState(data, formData.collectionType.subTypeValue, fullBallScope)
                
            }
            setFormBodyProgress(50)
        }, 500)
        //this function re-renders the component 3 times (instead of 2) to work. if there's a way to make this more efficient please do.
    }

    const setOptionsInitialState = (pokemonScope, ballScope, excludedCombos) => {
        const formattedFormDataScope = formData.scope.oneArrTotal.map(mon => mon.imgLink)
        const unchangedScope = !getOneArrData(pokemonScope, false, true).map(id => formattedFormDataScope.includes(id)).includes(false)
        const userImportedCollection = Object.values(formData.importedCollection).length !== 0
        const customSortState = (!userImportedCollection || !unchangedScope) ? {customSort : getOneArrData(pokemonScope, false)} : {} 
            //if the user imported a collection AND the scope is unchanged, then the sort state doesnt update itself (it is set if they imported a collection in setScopeState)
        const newFormDataState = formData.options !== undefined ? {...formData, ballScope: {...formData.ballScope, formData: ballScope}, scope: {...formData.scope, formData: pokemonScope, excludedCombos, unchangedScope}, options: {...formData.options, sorting: {...formData.options.sorting, ...customSortState}}} : 
            {...formData, ballScope: {...formData.ballScope, formData: ballScope}, scope: {...formData.scope, formData: pokemonScope, excludedCombos, unchangedScope}, ...customSortState}
        setFormData(newFormDataState)
    }

    const handleScopeSelection = (e, pokemonScope, ballScope, excludedCombos) => {
        setOptionsInitialState(pokemonScope, ballScope, excludedCombos)
        setCreationProgress(75)
        setTimeout(() => {
            setFormBodyProgress(75)
        }, 500)
    }

    const setOptionsFinalState = (options, collectionName) => {
        const newCustomSort = [...options.sorting.customSort, ...options.sorting.holdPokemon]
        options.sorting.customSort = newCustomSort
        options.sorting.holdPokemon = []
        options.collectionName = collectionName === '' ? `twentyfourcharacteryesno's ${formData.collectionType.subType} ${capitalizeFirstLetter(formData.collectionType.type)} Collection` : collectionName
        setFormData({...formData, options})
    }

    const handleOptionsSelection = (e, options, collectionName) => { 
        setOptionsFinalState(options, collectionName)
        setCreationProgress(100)
        setTimeout(() => {
            setFormBodyProgress(100)
        }, 500)
    }

    const finalizeCreation = async() => {
        const backendOptionsFormat = {
            sorting: {collection: formData.options.sorting.collection, onhand: formData.options.sorting.onhand},
            tradePreferences: {...formData.options.tradePreferences, rates: {pokemonOffers: formData.options.rates.pokemonOffers.filter(off => off.add === undefined), itemOffers: formData.options.rates.itemOffers.filter(off => off.add === undefined)}}
        }
        //below variable only matters for imported collections, since if it is completely unchanged then we just take the imported collection as is and don't 
        //redo the collection creation function
        const completelyUnchangedScope = (Object.keys(formData.scope.excludedCombos).length === 0) && (formData.scope.unchangedScope === true) && (!formData.ballScope.importedBallScope.map(ball => formData.ballScope.formData.includes(ball)).includes(false) && formData.ballScope.importedBallScope.length === formData.ballScope.formData.length)
        const importedOwnedPokemonList = Object.keys(formData.importedCollection).length !== 0 ? formData.importedCollection.sort((a, b) => customSortCollectionListLogic(a, b, formData.options.sorting.customSort)) : undefined

        const newCollectionInfo = {
            ownedPokemonList: importedOwnedPokemonList,
            remakeList: (Object.keys(formData.importedCollection).length !== 0 && !completelyUnchangedScope),
            gen: formData.collectionType.subTypeValue,
            pokemonScope: formData.scope.formData,
            ballScope: formData.ballScope.formData,
            excludedCombos: formData.scope.excludedCombos,
            options: backendOptionsFormat,
            customSort: formData.options.sorting.customSort,
            collectionName: formData.options.collectionName,
            owner: "663313a050e7aacd52eb2d54"
        }

        const collectionId = await createNewCollection(newCollectionInfo, formData.collectionType.type)
        setTimeout(() => {
            setFormData({...formData, redirectLink: collectionId})
        }, 250)

    }

    const goBackStep = () => {
        const newStep = selectAdjArrItem(steps, creationProgress, false)

        setCreationProgress(newStep)
        setTimeout(() => {
            if (creationProgress === 50 && newStep === 25) {
                setFormData({...formData, importedCollection: undefined, ballScope: undefined, scope: undefined})
            }
            setFormBodyProgress(newStep)
        }, 500)
    }

    // console.log(formData)

    return (
        <BodyWithBanner bodySx={{overflowX: 'hidden', overflowY: 'hidden', height: '100%', mt: 2, mb: 0}} bannerSx={{backgroundColor: '#26BCC9', color: 'black'}} text='Create New Collection'>
            {/*extra box with margin top needed due to overflow*/}
            <Box sx={{height: '100%', mt: 3, mx: 1}}> 
                <CreationProgress progress={creationProgress} />
                {(formBodyProgress === 0 || slideClasses.step1 !== 'none') && 
                    <CollectionTypeSelection handleChange={handleCollectionTypeChange} cssClass={slideClasses.step1}/>
                }
                {(formBodyProgress === 25 || slideClasses.step2 !== 'none') && 
                    <ImportSelection 
                        handleChange={handleImportedCollectionChange}
                        goBackStep={{stepName: 'Type Selection', func: goBackStep}} 
                        cssClass={slideClasses.step2} 
                        collectionType={`${formData.collectionType.subType} ${capitalizeFirstLetter(formData.collectionType.type)} Collection`}
                        collectionSubTypeValue={formData.collectionType.subTypeValue}
                    />
                }
                {(formBodyProgress === 50 || slideClasses.step3 !== 'none') &&
                    <ScopeSelection 
                        collectionType={`${formData.collectionType.subType} ${capitalizeFirstLetter(formData.collectionType.type)} Collection`}
                        collectionGen={formData.collectionType.subTypeValue}
                        importedCollection={formData.importedCollection}
                        scope={formData.scope}
                        ballScopeInit={formData.ballScope}
                        cssClass={slideClasses.step3} 
                        goBackStep={{stepName: 'Import Selection', func: goBackStep}} 
                        handleChange={handleScopeSelection}
                    />
                }
                {(formBodyProgress === 75 || slideClasses.step4 !== 'none') &&
                    <OptionSelection 
                        collectionType={`${formData.collectionType.subType} ${capitalizeFirstLetter(formData.collectionType.type)} Collection`}
                        formOptionsData={formData.options}
                        collectionGen={formData.collectionType.subTypeValue}
                        cssClass={slideClasses.step4} 
                        ballOrderInit={formData.ballScope.formData}
                        customSort={formData.customSort}
                        goBackStep={{stepName: 'Scope Selection', func: goBackStep}} 
                        handleChange={handleOptionsSelection}
                    />
                }
                {(formBodyProgress === 100 || slideClasses.step5 !== 'none') &&
                    <ReviewFinalizeBase
                        collectionType={`${formData.collectionType.subType} ${capitalizeFirstLetter(formData.collectionType.type)} Collection`}
                        formData={formData}
                        cssClass={slideClasses.step5}
                        goBackStep={{stepName: 'Options Selection', func: goBackStep}}
                        redirectLink={formData.redirectLink}
                        handleChange={finalizeCreation}
                    />
                }
            </Box>
        </BodyWithBanner>
    )
}