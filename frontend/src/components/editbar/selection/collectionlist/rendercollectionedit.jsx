import {useState, useEffect, useTransition, useContext} from 'react'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import { AlertsContext } from '../../../../alerts/alerts-context'
import {useDispatch, connect, useSelector} from 'react-redux'
import store from './../../../../app/store'
import {setIsOwned, setIsHA, setEmCount, setEms, deleteEms, setDefault} from './../../../../app/slices/collectionstate'
import { setUnsavedChanges } from './../../../../app/slices/editmode'
import {setSelectedBall} from './../../../../app/slices/editmode'
import {Box, Typography, FormGroup, FormControl, FormControlLabel, FormLabel, ToggleButton} from '@mui/material'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import {usePutRequest, useTagRequest} from './../../../../../utils/functions/backendrequests/editcollection'
import {setMaxEmArr, selectNextEmCount} from './../../../../../utils/functions/misc'
import getDefaultData from '../../../../../utils/functions/defaultdata'
import EditWrapper from './../components/editwrapper'
import BallSelectionForm from '../../editsectioncomponents/shared/ballselectionform'
import IsOwnedSelectionForm from '../../editsectioncomponents/collectioneditonly/isownedselectionform'
import HASelectionForm from '../../editsectioncomponents/shared/haselectionform'
import EggMoveSelectionForm from '../../editsectioncomponents/shared/eggmoveselectionform'
import EditEggMovesForm from '../../editsectioncomponents/shared/editeggmovesform'


function RenderCollectionEdit({collectionId, ownerId, pokemon, ballInfo, selectedBall, allEggMoves, isHomeCollection}) {
    const [editEggMoves, setEditEggMoves] = useState({open: 'firstRenderFalse', idx: ''})
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const allowedBalls = Object.keys(ballInfo).filter(ball => ballInfo[ball].disabled === undefined)
    const unsavedChanges = useSelector((state) => state.editmode.unsavedChanges)
    // const initState = allowedBalls.length === 3 || allowedBalls.length === 4 ? allowedBalls[1] : allowedBalls[0] 

    //useEffect(() => {
    //  dispatch(setSelectedBall(initState))
    //}, [])

    const listType = 'collection'

    const possibleEggMoves = allEggMoves[pokemon.name]
    const maxEMs = possibleEggMoves === undefined ? 0 : possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length
    
    const toggleClass = editEggMoves.open === true ? 'egg-moves-slide-in' : 
        editEggMoves.open === false && 'egg-moves-slide-out'

    const emCountSelectionList = setMaxEmArr(maxEMs) 

    //default logic used for isOwned state and setDefault state
    const globalDefault = useSelector((state) => state.collectionState.options.globalDefaults)
    const checkDefault = Object.keys(ballInfo)[Object.values(ballInfo).map((b) => b.default !== undefined).indexOf(true)]
    const currentDefault = checkDefault === undefined ? 'none' : checkDefault
    
    //can update renderedBall to selectedBall in this file
    const renderedBall = selectedBall

    // const isOwnedState = useSelector((state) => state.collection[selectedIdx].balls[renderedBall].isOwned)
    // const isHAState = useSelector((state) => state.collection[selectedIdx].balls[renderedBall].isHA)
    // const emCountState = useSelector((state) => state.collection[selectedIdx].balls[renderedBall].emCount)
    // const EMs = useSelector((state) => state.collection[selectedIdx].balls[renderedBall].EMs)
    const selectedIdx = useSelector(state => state.collectionState.collection.indexOf(pokemon))
    const isOwnedState = pokemon.balls[renderedBall].isOwned
    const isHAState = pokemon.balls[renderedBall].isHA
    const emCountState = pokemon.balls[renderedBall].emCount
    const EMs = pokemon.balls[renderedBall].EMs
    
    const noEMs = pokemon.balls[renderedBall].EMs === undefined
    const noHA = pokemon.balls[renderedBall].isHA === undefined
   
    const handleBallChange = (event, newBall) => {
        dispatch(setSelectedBall(newBall))
    }

    const handleIsOwnedChange = (event) => {
        const newValue = event.target.checked
        const defaultData = getDefaultData(globalDefault, currentDefault, pokemon.balls, maxEMs, possibleEggMoves, renderedBall)
        dispatch(setIsOwned({idx: selectedIdx, ball: renderedBall, ballDefault: defaultData}))
        // if (unsavedChanges === false) {addAlert({severity: 'error', timeout: 4, message: 'You have unsaved changes. Make sure to save before leaving!'})}
        dispatch(setUnsavedChanges())
        // const backendFunc = async() => await usePutRequest('isOwned', newValue, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId, defaultData)
        // const successFunc = () => dispatch(setIsOwned({idx: selectedIdx, ball: renderedBall, ballDefault: defaultData}))
        // handleError(backendFunc, false, successFunc, () => {})
    }
    const handleIsHAChange = (event) => {
        const newValue = event.target.value === 'true' // event.target.value comes out as a string instead of boolean
        dispatch(setIsHA({idx: selectedIdx, ball: renderedBall, listType}))
        // if (unsavedChanges === false) {addAlert({severity: 'error', timeout: 4, message: 'You have unsaved changes. Make sure to save before leaving!'})}
        dispatch(setUnsavedChanges())
        // const successFunc = () => dispatch(setCollectionIsHA({idx: selectedIdx, ball: renderedBall, listType}))
        // const backendFunc = async() => await usePutRequest('isHA', newValue, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
        // handleError(backendFunc, false, successFunc, () => {})
    }
    const handleEmCountChange = (event) => {
        const newValue = selectNextEmCount(emCountSelectionList, parseInt(event.target.value))
        
        // if (newValue < EMs.length) {
        //     const noEmSuccessFunc = () => dispatch(deleteCollectionEms({idx: selectedIdx, ball: renderedBall, listType}))
        //     const noEmBackendReq = async() => await usePutRequest('EMs', [], {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
        //     handleError(noEmBackendReq, false, noEmSuccessFunc, () => {})
        // }
        
        setEditEggMoves({...editEggMoves, idx: ''})
        const hasAllPossibleEggMoves = (possibleEggMoves.length === maxEMs) && (newValue === maxEMs)
        if (newValue < EMs.length) {
            dispatch(deleteEms({idx: selectedIdx, ball: renderedBall, listType}))
        }
        if (hasAllPossibleEggMoves) {
            for (let eggmove of possibleEggMoves) {
                dispatch(setEms({idx: selectedIdx, ball: renderedBall, listType, emName: eggmove}))
            }
        }
        dispatch(setEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: newValue}))
        // if (unsavedChanges === false) {addAlert({severity: 'error', timeout: 4, message: 'You have unsaved changes. Make sure to save before leaving!'})}
        dispatch(setUnsavedChanges())
        // const successFunc = () => {
        //     if (newValue < EMs.length) {
        //         dispatch(deleteCollectionEms({idx: selectedIdx, ball: renderedBall, listType}))
        //     }
        //     if (hasAllPossibleEggMoves) {
        //         for (let eggmove of possibleEggMoves) {
        //             dispatch(setCollectionEms({idx: selectedIdx, ball: renderedBall, listType, emName: eggmove}))
        //         }
        //     }
        //     dispatch(setCollectionEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: newValue}))
        // }
        // if (hasAllPossibleEggMoves) {
        //     const allEmSuccessFunc = () => {
        //         for (let eggmove of possibleEggMoves) {
        //             dispatch(setCollectionEms({idx: selectedIdx, ball: renderedBall, listType, emName: eggmove}))
        //         }
        //     }
        //     const allEmBackendReq = async() => await usePutRequest('EMs', possibleEggMoves, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
        //     handleError(allEmBackendReq, false, allEmSuccessFunc, () => {})
        // }
        // const backendReq = async() => await usePutRequest('emCount', newValue, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId, newValue < EMs.length ? {EMs: []} : hasAllPossibleEggMoves ? {EMs: possibleEggMoves} : undefined)
        // handleError(backendReq, false, successFunc, () => {})
    }

    const handleEMChange = (event) => {
        if (event === 'onlyOnePossibleEM') {
            dispatch(setEms({idx: selectedIdx, ball: renderedBall, listType, emName: possibleEggMoves[0]}))
            dispatch(setEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: 1} ))
            dispatch(setUnsavedChanges())
            // const onlyOneEmSuccess = () => {
            //     dispatch(setCollectionEms({idx: selectedIdx, ball: renderedBall, listType, emName: possibleEggMoves[0]}))
            //     dispatch(setCollectionEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: 1} ))
            // }
            // const onlyOneEmReq = async() => await usePutRequest('EMs', possibleEggMoves, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
            // handleError(onlyOneEmReq, false, onlyOneEmSuccess, () => {})
        } else {
            const selectedEM = event.target.innerText
            
            // const newEMArr = store.getState().collection[selectedIdx].balls[renderedBall].EMs
            const newEMArr = EMs.includes(selectedEM) ? EMs.filter(em => em !== selectedEM) : [...EMs, selectedEM]
            // state change adds or removes egg moves based on innerText event

            const increaseEMCount = (newEMArr.length) > emCountState
            // if the new ems array is greater than the current emcount, increase the em count
            const decreaseEMCount = maxEMs === possibleEggMoves.length && EMs.length > newEMArr.length
            // if the max possible ems is 4 or less AND we are taking out an egg move, decrease the em count
            const changeEMCount = increaseEMCount || decreaseEMCount
            dispatch(setEms({idx: selectedIdx, ball: renderedBall, listType, emName: selectedEM}))
            if (changeEMCount) {
                dispatch(setEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: newEMArr.length}))
            }
            // next two if statements determine how the selected EM (selection box) moves depending on whether an egg move is being added (1st) or removed (2nd)
            if (!(EMs.includes(selectedEM))) {
                const newSelectedEMIdx = (editEggMoves.idx === 3 && newEMArr === 4) ? '' : editEggMoves.idx+1 // if all egg moves slots are selected, remove selection borders. if not, select next empty slot
                setEditEggMoves({...editEggMoves, idx: newSelectedEMIdx})
            } else if (EMs.includes(selectedEM)) {
                setEditEggMoves({...editEggMoves, idx: ''})
            }
            // if (unsavedChanges === false) {addAlert({severity: 'error', timeout: 4, message: 'You have unsaved changes. Make sure to save before leaving!'})}
            dispatch(setUnsavedChanges())
            // const successFunc = () => {
            //     dispatch(setCollectionEms({idx: selectedIdx, ball: renderedBall, listType, emName: selectedEM}))
            //     if (changeEMCount) {
            //         dispatch(setCollectionEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: newEMArr.length}))
            //     }
            //     // next two if statements determine how the selected EM (selection box) moves depending on whether an egg move is being added (1st) or removed (2nd)
            //     if (!(EMs.includes(selectedEM))) {
            //         const newSelectedEMIdx = (editEggMoves.idx === 3 && newEMArr === 4) ? '' : editEggMoves.idx+1 // if all egg moves slots are selected, remove selection borders. if not, select next empty slot
            //         setEditEggMoves({...editEggMoves, idx: newSelectedEMIdx})
            //     } else if (EMs.includes(selectedEM)) {
            //         setEditEggMoves({...editEggMoves, idx: ''})
            //     }
            // }
            // const backendReq = async() => await usePutRequest('EMs', newEMArr, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId, changeEMCount ? {emCount: newEMArr.length} : undefined)   
            // handleError(backendReq, false, successFunc, () => {})
            // if (changeEMCount) {
            //     const changeEmCountSuccess = () => dispatch(setCollectionEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: newEMArr.length}))
            //     const changeEmCountReq = async() => await usePutRequest('emCount', newEMArr.length, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
            //     handleError(changeEmCountReq, false, changeEmCountSuccess, () => {})
            // }
        }
    }

    const handleDefaultChange = () => {
        dispatch(setDefault({idx: selectedIdx, ball: renderedBall, prevDefault: currentDefault}))
        // if (unsavedChanges === false) {addAlert({severity: 'error', timeout: 4, message: 'You have unsaved changes. Make sure to save before leaving!'})}
        dispatch(setUnsavedChanges())
        // const successFunc = () => dispatch(setDefault({idx: selectedIdx, ball: renderedBall, prevDefault: currentDefault}))
        // const backendReq = async() => await useTagRequest(renderedBall, currentDefault, {pokename: pokemon.name, ballname: renderedBall, default: true}, collectionId)
        // handleError(backendReq, false, successFunc, () => {})
    }

    const toggleEditEggMoveScreen = (idx) => {
        if (idx !== 'close') {
            setEditEggMoves({open: true, idx: EMs.length})
        } else if (idx === 'close') {
            setEditEggMoves({open: false, idx: ''})
        }
    }

    return (
        <EditWrapper imgLink={pokemon.imgLink} name={pokemon.name} natDexNum={pokemon.natDexNum}>
            <BallSelectionForm 
                allowedBalls={allowedBalls} 
                handleChange={handleBallChange} 
                value={renderedBall}
            />
            {/* 20% width */}
            <IsOwnedSelectionForm 
                isOwned={isOwnedState} 
                handleChange={handleIsOwnedChange}
            />
            {/* 10% width */}
            <HASelectionForm 
                noHA={noHA} 
                isHA={isHAState} 
                handleChange={handleIsHAChange}
                disabled={isOwnedState === false}
                buttonSizes={'small'}
            />
            {/* 15% width */}
            <EggMoveSelectionForm
                noEMs={noEMs} 
                emCount={emCountState}
                EMs={EMs}
                maxEms={maxEMs}
                idxOfSelectedEM={editEggMoves.idx}
                handleEmCountChange={handleEmCountChange}
                handleEMChange={handleEMChange}
                toggleScreen={toggleEditEggMoveScreen}
                disabled={isOwnedState === false}
                isHomeCollection={isHomeCollection}
            />
            {/* 40% width */}
            {(editEggMoves.open !== 'firstRenderFalse') &&
            <EditEggMovesForm 
                emCount={emCountState}
                EMs={EMs}
                maxEms={maxEMs}
                idxOfSelectedEM={editEggMoves.idx}
                possibleEggMoves={possibleEggMoves}
                toggleClass={toggleClass} 
                toggleScreen={toggleEditEggMoveScreen}
                handleEMChange={handleEMChange}
            />}
            {(ballInfo[renderedBall].isOwned === true && !(ballInfo[renderedBall].isHA === undefined && ballInfo[renderedBall].EMs === undefined)) && 
            <ToggleButton 
                sx={{width: '10%', fontSize: ballInfo[renderedBall].default !== undefined ? '10px' : '11px', padding: 0, border: 'none', marginLeft: '3%', color: '#73661e'}}
                size='small'
                value='default'
                selected={ballInfo[renderedBall].default !== undefined}
                onClick={handleDefaultChange}
            >
                {ballInfo[renderedBall].default !== undefined ? 'Current Default' : 'Set as Default'}
            </ToggleButton>}
            {/* 13% width */}
        </EditWrapper>
    )
}

//having selectedBall as a global state allows to set the selected ball after changing isOwned from the table to true. refer to editmode reducers.
//if you find a way to get around that, we can completely remove this part of the store.
function mapStateToProps(state) {
    const selectedBall = state.editmode.selectedBall
    return ({selectedBall})
}

export default connect(mapStateToProps)(RenderCollectionEdit)