import {useState, useContext, useEffect} from 'react'
import {Modal, Fade, Box, Typography, Backdrop, TextField, Button} from '@mui/material'
import {Virtuoso} from 'react-virtuoso'
import { useLoaderData } from 'react-router'
import {useSelector, useDispatch} from 'react-redux'
import {AlertsContext} from '../../../../alerts/alerts-context'
import {getPokemonWithOwnedBalls, getOwnedBalls, randomGender, setNewOnHandPokemonState, selectivelyReturnIsHAAndEMs, selectNextEmCount, setMaxEmArr, handleEMsState, capitalizeFirstLetter} from './../../../../../utils/functions/misc'
import { selectCollectionPokemon } from '../../../../app/selectors/selectors'
import {setPokemon, setNewOnHand} from '../../../../app/slices/onhand'
import {addOnHandPokemonToList} from '../../../../app/slices/listdisplay'
import { newOnHandPutReq } from '../../../../../utils/functions/backendrequests/addonhand'
import { bulkEditOnHandInfo } from '../../../../../utils/functions/backendrequests/editcollection'
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

export default function OnHandPokemonSelectionForm({speciesEditOnly=false, open, handleClose, initialPokemonData, idxOfInitialPokemon, isHomeCollection}) {
    //usage in regular functions
    const dispatch = useDispatch()

    const allEggMoveInfo = useSelector((state) => state.listDisplay.eggMoveInfo)
    const sortingOptions = useSelector((state) => state.options.sorting.onhand)
    const collectionID = useLoaderData()._id
    const initialSelection = initialPokemonData.imgLink === undefined ? {} : selectCollectionPokemon(store.getState(), initialPokemonData.imgLink)
    const [pokemonData, setPokemonData] = useState({selection: {...initialSelection}, searchData: '', ball: initialPokemonData.ball, newOnHandData: {}})
    const [selectedEMIdx, setSelectedEMIdx] = useState('')
    const [editEggMoveScreen, setEditEggMoveScreen] = useState(false)

    const collectionData = useSelector(state => state.collection)

    const eggMoveData = {
        noEMs: pokemonData.newOnHandData.gender !== undefined ? pokemonData.newOnHandData.EMs === undefined : false,
        EMs: pokemonData.newOnHandData.gender !== undefined ? pokemonData.newOnHandData.EMs : [],
        emCount: pokemonData.newOnHandData.gender !== undefined ? pokemonData.newOnHandData.emCount : 0,
        maxEMs: pokemonData.newOnHandData.gender !== undefined ? (allEggMoveInfo[pokemonData.selection.name] === undefined ? 0 : allEggMoveInfo[pokemonData.selection.name].length > 4 ? 4 : allEggMoveInfo[pokemonData.selection.name].length) : 4,
        possibleEggMoves: pokemonData.newOnHandData.gender !== undefined ? allEggMoveInfo[pokemonData.selection.name] : []
    }

    const emCountSelectionList = setMaxEmArr(eggMoveData.maxEMs) 

    const fullSelectionList = getPokemonWithOwnedBalls(collectionData)
    
    const selectionList = pokemonData.searchData !== '' ? fullSelectionList.filter(p => p.name.toLowerCase().includes(pokemonData.searchData)) : fullSelectionList
    const allowedBalls = pokemonData.selection.balls !== undefined ? getOwnedBalls(pokemonData.selection.balls) : []

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

    const handleBallChange = (e, newBall) => {
        setPokemonData({...pokemonData, ball: newBall})
        if (!speciesEditOnly) {
            const isHAInfo = selectivelyReturnIsHAAndEMs('isHA', pokemonData.selection.balls[newBall].isHA)
            const emCountInfo = selectivelyReturnIsHAAndEMs('emCount', pokemonData.selection.balls[newBall].emCount)
            const EMsInfo = selectivelyReturnIsHAAndEMs('EMs', pokemonData.selection.balls[newBall].EMs)
            setPokemonData({...pokemonData, ball: newBall, newOnHandData: {...pokemonData.newOnHandData, ...isHAInfo, ...emCountInfo, ...EMsInfo}})
        }
    }

    const handleCloseModal = () => {
        handleClose()
        setTimeout(() => setPokemonData({selection: {...initialSelection}, searchData: '', ball: initialPokemonData.ball, newOnHandData: {}}), 500)
    }

    const handleSaveAndCloseSpeciesEditOnly = () => {
        const collectionDataOfNewPokemon = collectionData.filter(p => p.name === pokemonData.selection.name)[0]
        const gender = collectionDataOfNewPokemon.possibleGender === 'both' ? randomGender() : collectionDataOfNewPokemon.possibleGender
        const isHA = collectionDataOfNewPokemon.balls[pokemonData.ball].isHA
        const emCount = collectionDataOfNewPokemon.balls[pokemonData.ball].emCount
        const EMs = collectionDataOfNewPokemon.balls[pokemonData.ball].EMs
        const shared = {
            name: pokemonData.selection.name, 
            natDexNum: pokemonData.selection.natDexNum,
            ball: pokemonData.ball,
            gender, 
            isHA, 
            emCount, 
            EMs, 
            qty: 1
        }
        const saveToDataBase = {...shared, _id: initialPokemonData._id}
        dispatch(setPokemon({
            idx: idxOfInitialPokemon,
            imgLink: pokemonData.selection.imgLink,
            ...shared
        }))
        bulkEditOnHandInfo(saveToDataBase, initialPokemonData._id, collectionID)
        handleClose()
    }

    const selectPokemon = (name) => {
        const newSelection = fullSelectionList.filter(pokemon => pokemon.name === name)[0]
        const ball = getOwnedBalls(newSelection.balls)[0]
        setPokemonData({...pokemonData, selection: newSelection, ball})
        const ballInfo = newSelection.balls[ball]
        if (!speciesEditOnly) {
            const newOnHandData = setNewOnHandPokemonState(ballInfo, newSelection)
            setPokemonData((currentState) => ({...currentState, newOnHandData}))
        }
    }
    
    const listItemContent = (index) => {
        const pokemon = selectionList[index]
        const isSelected = pokemon.name === pokemonData.selection.name
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
                    <Typography>{pokemon.name}</Typography>
                </Box>
            </Box> 
            </>
        )
    }

    const handleIncrementQty = () => {
        if (pokemonData.newOnHandData.qty < 99) {
            setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, qty: pokemonData.newOnHandData.qty + 1}})
        }
    }
    const handleDecrementQty = () => {
        if (pokemonData.newOnHandData.qty > 1) {
            setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, qty: pokemonData.newOnHandData.qty - 1}})
        }
    }

    const handleIsHAChange = (event) => {
        const newValue = event.target.value === 'true'
        setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, isHA: newValue}})
    }

    const handleGenderChange = () => {
        if (pokemonData.newOnHandData.gender === 'male') {
            setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, gender: 'female'}})
        } else {
            setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, gender: 'male'}})
        }
    }

    const handleEmCountChange = (event) => {
        const newValue = selectNextEmCount(emCountSelectionList, parseInt(event.target.value))
        const hasAllPossibleEggMoves = (eggMoveData.possibleEggMoves.length === eggMoveData.maxEMs) && (newValue === eggMoveData.maxEMs)
        if (newValue < pokemonData.newOnHandData.EMs.length) {
            setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, EMs: []}})
        }
        setPokemonData((currentState) => ({...currentState, newOnHandData: {...currentState.newOnHandData, emCount: newValue}}))
        if (hasAllPossibleEggMoves) {
            setPokemonData((currentState) => ({...currentState, newOnHandData: {...currentState.newOnHandData, EMs: eggMoveData.possibleEggMoves}}))
        }
    }

    const handleEMChange = (event) => {
        const selectedEM = event.target.innerText
        // console.log(selectedEM)
        const newEMArr = handleEMsState(event.target.innerText, eggMoveData.EMs)
        setPokemonData({...pokemonData, newOnHandData: {...pokemonData.newOnHandData, EMs: newEMArr}})
        // state change adds or removes egg moves based on innerText event

        const increaseEMCount = (newEMArr.length) > eggMoveData.emCount
        // if the new ems array is greater than the current emcount, increase the em count
        const decreaseEMCount = eggMoveData.maxEMs === eggMoveData.possibleEggMoves.length && eggMoveData.EMs.length > newEMArr.length
        // if the max possible ems is 4 or less AND we are taking out an egg move, decrease the em count
        const changeEMCount = increaseEMCount || decreaseEMCount
  
        // next two if statements determine how the selected EM (selection box) moves depending on whether an egg move is being added (1st) or removed (2nd)
        if (!(pokemonData.newOnHandData.EMs.includes(selectedEM))) {
            const newSelectedEMIdx = (selectedEMIdx === 3 && newEMArr === 4) ? '' : selectedEMIdx+1 // if all egg moves slots are selected, remove selection borders. if not, select next empty slot
            setSelectedEMIdx(newSelectedEMIdx)  
        } else if (pokemonData.newOnHandData.EMs.includes(selectedEM)) {
            setSelectedEMIdx('')
        }
        if (changeEMCount) {
            setPokemonData((currentState) => ({...currentState, newOnHandData: {...currentState.newOnHandData, emCount: newEMArr.length}}))
        }
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

    const handleAddNewOnHand = () => {
        const saveToDataBase = {
            name: pokemonData.selection.name,
            natDexNum: pokemonData.selection.natDexNum,
            ball: pokemonData.ball,
            ...pokemonData.newOnHandData,
            _id: newObjectId()
        }
        const stateInfo = {
            ...saveToDataBase,
            imgLink: pokemonData.selection.imgLink
        }
        dispatch(setNewOnHand(stateInfo)) //updates row content state
        dispatch(addOnHandPokemonToList({newOnhand: stateInfo, sortingOptions})) //updates show list state, which allows the new on hand to appear
        newOnHandPutReq(saveToDataBase, collectionID)

        //spawning alert
        const alertMessage = `Added ${capitalizeFirstLetter(pokemonData.ball)} ${pokemonData.selection.name}`
        const alertInfo = {severity: 'success', message: alertMessage, timeout: 3, messageImgs: [{type: 'ball', linkKey: pokemonData.ball}, {type: 'poke', linkKey: stateInfo.imgLink}]}
        const id = addAlert(alertInfo);
        setAlertIds((prev) => [...prev, id]);

        handleClose()
    }

    return (
        <Modal
            aria-labelledby={speciesEditOnly ? 'change-onhand-pokemon-species' : 'add-new-onhand-pokemon'}
            aria-describedby={speciesEditOnly ? 'change-the-species-of-an-onhand-pokemon' : 'add-owned-pokemon-ball-combo-from-list-to-onhand'}
            open={open}
            onClose={handleClose}
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
                        <SpeciesSelect searchOnChange={searchOnChange} pokemonData={pokemonData} listItemContent={listItemContent} totalCount={selectionList.length} height='60%'/>
                        <Box sx={{height: '25%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '3px', ...modalStyles.onhand.modalElementBg}}>
                            <Box sx={{height: '96%', width: '50%', display: 'flex', flexDirection: 'column'}}>
                                <Box sx={{height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <BallSelectionForm allowedBalls={allowedBalls} handleChange={handleBallChange} value={pokemonData.ball} onhandBallSelect={true} height='90%' width='60%'/>
                                </Box>
                                <Box sx={{height: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                    <QtySelectionForm qty={pokemonData.newOnHandData.qty === undefined ? 0 : pokemonData.newOnHandData.qty} handleIncrement={handleIncrementQty} handleDecrement={handleDecrementQty} newOnHand={true} width='50%'/>
                                </Box>
                            </Box>
                            <Box sx={{height: '96%', width: '50%', display: 'flex', flexDirection: 'column'}}>
                                <Box sx={{height: '40%', display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{height: '100%', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <HASelectionForm 
                                            noHA={(pokemonData.newOnHandData.qty !== undefined && pokemonData.newOnHandData.isHA === undefined)}
                                            isHA={pokemonData.newOnHandData.isHA}
                                            handleChange={handleIsHAChange}
                                            disabled={pokemonData.newOnHandData.qty === undefined}
                                            width='80%'
                                            otherStyles={{color: 'white'}}
                                            selectColor='#283f57'
                                        />
                                    </Box>
                                    <Box sx={{height: '100%', width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <GenderSelectionForm 
                                            width='80%' 
                                            gender={pokemonData.newOnHandData.gender} 
                                            possibleGenders={pokemonData.selection.possibleGender} 
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
                                        disabled={pokemonData.newOnHandData.qty === undefined}
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
                                <Button size='small' variant='contained' onClick={handleCloseModal}>Back</Button>
                            </Box>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button size='large' variant='contained' onClick={handleAddNewOnHand}>Save</Button>
                            </Box>
                            <Box sx={{width: '33%'}}></Box>
                        </Box>
                    </> :
                    <>
                        <Header label={'Change Pokémon'} height='10%'/>
                        <SpeciesSelect searchOnChange={searchOnChange} pokemonData={pokemonData} listItemContent={listItemContent} totalCount={selectionList.length} height='60%'/>
                        <Box sx={{height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3px', ...modalStyles.onhand.modalElementBg}}>
                            <BallSelectionForm allowedBalls={allowedBalls} handleChange={handleBallChange} value={pokemonData.ball} onhandBallSelect={true} width='50%'/>
                        </Box>
                        <Box sx={{height: '10%', display: 'flex', justifyContent: 'center'}}>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button size='small' variant='contained' onClick={handleCloseModal}>Back</Button>
                            </Box>
                            <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button size='large' variant='contained' onClick={handleSaveAndCloseSpeciesEditOnly}>Save</Button>
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