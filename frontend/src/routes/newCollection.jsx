import {useNavigate, useRouteLoaderData, useRevalidator} from "react-router-dom";
import { createNewCollection } from "../../utils/functions/backendrequests/newcollection";
import { useState, useTransition, useRef, useEffect, useContext } from "react";
import { Virtuoso } from "react-virtuoso";
import { ErrorContext } from "../app/contexts/errorcontext";
import {Box, Typography, Button, useTheme} from "@mui/material";
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
import createDemoCollectionBackendRequest from "../../utils/functions/backendrequests/createnewdemocollection";
import { ballIntros, apriballs, genGames } from "../../common/infoconstants/miscconstants.mjs";
import { customSortCollectionListLogic } from "../../common/sortingfunctions/customsorting.mjs";
import { creationInitializeScopeFormData } from "../../utils/functions/scope/statechanges";
import { getOneArrData } from "../../utils/functions/scope/getonearrdata";
import './newCollection.css'

export default function NewCollection({demo=false}) {
    const navigate = useNavigate()
    const theme = useTheme()
    const {handleError} = useContext(ErrorContext)
    const userData = useRouteLoaderData("root").user
    const revalidator = useRevalidator()
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

    const setScopeState = async(importedCollection, collectionGen, ballScope) => {
        const backendFunc = async() => {return await getPokemonGroups(collectionGen)}
        const successFunc = (pokemonGroups) => {
            const scopeFormData = creationInitializeScopeFormData(importedCollection, pokemonGroups, collectionGen)
            const oneArrTotal = getOneArrData(pokemonGroups)
            const importedCollectionInitialScope = Object.keys(importedCollection).length !== 0 ? {importedCollectionInitScope: getOneArrData(scopeFormData, false, true)} : {}
            const customSortState = Object.values(importedCollection).length !== 0 ? {customSort: importedCollection.map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}})} : {}
            setFormData({...formData, importedCollection, ...importedCollectionInitialScope, ballScope, scope: {gen: collectionGen, total: pokemonGroups, formData: scopeFormData, oneArrTotal}, ...customSortState})
        }
        const errorFunc = (errorData) => {
            setFormData({...formData, importedCollection, ballScope, scope: {error: true, ...errorData}})
        }
        handleError(backendFunc, false, successFunc, errorFunc)
        // const pokemonGroups = await getPokemonGroups(collectionGen)
        // const scopeFormData = creationInitializeScopeFormData(importedCollection, pokemonGroups, collectionGen)
        // const oneArrTotal = getOneArrData(pokemonGroups)
        // const importedCollectionInitialScope = Object.keys(importedCollection).length !== 0 ? {importedCollectionInitScope: getOneArrData(scopeFormData, false, true)} : {}
        // const customSortState = Object.values(importedCollection).length !== 0 ? {customSort: importedCollection.map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}})} : {}
        // setFormData({...formData, importedCollection, ...importedCollectionInitialScope, ballScope, scope: {gen: collectionGen, total: pokemonGroups, formData: scopeFormData, oneArrTotal}, ...customSortState})
    }

    const handleImportedCollectionChange = (e, data, ballScope=[]) => {
        setCreationProgress(50)
        const genNum = formData.collectionType.subTypeValue !== 'home' && (typeof formData.collectionType.subTypeValue === 'string' ? genGames.filter(data => data.games.includes(formData.collectionType.subTypeValue))[0].gen : formData.collectionType.subTypeValue)
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
        const userImportedCollection = Object.values(formData.importedCollection).length !== 0
        const oldListOfIds = getOneArrData(formData.scope.formData, false, true)
        const newListOfIds = getOneArrData(pokemonScope, false, true)
        
        const unchangedScope = !oldListOfIds.map(id => newListOfIds.includes(id)).includes(false) && oldListOfIds.length === newListOfIds.length
        const sameScopeAsImport = userImportedCollection && (!newListOfIds.map(id => formData.importedCollectionInitScope.includes(id)).includes(false) && newListOfIds.length === formData.importedCollectionInitScope.length)

        const customSortState = (!userImportedCollection || !unchangedScope) ? {customSort : getOneArrData(pokemonScope, false)} : {} 
        const sameScopeAsImportObj = userImportedCollection ? {sameScopeAsImport} : {}
            //if the user imported a collection AND the scope is unchanged, then the sort state doesnt update itself (it is set if they imported a collection in setScopeState)
        const newFormDataState = formData.options !== undefined ? {...formData, ballScope: {...formData.ballScope, formData: ballScope}, scope: {...formData.scope, formData: pokemonScope, excludedCombos, unchangedScope}, options: {...formData.options, sorting: {...formData.options.sorting, ...customSortState}}, ...sameScopeAsImportObj} : 
            {...formData, ballScope: {...formData.ballScope, formData: ballScope}, scope: {...formData.scope, formData: pokemonScope, excludedCombos, unchangedScope}, ...customSortState, ...sameScopeAsImportObj}
        setFormData(newFormDataState)
    }

    const handleScopeSelection = (e, pokemonScope, ballScope, excludedCombos) => {
        setOptionsInitialState(pokemonScope, ballScope, excludedCombos)
        setCreationProgress(75)
        setTimeout(() => {
            setFormBodyProgress(75)
        }, 500)
    }

    const setOptionsFinalState = (options, collectionName, totalBalls) => {
        const newCustomSort = [...options.sorting.customSort, ...options.sorting.holdPokemon]
        options.sorting.customSort = newCustomSort
        options.sorting.holdPokemon = []
        options.collectionName = collectionName === '' ? `${demo ? 'My' : `${userData.username}'s`} ${formData.collectionType.subType} ${capitalizeFirstLetter(formData.collectionType.type)} Collection` : collectionName
        if (totalBalls.length !== options.sorting.onhand.ballOrder.length) {
            options.sorting.onhand.ballOrder = [...options.sorting.onhand.ballOrder, ...totalBalls.filter(ball => !options.sorting.onhand.ballOrder.includes(ball))]
        }
        setFormData({...formData, options})
    }

    const handleOptionsSelection = (e, options, collectionName, totalBalls) => { 
        setOptionsFinalState(options, collectionName, totalBalls)
        setCreationProgress(100)
        setTimeout(() => {
            setFormBodyProgress(100)
        }, 500)
    }

    const finalizeCreation = async() => {
        const isHomeCollection = formData.collectionType.subTypeValue === 'home'
        const globalDefaultFormatted = isHomeCollection ? {...formData.options.globalDefaults, emCount: undefined} : formData.options.globalDefaults
        const tradePreferencesFormatted = isHomeCollection ? {...formData.options.tradePreferences, ftItems: undefined, lfItems: undefined} : formData.options.tradePreferences
        const backendOptionsFormat = {
            collectingBalls: formData.ballScope.formData,
            globalDefaults: globalDefaultFormatted,
            sorting: {collection: formData.options.sorting.collection, onhand: formData.options.sorting.onhand},
            tradePreferences: {...tradePreferencesFormatted, rates: {pokemonOffers: formData.options.rates.pokemonOffers.filter(off => off.add === undefined), itemOffers: isHomeCollection ? undefined : formData.options.rates.itemOffers.filter(off => off.add === undefined)}}
        }
        //below variable only matters for imported collections, since if it is completely unchanged then we just take the imported collection as is and don't 
        //redo the collection creation function
        const completelyUnchangedScope = (Object.keys(formData.scope.excludedCombos).length === 0) && (formData.sameScopeAsImport === true) && (!formData.ballScope.importedBallScope.map(ball => formData.ballScope.formData.includes(ball)).includes(false) && formData.ballScope.importedBallScope.length === formData.ballScope.formData.length)
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
            owner: demo ? 'demo-user' : userData._id
        }
        const finalizeCreationFunc = demo ? async() => {return await createDemoCollectionBackendRequest(newCollectionInfo, formData.collectionType.type)} : 
            async() => {return await createNewCollection(newCollectionInfo, formData.collectionType.type)}
        handleError(finalizeCreationFunc, false, finalizeCreationSuccess, () => {})
        // const collectionId = await createNewCollection(newCollectionInfo, formData.collectionType.type)
        
        // setTimeout(() => {
        //     setFormData({...formData, redirectLink: collectionId})
        //     revalidator.revalidate()
        // }, 250)

    }

    const finalizeCreationSuccess = (newId) => {
        //note: newId becomes a complete collection object if its a demo collection
        setTimeout(() => {
            setFormData({...formData, redirectLink: newId})
            revalidator.revalidate()
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

    const demoBannerProps = demo ? {
        doubleBanner: true,
        doubleBannerSx: {alignItems: 'center', fontSize: '14px', backgroundColor: theme.palette.color3.main, color: theme.palette.color1.main},
        doubleBannerText: <><span>You are not logged in and are now creating a demo collection.</span><span>You will only be able to permanently save your collection after you register!</span></>
    } : {}

    // console.log(formData)

    return (
        <BodyWithBanner bodySx={{overflowX: 'hidden', overflowY: 'hidden', height: '100%', mt: 2, mb: 0, display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'column'}} bannerSx={{backgroundColor: '#26BCC9', color: 'black'}} text='Create New Collection' {...demoBannerProps}>
            {/*extra box with margin top needed due to overflow*/}
            {/* {demo && 
            <Box sx={{width: '100%', mx: -10, alignItems: 'center', backgroundColor: theme.palette.color3.main}}>
                <Typography sx={{color: theme.palette.color1.main}}>You are not logged in and now creating a demo collection. You will only be able to permanently save your collection after you register!</Typography>
            </Box>
            } */}
            <Box sx={{height: '100%', mt: 3, mx: 1, width: '100%', maxWidth: '1200px'}}> 
                <CreationProgress progress={creationProgress} />
                {(formBodyProgress === 0 || slideClasses.step1 !== 'none') && 
                    <CollectionTypeSelection handleChange={handleCollectionTypeChange} cssClass={slideClasses.step1} userData={userData} demo={true}/>
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
                        userData={userData}
                        demo={demo}
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
                        demo={demo}
                        handleChange={finalizeCreation}
                    />
                }
            </Box>
        </BodyWithBanner>
    )
}