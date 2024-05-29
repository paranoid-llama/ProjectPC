import {useState, useEffect, useTransition} from 'react'
import {useDispatch, connect, useSelector} from 'react-redux'
import store from './../../../../app/store'
import {setIsOwned, setCollectionIsHA, setCollectionEmCount, setCollectionEms, deleteCollectionEms, setDefault} from './../../../../app/slices/collection'
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


function RenderCollectionEdit({collectionId, ownerId, pokemon, ballInfo, selectedBall, allEggMoves}) {
    const [editEggMoves, setEditEggMoves] = useState({open: 'firstRenderFalse', idx: ''})
    const dispatch = useDispatch()
    const allowedBalls = Object.keys(ballInfo).filter(ball => ballInfo[ball].disabled === undefined)
    // const initState = allowedBalls.length === 3 || allowedBalls.length === 4 ? allowedBalls[1] : allowedBalls[0] 

    //useEffect(() => {
    //  dispatch(setSelectedBall(initState))
    //}, [])

    const listType = 'collection'

    const possibleEggMoves = allEggMoves[pokemon.name]
    const maxEMs = possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length
    
    const toggleClass = editEggMoves.open === true ? 'egg-moves-slide-in' : 
        editEggMoves.open === false && 'egg-moves-slide-out'

    const emCountSelectionList = setMaxEmArr(maxEMs) 

    //default logic used for isOwned state and setDefault state
    const checkDefault = Object.keys(ballInfo)[Object.values(ballInfo).map((b) => b.default !== undefined).indexOf(true)]
    const currentDefault = checkDefault === undefined ? 'none' : checkDefault
    
    //can update renderedBall to selectedBall in this file
    const renderedBall = selectedBall

    // const isOwnedState = useSelector((state) => state.collection[selectedIdx].balls[renderedBall].isOwned)
    // const isHAState = useSelector((state) => state.collection[selectedIdx].balls[renderedBall].isHA)
    // const emCountState = useSelector((state) => state.collection[selectedIdx].balls[renderedBall].emCount)
    // const EMs = useSelector((state) => state.collection[selectedIdx].balls[renderedBall].EMs)
    const selectedIdx = useSelector(state => state.collection.indexOf(pokemon))
    const isOwnedState = pokemon.balls[renderedBall].isOwned
    const isHAState = pokemon.balls[renderedBall].isHA
    const emCountState = pokemon.balls[renderedBall].emCount
    const EMs = pokemon.balls[renderedBall].EMs
    

    const noEMs = ballInfo[allowedBalls[0]].EMs === undefined
    const noHA = ballInfo[allowedBalls[0]].isHA === undefined
   
    const handleBallChange = (event, newBall) => {
        dispatch(setSelectedBall(newBall))
    }

    const handleIsOwnedChange = (event) => {
        const newValue = event.target.checked
        const defaultData = getDefaultData('none', currentDefault, pokemon.balls, maxEMs, possibleEggMoves)
        dispatch(setIsOwned({idx: selectedIdx, ball: renderedBall, ballDefault: currentDefault}))
        usePutRequest('isOwned', newValue, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId, defaultData === 'none' ? undefined : defaultData)
    }
    const handleIsHAChange = (event) => {
        const newValue = event.target.value === 'true' // event.target.value comes out as a string instead of boolean
        dispatch(setCollectionIsHA({idx: selectedIdx, ball: renderedBall, listType}))
        usePutRequest('isHA', newValue, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
    }
    const handleEmCountChange = (event) => {
        const newValue = selectNextEmCount(emCountSelectionList, parseInt(event.target.value))
        if (newValue < EMs.length) {
            dispatch(deleteCollectionEms({idx: selectedIdx, ball: renderedBall, listType}))
            usePutRequest('EMs', [], {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
        }
        dispatch(setCollectionEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: newValue}))
        setEditEggMoves({...editEggMoves, idx: ''})
        const hasAllPossibleEggMoves = (possibleEggMoves.length === maxEMs) && (newValue === maxEMs)
        if (hasAllPossibleEggMoves) {
            for (let eggmove of possibleEggMoves) {
                dispatch(setCollectionEms({idx: selectedIdx, ball: renderedBall, listType, emName: eggmove}))
            }
            usePutRequest('EMs', possibleEggMoves, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
        }
        usePutRequest('emCount', newValue, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
    }

    const handleEMChange = (event) => {
        if (event === 'onlyOnePossibleEM') {
            dispatch(setCollectionEms({idx: selectedIdx, ball: renderedBall, listType, emName: possibleEggMoves[0]}))
            dispatch(setCollectionEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: 1} ))
            usePutRequest('EMs', possibleEggMoves, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
        } else {
            const selectedEM = event.target.innerText
            dispatch(setCollectionEms({idx: selectedIdx, ball: renderedBall, listType, emName: selectedEM}))
            const newEMArr = store.getState().collection[selectedIdx].balls[renderedBall].EMs
            // state change adds or removes egg moves based on innerText event

            const increaseEMCount = (newEMArr.length) > emCountState
            // if the new ems array is greater than the current emcount, increase the em count
            const decreaseEMCount = maxEMs === possibleEggMoves.length && EMs.length > newEMArr.length
            // if the max possible ems is 4 or less AND we are taking out an egg move, decrease the em count
            const changeEMCount = increaseEMCount || decreaseEMCount
    
            // next two if statements determine how the selected EM (selection box) moves depending on whether an egg move is being added (1st) or removed (2nd)
            if (!(EMs.includes(selectedEM))) {
                const newSelectedEMIdx = (editEggMoves.idx === 3 && newEMArr === 4) ? '' : editEggMoves.idx+1 // if all egg moves slots are selected, remove selection borders. if not, select next empty slot
                setEditEggMoves({...editEggMoves, idx: newSelectedEMIdx})
                usePutRequest('EMs', newEMArr, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)   
            } else if (EMs.includes(selectedEM)) {
                setEditEggMoves({...editEggMoves, idx: ''})
                usePutRequest('EMs', newEMArr, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
            }
            if (changeEMCount) {
                dispatch(setCollectionEmCount({idx: selectedIdx, ball: renderedBall, listType, numEMs: newEMArr.length}))
                usePutRequest('emCount', newEMArr.length, {pokename: pokemon.name, ballname: renderedBall}, 'collection', collectionId, ownerId)
            }
        }
    }

    const handleDefaultChange = () => {
        
        dispatch(setDefault({idx: selectedIdx, ball: renderedBall, prevDefault: currentDefault}))
        useTagRequest(renderedBall, currentDefault, {pokename: pokemon.name, ballname: renderedBall, default: true}, collectionId)
    }

    const toggleEditEggMoveScreen = (idx) => {
        if (idx !== 'close') {
            setEditEggMoves({open: true, idx: EMs.length})
        } else if (idx === 'close') {
            setEditEggMoves({open: false, idx: ''})
        }
    }

    return (
        <EditWrapper imgLink={pokemon.imgLink} name={pokemon.name}>
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