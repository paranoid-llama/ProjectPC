import {useState, useEffect, useContext, useTransition} from 'react'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import {Modal, Fade, Box, Typography, Backdrop, TextField, Button, Select, MenuItem, useTheme} from '@mui/material'
import {Virtuoso} from 'react-virtuoso'
import { useLoaderData, useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay'
import {useSelector, useDispatch} from 'react-redux'
import {AlertsContext} from '../../../../alerts/alerts-context'
import {getPokemonWithOwnedBalls, getOwnedBalls, randomGender, setNewOnHandPokemonState, selectivelyReturnIsHAAndEMs, selectNextEmCount, setMaxEmArr, handleEMsState, capitalizeFirstLetter} from './../../../../../utils/functions/misc'
import { selectCollectionPokemon } from '../../../../app/selectors/selectors'
import {setPokemon, setNewOnHand} from '../../../../app/slices/onhand'
import {addOnHandPokemonToList, changeOnHandPokemon} from '../../../../app/slices/listdisplay'
import { newOnHandPutReq } from '../../../../../utils/functions/backendrequests/addonhand'
import { bulkEditOnHandInfo } from '../../../../../utils/functions/backendrequests/editcollection'
import ConfirmDecisionModal from '../../../functionalcomponents/confirmdecisionmodal'
import hexToRgba from 'hex-to-rgba'
import newObjectId from '../../../../../utils/functions/newobjectid'
import store from './../../../../app/store'
import modalStyles from './../../../../../utils/styles/componentstyles/modalstyles'
import ImgData from './../../../collectiontable/tabledata/imgdata'
import Selection from './../../../collectiontable/selection'
import BallSelectionForm from './../shared/ballselectionform'
import HASelectionForm from '../shared/haselectionform'
import GenderSelectionForm from './genderselectionform'
import QtySelectionForm from './qtyselectionform'
import EggMoveSelectionForm from '../shared/eggmoveselectionform'
import EditEggMovesModal from './modalcomponents/editeggmovesmodal'
import Header from './modalcomponents/header'
import SpeciesSelect from './modalcomponents/speciesselect'
import { sortOnHandList } from '../../../../../common/sortingfunctions/onhandsorting.mjs'
import DotWaitingText from '../../../functionalcomponents/dotwaitingtext'

const scrollerStyles = {
    '&::-webkit-scrollbar': {
        width: '6px'
    },
    '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'black',
        borderRadius: '5px'
    },
}

export default function OnHandPokemonSelectionForm({collectionID, speciesEditOnly=false, open, handleClose, initialPokemonData, idxOfInitialPokemon, isHomeCollection}) {
    //usage in regular functions
    const dispatch = useDispatch()
    const theme = useTheme()
    const userNameDisplaySettings = useRouteLoaderData('root').user.settings.display.pokemonNames
    const {handleError} = useContext(ErrorContext)

    const allEggMoveInfo = useSelector((state) => state.listDisplay.eggMoveInfo)
    const sortingOptions = useSelector((state) => state.options.sorting.onhand)
    const onhandState = useSelector((state) => state.onhand)
    const initialSelection = initialPokemonData.imgLink === undefined ? {} : selectCollectionPokemon(store.getState(), initialPokemonData.imgLink)
    const [pokemonData, setPokemonData] = useState({selection: {...initialSelection}, searchData: '', ball: initialPokemonData.ball, newOnHandData: {}, otherNewOnHands: [], selectedNewOnHand: 0, saving: false})
    const [confirmDecisionModal, setConfirmDecisionModal] = useState(false)
    const [selectedEMIdx, setSelectedEMIdx] = useState('')
    const [editEggMoveScreen, setEditEggMoveScreen] = useState(false)

    const savePending = pokemonData.saving
    const addingMultipleOnhands = pokemonData.otherNewOnHands.length !== 0
    const specificPokemonDataPath = addingMultipleOnhands ? pokemonData.otherNewOnHands[pokemonData.selectedNewOnHand] : pokemonData
    // console.log(pokemonData)

    const collectionData = useSelector(state => state.collection)

    const eggMoveData = {
        noEMs: specificPokemonDataPath.newOnHandData.gender !== undefined ? specificPokemonDataPath.newOnHandData.EMs === undefined : false,
        EMs: specificPokemonDataPath.newOnHandData.gender !== undefined ? specificPokemonDataPath.newOnHandData.EMs : [],
        emCount: specificPokemonDataPath.newOnHandData.gender !== undefined ? specificPokemonDataPath.newOnHandData.emCount : 0,
        maxEMs: specificPokemonDataPath.newOnHandData.gender !== undefined ? (allEggMoveInfo[specificPokemonDataPath.selection.name] === undefined ? 0 : allEggMoveInfo[specificPokemonDataPath.selection.name].length > 4 ? 4 : allEggMoveInfo[specificPokemonDataPath.selection.name].length) : 4,
        possibleEggMoves: specificPokemonDataPath.newOnHandData.gender !== undefined ? allEggMoveInfo[specificPokemonDataPath.selection.name] : []
    }

    const emCountSelectionList = setMaxEmArr(eggMoveData.maxEMs) 

    const fullSelectionList = getPokemonWithOwnedBalls(collectionData)
    
    const selectionList = pokemonData.searchData !== '' ? fullSelectionList.filter(p => getNameDisplay(userNameDisplaySettings, p.name, p.natDexNum).toLowerCase().includes(pokemonData.searchData)) : fullSelectionList
    const allowedBallsStep1 = specificPokemonDataPath.selection.balls !== undefined ? getOwnedBalls(specificPokemonDataPath.selection.balls) : []
    //this step prevents errors if a user makes an onhand of a particular ball combo but later changes the ball scope and removes the ball data
    const allowedBalls = (!allowedBallsStep1.includes(specificPokemonDataPath.ball) && speciesEditOnly) ? [...allowedBallsStep1, specificPokemonDataPath.ball] : allowedBallsStep1

    const scalingStyles = speciesEditOnly ? {height: '60%'} : {height: '80%'}

    //alerts
    const [alertIds, setAlertIds] = useState([])
    const {addAlert, dismissAlert} = useContext(AlertsContext)

    const clearAlerts = () => {
        alertIds.forEach((id) => {
            dismissAlert(id);
        });
        setAlertIds([]);
    }

    useEffect(() => {
        return () => {
            clearAlerts();
        };
    }, []);

    const updateSelectionState = (load, changingSelection=false, name, newBall=undefined) => {
        //load in this case refers to newOnHandData
        if (addingMultipleOnhands) {
            if (changingSelection) {
                const {newSelection, ball, newOnHandData} = initNewSelection(name)
                return {...pokemonData, otherNewOnHands: pokemonData.otherNewOnHands.map((p, idx) => {
                    const isSelected = idx === pokemonData.selectedNewOnHand
                    if (!isSelected) {return p}
                    return {selection: newSelection, ball, newOnHandData}
                })}
            }
            return {...pokemonData, otherNewOnHands: pokemonData.otherNewOnHands.map((p, idx) => {
                const isSelected = idx === pokemonData.selectedNewOnHand
                if (!isSelected) {return p}
                const newDataUpdate = newBall ? {ball: newBall, newOnHandData: load} : {newOnHandData: load}
                return {...p, ...newDataUpdate}
            })}
        } else {
            if (changingSelection) {
                const {newSelection, ball, newOnHandData} = initNewSelection(name)
                return {...pokemonData, selection: newSelection, ball, newOnHandData}
            }
            const newDataUpdate = newBall ? {ball: newBall, newOnHandData: load} : {newOnHandData: load}
            return {...pokemonData, ...newDataUpdate}
        }
    }

    const handleBallChange = (e, newBall) => {
        if (!speciesEditOnly) {
            const isHAInfo = selectivelyReturnIsHAAndEMs('isHA', specificPokemonDataPath.selection.balls[newBall].isHA)
            const emCountInfo = selectivelyReturnIsHAAndEMs('emCount', specificPokemonDataPath.selection.balls[newBall].emCount)
            const EMsInfo = selectivelyReturnIsHAAndEMs('EMs', specificPokemonDataPath.selection.balls[newBall].EMs)
            setPokemonData(updateSelectionState({...specificPokemonDataPath.newOnHandData, ...isHAInfo, ...emCountInfo, ...EMsInfo}, false, '', newBall))
        } else {
            setPokemonData({...pokemonData, ball: newBall})
        }
    }

    const handleCloseModal = () => {
        handleClose()
        setTimeout(() => setPokemonData({selection: {...initialSelection}, searchData: '', ball: initialPokemonData.ball, newOnHandData: {}, otherNewOnHands: [], selectedNewOnHand: 0, saving: false}), 500)
    }

    const handleSaveAndCloseSpeciesEditOnly = () => {
        const collectionDataOfNewPokemon = collectionData.filter(p => p.name === pokemonData.selection.name)[0]
        const gender = collectionDataOfNewPokemon.possibleGender === 'both' ? randomGender() : collectionDataOfNewPokemon.possibleGender
        const isHA = collectionDataOfNewPokemon.balls[pokemonData.ball].isHA === undefined ? {} : {isHA: collectionDataOfNewPokemon.balls[pokemonData.ball].isHA}
        const emData = collectionDataOfNewPokemon.balls[pokemonData.ball].emCount === undefined ? {} : {emCount: collectionDataOfNewPokemon.balls[pokemonData.ball].emCount, EMs: collectionDataOfNewPokemon.balls[pokemonData.ball].EMs}
        const sharedData = {
            name: pokemonData.selection.name, 
            natDexNum: pokemonData.selection.natDexNum,
            ball: pokemonData.ball,
            gender, 
            ...isHA,
            ...emData,
            qty: 1
        }
        const saveToDataBase = {...sharedData, _id: initialPokemonData._id}
        setPokemonData({...pokemonData, saving: true})
        const successFunc = () => {
            dispatch(setPokemon({
                idx: idxOfInitialPokemon,
                imgLink: pokemonData.selection.imgLink,
                pokemonData: sharedData,
                sortingOptions
            }))
            dispatch(changeOnHandPokemon({onhandId: initialPokemonData._id, newPokeData: sharedData, sortingOptions}))
            setPokemonData({...pokemonData, saving: false})
            //spawning alert
            const alertMessage = `Changed the On-Hand to ${capitalizeFirstLetter(pokemonData.ball)} ${pokemonData.selection.name}!`
            const alertInfo = {severity: 'success', message: alertMessage, timeout: 3, messageImgs: [{type: 'ball', linkKey: pokemonData.ball}, {type: 'poke', linkKey: pokemonData.selection.imgLink}]}
            const id = addAlert(alertInfo);
            setAlertIds((prev) => [...prev, id]);
            handleCloseModal()
        }
        const backendFunc = async() => await bulkEditOnHandInfo(saveToDataBase, initialPokemonData._id, collectionID)
        const errorFunc = () => {
            setPokemonData({...pokemonData, saving: false})
            handleClose()
        }
        handleError(backendFunc, false, successFunc, errorFunc)
    }

    const initNewSelection = (name, getFirstMon=false) => {
        const newSelection = getFirstMon ? fullSelectionList[0] : fullSelectionList.filter(pokemon => pokemon.name === name)[0]
        const ball = getOwnedBalls(newSelection.balls)[0]
        const ballInfo = newSelection.balls[ball]
        if (!speciesEditOnly) {
            const newOnHandData = setNewOnHandPokemonState(ballInfo, newSelection)
            return {newSelection, ball, newOnHandData}
        } else {
            return {newSelection, ball}
        }
    }

    const selectPokemon = (name) => {
        if (!speciesEditOnly) {
            setPokemonData(updateSelectionState({}, true, name))
        } else {
            const {newSelection, ball} = initNewSelection(name)
            setPokemonData({...pokemonData, selection: newSelection, ball})
        }
        // const newSelection = fullSelectionList.filter(pokemon => pokemon.name === name)[0]
        // const ball = getOwnedBalls(newSelection.balls)[0]
        
        // const ballInfo = newSelection.balls[ball]
        // if (!speciesEditOnly) {
        //     const newOnHandData = setNewOnHandPokemonState(ballInfo, newSelection)
        //     setPokemonData((currentState) => ({...currentState, newOnHandData}))
        // }
    }
    
    const listItemContent = (index) => {
        const pokemon = selectionList[index]
        const isSelected = pokemon.name === specificPokemonDataPath.selection.name
        return (
            <>
            {isSelected && <Selection height='36px' modal={true}/>}
            <Box 
                sx={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    backgroundColor: '#283f57',
                    borderRadius: '10px', 
                    marginBottom: '3px', 
                    marginTop: '3px',
                    '&:hover': {
                        cursor: 'pointer',
                        boxShadow: {boxShadow: '0px 0px 2px 3px #363535'}
                    }
                }}
                onClick={() => selectPokemon(pokemon.name)}
            >
                <Box sx={{height: '100%', width: '20%', paddingLeft: '5px'}}>
                    <ImgData linkKey={pokemon.imgLink}/>
                </Box>
                <Box sx={{height: '100%', width: '80%'}}>
                    <Typography>{getNameDisplay(userNameDisplaySettings, pokemon.name, pokemon.natDexNum)}</Typography>
                </Box>
            </Box> 
            </>
        )
    }

    const handleIncrementQty = () => {
        if (specificPokemonDataPath.newOnHandData.qty < 99) {
            const newOnHandData = {...specificPokemonDataPath.newOnHandData, qty: specificPokemonDataPath.newOnHandData.qty + 1}
            setPokemonData(updateSelectionState(newOnHandData))
        }
    }
    const handleDecrementQty = () => {
        if (specificPokemonDataPath.newOnHandData.qty > 1) {
            const newOnHandData = {...specificPokemonDataPath.newOnHandData, qty: specificPokemonDataPath.newOnHandData.qty - 1}
            setPokemonData(updateSelectionState(newOnHandData))
        }
    }

    const handleIsHAChange = (event) => {
        const newValue = event.target.value === 'true'
        const newOnHandData = {...specificPokemonDataPath.newOnHandData, isHA: newValue}
        setPokemonData(updateSelectionState(newOnHandData))
    }

    const handleGenderChange = () => {
        if (specificPokemonDataPath.newOnHandData.gender === 'male') {
            const newOnHandData = {...specificPokemonDataPath.newOnHandData, gender: 'female'}
            setPokemonData(updateSelectionState(newOnHandData))
        } else {
            const newOnHandData = {...specificPokemonDataPath.newOnHandData, gender: 'male'}
            setPokemonData(updateSelectionState(newOnHandData))
        }
    }

    const handleEmCountChange = (event) => {
        const newValue = selectNextEmCount(emCountSelectionList, parseInt(event.target.value))
        const hasAllPossibleEggMoves = (eggMoveData.possibleEggMoves.length === eggMoveData.maxEMs) && (newValue === eggMoveData.maxEMs)
        const newEMsValue = hasAllPossibleEggMoves ? {EMs: eggMoveData.possibleEggMoves} : newValue < specificPokemonDataPath.newOnHandData.EMs.length ? {EMs: []} : {}
        const newOnHandData = {...specificPokemonDataPath.newOnHandData, emCount: newValue, ...newEMsValue}
        setPokemonData(updateSelectionState(newOnHandData))
        // if (newValue < pokemonData.newOnHandData.EMs.length) {
        //     setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, EMs: []}})
        // }
        // setPokemonData((currentState) => ({...currentState, newOnHandData: {...currentState.newOnHandData, emCount: newValue}}))
        // if (hasAllPossibleEggMoves) {
        //     setPokemonData((currentState) => ({...currentState, newOnHandData: {...currentState.newOnHandData, EMs: eggMoveData.possibleEggMoves}}))
        // }
    }

    const handleEMChange = (event) => {
        const selectedEM = event.target.innerText
        // console.log(selectedEM)
        const newEMArr = handleEMsState(event.target.innerText, eggMoveData.EMs)
        // setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, EMs: newEMArr}})
        // state change adds or removes egg moves based on innerText event

        const increaseEMCount = (newEMArr.length) > eggMoveData.emCount
        // if the new ems array is greater than the current emcount, increase the em count
        const decreaseEMCount = eggMoveData.maxEMs === eggMoveData.possibleEggMoves.length && eggMoveData.EMs.length > newEMArr.length
        // if the max possible ems is 4 or less AND we are taking out an egg move, decrease the em count
        const changeEMCount = increaseEMCount || decreaseEMCount
        const newEmCount = changeEMCount ? {emCount: newEMArr.length} : {}
        const newOnHandData = {...specificPokemonDataPath.newOnHandData, EMs: newEMArr, ...newEmCount}
        setPokemonData(updateSelectionState(newOnHandData))

        // next two if statements determine how the selected EM (selection box) moves depending on whether an egg move is being added (1st) or removed (2nd)
        if (!(specificPokemonDataPath.newOnHandData.EMs.includes(selectedEM))) {
            const newSelectedEMIdx = (selectedEMIdx === 3 && newEMArr === 4) ? '' : selectedEMIdx+1 // if all egg moves slots are selected, remove selection borders. if not, select next empty slot
            setSelectedEMIdx(newSelectedEMIdx)  
        } else if (specificPokemonDataPath.newOnHandData.EMs.includes(selectedEM)) {
            setSelectedEMIdx('')
        }
        // if (changeEMCount) {
        //     setPokemonData((currentState) => ({...currentState, newOnHandData: {...currentState.newOnHandData, emCount: newEMArr.length}}))
        // }
    }

    // const toggleEditEggMoveScreen = (action) => {
    //     if (action === 'open') {
    //         setEditEggMoveScreen(true)
    //     } else {
    //         setEditEggMoveScreen(false)
    //     }
    // }

    const handleOpenEggMoveSelection = () => {
        setSelectedEMIdx(eggMoveData.EMs.length)
        setEditEggMoveScreen(true)
    }
    const handleCloseEggMoveSelection = () => {
        setSelectedEMIdx('')
        setEditEggMoveScreen(false)
    }

    const searchOnChange = (e) => {
        setPokemonData({...pokemonData, searchData: e.target.value})
    }

    const getStateBackendOnhandData = (data) => {
        const saveToDataBase = {
            name: data.selection.name,
            natDexNum: data.selection.natDexNum,
            ball: data.ball,
            ...data.newOnHandData,
            _id: newObjectId()
        }
        const stateInfo = {
            ...saveToDataBase,
            imgLink: data.selection.imgLink
        }
        return {saveToDataBase, stateInfo}
    }

    const handleAddNewOnHand = () => {
        setPokemonData({...pokemonData, saving: true})
        const errorFunc = () => {
            handleClose()
            setPokemonData({...pokemonData, saving: false})
        }
        if (addingMultipleOnhands) {
            const newOnHandsFormattedForBackend = pokemonData.otherNewOnHands.map(pData => {return getStateBackendOnhandData(pData).saveToDataBase}) 
            const newOnHandsFormattedForState = pokemonData.otherNewOnHands.map(pData => {return getStateBackendOnhandData(pData).stateInfo}) 
            const backendFunc = async() => await newOnHandPutReq(newOnHandsFormattedForBackend, collectionID)
            const successFunc = () => {
                dispatch(setNewOnHand(newOnHandsFormattedForState)) //updates row content state
                dispatch(addOnHandPokemonToList({newOnhand: newOnHandsFormattedForState, sortingOptions})) //updates show list state, which allows the new on hand to appear
                setPokemonData({...pokemonData, saving: false})
                //spawning alert
                const alertMessage = `Added Multiple On-hand Pokemon!`
                const alertInfo = {severity: 'success', message: alertMessage, timeout: 5}
                addAlert(alertInfo);
                handleCloseModal()
            }
            setPokemonData({...pokemonData, saving: false})
            handleError(backendFunc, false, successFunc, errorFunc)
        } else {
            const {saveToDataBase, stateInfo} = getStateBackendOnhandData(pokemonData)
            const successFunc = () => {
                dispatch(setNewOnHand(stateInfo)) //updates row content state
                dispatch(addOnHandPokemonToList({newOnhand: stateInfo, sortingOptions})) //updates show list state, which allows the new on hand to appear
                setPokemonData({...pokemonData, saving: false})
                //spawning alert
                const alertMessage = `Added ${capitalizeFirstLetter(pokemonData.ball)} ${pokemonData.selection.name}`
                const alertInfo = {severity: 'success', message: alertMessage, timeout: 5, messageImgs: [{type: 'ball', linkKey: pokemonData.ball}, {type: 'poke', linkKey: stateInfo.imgLink}]}
                addAlert(alertInfo);
                handleCloseModal()
            }
            const backendFunc = async() => await newOnHandPutReq(saveToDataBase, collectionID)
            handleError(backendFunc, false, successFunc, errorFunc)
        }  
    }

    const changeSelectedOnHand = (idx) => {
        setPokemonData({...pokemonData, selectedNewOnHand: idx})
    } 

    const handleAddAnotherOnhand = () => {
        const initNewOnHandData = initNewSelection('', true)
        const initOnHand = {selection: initNewOnHandData.newSelection, ball: initNewOnHandData.ball, newOnHandData: initNewOnHandData.newOnHandData}
        if (pokemonData.otherNewOnHands.length === 0) {
            const saveInArr = {selection: pokemonData.selection, newOnHandData: pokemonData.newOnHandData, ball: pokemonData.ball}
            setPokemonData({...pokemonData, otherNewOnHands: [saveInArr, initOnHand], selectedNewOnHand: 1})
        } else {
            setPokemonData({...pokemonData, otherNewOnHands: [...pokemonData.otherNewOnHands, initOnHand], selectedNewOnHand: pokemonData.otherNewOnHands.length})
        }
    }

    const handleRemoveSelectedOnhand = () => {
        if (pokemonData.otherNewOnHands.length === 2) {
            const lastOnhand = pokemonData.otherNewOnHands.filter((p, idx) => idx !== pokemonData.selectedNewOnHand)[0]
            setPokemonData({...pokemonData, selection: lastOnhand.selection, ball: lastOnhand.ball, newOnHandData: lastOnhand.newOnHandData, otherNewOnHands: [], selectedNewOnHand: 0})
        } else {
            const newOtherOnHandsArr = pokemonData.otherNewOnHands.filter((p, idx) => idx !== pokemonData.selectedNewOnHand)
            const newSelectedIdx = pokemonData.selectedNewOnHand === pokemonData.otherNewOnHands.length-1 ? {selectedNewOnHand: newOtherOnHandsArr.length-1} : {}
            setPokemonData({...pokemonData, otherNewOnHands: newOtherOnHandsArr, ...newSelectedIdx})
        }
    }

    return (
        <Modal
            aria-labelledby={speciesEditOnly ? 'change-onhand-pokemon-species' : 'add-new-onhand-pokemon'}
            aria-describedby={speciesEditOnly ? 'change-the-species-of-an-onhand-pokemon' : 'add-owned-pokemon-ball-combo-from-list-to-onhand'}
            open={open}
            onClose={speciesEditOnly ? handleClose : null}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, width: '60%', height: scalingStyles.height}}>
                    {!(speciesEditOnly) ? 
                    <>
                        <Header label={'Add New Pokémon'} height='7%'/>
                        {pokemonData.otherNewOnHands.length !== 0 &&
                        <Box sx={{height: '8%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '3px', ...modalStyles.onhand.modalElementBg}}>
                            <Typography sx={{fontSize: '12px', mr: 1}}>Selected:</Typography>
                            <Select value={pokemonData.selectedNewOnHand} onChange={(e, newVal) => changeSelectedOnHand(newVal.props.value)} sx={{width: '60%', height: '50%', '&.MuiInputBase-root': {border: '1px solid white', color: 'white'}}} MenuProps={{MenuListProps: {sx: {maxHeight: '200px', overflowY: 'scroll', py: 0, ...scrollerStyles}}}}>
                                {pokemonData.otherNewOnHands.map((pokeData, idx) => {
                                    const display = `${capitalizeFirstLetter(pokeData.ball)} ${getNameDisplay(userNameDisplaySettings, pokeData.selection.name, pokeData.selection.natDexNum)}`
                                    const styles = {backgroundColor: hexToRgba(theme.palette.color1.darker, 0.99), color: theme.palette.color3.main, '&.Mui-selected': {backgroundColor: theme.palette.color3.main, color: theme.palette.color1.main, ':hover': {backgroundColor: hexToRgba(theme.palette.color3.main, 0.5)}}, ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.5)}} 
                                    return (
                                        <MenuItem
                                            key={`${display}-new-onhand-${idx+1}`}
                                            value={idx}
                                            sx={{...styles, fontSize: '12px', ...theme.components.box.fullCenterRow, justifyContent: 'start'}}
                                        >
                                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', gap: 2}}>
                                                {display}
                                                <Box sx={{...theme.components.box.fullCenterRow}}>
                                                    <ImgData type='ball' linkKey={pokeData.ball} size='24px'/>
                                                    <ImgData type='poke' linkKey={pokeData.selection.imgLink} size='24px'/>
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                            <Button size='small' sx={{backgroundColor: 'rgb(220, 53, 69)', color: 'white', ml: 4}} onClick={handleRemoveSelectedOnhand}>Remove</Button>
                        </Box>
                        }
                        <SpeciesSelect searchOnChange={searchOnChange} searchData={pokemonData.searchData} selection={specificPokemonDataPath.selection} listItemContent={listItemContent} totalCount={selectionList.length} height={pokemonData.otherNewOnHands.length === 0 ? '60%' : '50%'} nameDisplaySettings={userNameDisplaySettings} customScroller={false}/>
                        <Box sx={{height: '25%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '3px', ...modalStyles.onhand.modalElementBg}}>
                            <Box sx={{height: '96%', width: '50%', display: 'flex', flexDirection: 'column'}}>
                                <Box sx={{height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <BallSelectionForm allowedBalls={allowedBalls} handleChange={handleBallChange} value={specificPokemonDataPath.ball} onhandBallSelect={true} height='90%' width='60%'/>
                                </Box>
                                <Box sx={{height: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <QtySelectionForm qty={specificPokemonDataPath.newOnHandData.qty === undefined ? 0 : specificPokemonDataPath.newOnHandData.qty} handleIncrement={handleIncrementQty} handleDecrement={handleDecrementQty} newOnHand={true} width='50%'/>
                                </Box>
                            </Box>
                            <Box sx={{height: '96%', width: '50%', display: 'flex', flexDirection: 'column'}}>
                                <Box sx={{height: '40%', display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{height: '100%', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <HASelectionForm 
                                            noHA={(specificPokemonDataPath.newOnHandData.qty !== undefined && specificPokemonDataPath.newOnHandData.isHA === undefined)}
                                            isHA={specificPokemonDataPath.newOnHandData.isHA}
                                            handleChange={handleIsHAChange}
                                            disabled={specificPokemonDataPath.newOnHandData.qty === undefined}
                                            width='80%'
                                            otherStyles={{color: 'white'}}
                                            selectColor='#283f57'
                                        />
                                    </Box>
                                    <Box sx={{height: '100%', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <GenderSelectionForm 
                                            width='80%' 
                                            gender={specificPokemonDataPath.newOnHandData.gender} 
                                            possibleGenders={specificPokemonDataPath.selection.possibleGender} 
                                            handleChange={handleGenderChange} 
                                            newOnHand={true}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{height: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <EggMoveSelectionForm 
                                        noEMs={eggMoveData.noEMs}
                                        EMs={eggMoveData.EMs}
                                        emCount={eggMoveData.emCount}
                                        maxEms={eggMoveData.maxEMs}
                                        width={isHomeCollection ? '40%' : '100%'}
                                        height='80%'
                                        newOnHandSelection={true}
                                        color='white'
                                        disabled={specificPokemonDataPath.newOnHandData.qty === undefined}
                                        newOnHandSelect={true}
                                        handleEmCountChange={handleEmCountChange}
                                        handleEMChange={handleEMChange}
                                        toggleScreen={handleOpenEggMoveSelection}
                                        idxOfSelectedEM={selectedEMIdx}
                                        noInfoBgColor='#283f57'
                                        isHomeCollection={isHomeCollection}
                                    />
                                    <EditEggMovesModal 
                                        open={editEggMoveScreen} 
                                        handleClose={handleCloseEggMoveSelection}
                                        eggMoveInfo={{
                                            emCount: eggMoveData.emCount,
                                            EMs: eggMoveData.EMs,
                                            maxEMs: eggMoveData.maxEMs,
                                            idxOfSelectedEM: selectedEMIdx,
                                            possibleEggMoves: eggMoveData.possibleEggMoves,
                                            handleEMChange
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{height: '8%', display: 'flex', justifyContent: 'center'}}>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
<<<<<<< HEAD
                                <Button  sx={{'& .Mui-disabled': {color: 'white'}}} size='small' variant='contained' onClick={addingMultipleOnhands ? () => setConfirmDecisionModal(true) : handleCloseModal} disabled={savePending}>Back</Button>
                            </Box>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button  sx={{'& .Mui-disabled': {color: 'white'}}} size='large' variant='contained' onClick={handleAddNewOnHand} disabled={savePending}>{savePending ? <>Saving<DotWaitingText/></> : 'Save'}</Button>
=======
                                <Button size='small' variant='contained' onClick={addingMultipleOnhands ? () => setConfirmDecisionModal(true) : handleCloseModal} disabled={savePending}>Back</Button>
                            </Box>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button size='large' variant='contained' onClick={handleAddNewOnHand} disabled={savePending}>{savePending ? <>Saving<DotWaitingText/></> : 'Save'}</Button>
>>>>>>> da117561453ada333ccb4dac2d33ced7e28f4916
                            </Box>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button  size='small' variant='contained' onClick={handleAddAnotherOnhand} sx={{fontSize: '12px', padding: 0.5, '& .Mui-disabled': {color: 'white'}}} disabled={(pokemonData.otherNewOnHands.length === 0 && Object.keys(pokemonData.selection).length === 0) || (savePending)}>Add another on-hand</Button>
                            </Box>
                        </Box>
                        <ConfirmDecisionModal 
                            text="You've added multiple on-hands!"
                            subText='Are you sure you want to exit without adding them?'
                            startingSecond={1}
                            confirmDecisionFunc={handleCloseModal}
                            toggleModal={() => setConfirmDecisionModal(!confirmDecisionModal)}
                            open={confirmDecisionModal}
                            pendingTimeout={0}
                        />
                    </> :
                    <>
                        <Header label={'Change Pokémon'} height='10%'/>
                        <SpeciesSelect searchOnChange={searchOnChange} searchData={pokemonData.searchData} selection={pokemonData.selection} listItemContent={listItemContent} totalCount={selectionList.length} height='60%' nameDisplaySettings={userNameDisplaySettings} customScroller={false}/>
                        <Box sx={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3px', ...modalStyles.onhand.modalElementBg}}>
                            <BallSelectionForm allowedBalls={allowedBalls} handleChange={handleBallChange} value={pokemonData.ball} onhandBallSelect={true} width='50%'/>
                        </Box>
                        <Box sx={{height: '10%', display: 'flex', justifyContent: 'center'}}>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
<<<<<<< HEAD
                                <Button sx={{'& .Mui-disabled': {color: 'white'}}} size='small' variant='contained' onClick={handleCloseModal} disabled={savePending}>Back</Button>
                            </Box>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button sx={{'& .Mui-disabled': {color: 'white'}}} size='large' variant='contained' onClick={handleSaveAndCloseSpeciesEditOnly} disabled={savePending}>{savePending ? <>Saving<DotWaitingText/></>  : 'Save'}</Button>
=======
                                <Button size='small' variant='contained' onClick={handleCloseModal} disabled={savePending}>Back</Button>
                            </Box>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button size='large' variant='contained' onClick={handleSaveAndCloseSpeciesEditOnly} disabled={savePending}>{savePending ? <>Saving<DotWaitingText/></>  : 'Save'}</Button>
>>>>>>> da117561453ada333ccb4dac2d33ced7e28f4916
                            </Box>
                            <Box sx={{width: '33%'}}></Box>
                        </Box>
                    </>
                    }
                </Box>
            </Fade>
        </Modal>
    )
}