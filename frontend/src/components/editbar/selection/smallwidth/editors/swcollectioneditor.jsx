import {Box, Typography, useTheme, ToggleButton} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { setMaxEmArr } from '../../../../../../utils/functions/misc'
import { setIsOwned, setIsHA, deleteEms, setEmCount, setEms, setDefault, setTags } from '../../../../../app/slices/collectionstate'
import { setUnsavedChanges } from '../../../../../app/slices/editmode'
import getDefaultData from '../../../../../../utils/functions/defaultdata'
import { selectNextEmCount } from '../../../../../../utils/functions/misc'
import IsOwnedSelectionForm from '../../../editsectioncomponents/collectioneditonly/isownedselectionform'
import HASelectionForm from '../../../editsectioncomponents/shared/haselectionform'
import EggMoveSelectionForm from '../../../editsectioncomponents/shared/eggmoveselectionform'
import { useEffect, useState } from 'react'
import SWEditEggMovesForm from './swediteggmovesform'

//to-do: move all state updates into their own specialized functions

export default function SWCollectionEditor({allowedBalls, pokemonId, isHomeCollection, idxOfPokemon}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [emStates, setEmStates] = useState({selectedEm: '', open: 'firstRenderFalse'})

    const selectedBallState = useSelector((state) => state.editmode.selectedBall)
    const selectedBall = !allowedBalls.includes(selectedBallState) ? allowedBalls[0] : selectedBallState

    const pokemon = useSelector((state) => state.collectionState.collection.filter(p => p.imgLink === pokemonId)[0])
    const ballInfo = pokemon.balls

    const listType = 'collection'
    const allEggMoves = useSelector((state) => state.collectionState.eggMoveInfo)
    //ems
    const possibleEggMoves = allEggMoves[pokemon.name]
    const maxEMs = possibleEggMoves === undefined ? 0 : possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length
    const emCountSelectionList = setMaxEmArr(maxEMs)

    //default logic used for isOwned state and setDefault state
    const globalDefault = useSelector((state) => state.collectionState.options.globalDefaults)
    const checkDefault = Object.keys(ballInfo)[Object.values(ballInfo).map((b) => b.default !== undefined).indexOf(true)]
    const currentDefault = checkDefault === undefined ? 'none' : checkDefault

    const selectedIdx = useSelector(state => state.collectionState.collection.indexOf(pokemon))
    const isOwnedState = pokemon.balls[selectedBall].isOwned
    const isHAState = pokemon.balls[selectedBall].isHA
    const emCountState = pokemon.balls[selectedBall].emCount
    const EMs = pokemon.balls[selectedBall].EMs
    const activeTag = pokemon.balls[selectedBall].highlyWanted !== undefined ? 'highlyWanted' : pokemon.balls[selectedBall].pending !== undefined ? 'pending' : 'none'
    
    const noEMs = pokemon.balls[selectedBall].EMs === undefined
    const noHA = pokemon.balls[selectedBall].isHA === undefined
    const handleIsOwnedChange = (event) => {
        const newValue = event.target.checked
        const defaultData = getDefaultData(globalDefault, currentDefault, pokemon.balls, maxEMs, possibleEggMoves, selectedBall)
        dispatch(setIsOwned({idx: selectedIdx, ball: selectedBall, ballDefault: defaultData}))
        dispatch(setUnsavedChanges())
    }
    const handleIsHAChange = (event) => {
        const newValue = event.target.value === 'true' // event.target.value comes out as a string instead of boolean
        dispatch(setIsHA({idx: selectedIdx, ball: selectedBall, listType}))
        dispatch(setUnsavedChanges())
    }
    const handleEmCountChange = (event) => {
        const newValue = selectNextEmCount(emCountSelectionList, parseInt(event.target.value))
        const hasAllPossibleEggMoves = (possibleEggMoves.length === maxEMs) && (newValue === maxEMs)
        if (newValue < EMs.length) {
            dispatch(deleteEms({idx: selectedIdx, ball: selectedBall, listType}))
        }
        if (hasAllPossibleEggMoves) {
            for (let eggmove of possibleEggMoves) {
                dispatch(setEms({idx: selectedIdx, ball: selectedBall, listType, emName: eggmove}))
            }
        }
        dispatch(setEmCount({idx: selectedIdx, ball: selectedBall, listType, numEMs: newValue}))
        dispatch(setUnsavedChanges())
    }
    const handleEMChange = (event) => {
        if (event === 'onlyOnePossibleEM') {
            dispatch(setEms({idx: selectedIdx, ball: selectedBall, listType, emName: possibleEggMoves[0]}))
            dispatch(setEmCount({idx: selectedIdx, ball: selectedBall, listType, numEMs: 1} ))
            dispatch(setUnsavedChanges())
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
            dispatch(setEms({idx: selectedIdx, ball: selectedBall, listType, emName: selectedEM}))
            if (changeEMCount) {
                dispatch(setEmCount({idx: selectedIdx, ball: selectedBall, listType, numEMs: newEMArr.length}))
            }
            // next two if statements determine how the selected EM (selection box) moves depending on whether an egg move is being added (1st) or removed (2nd)
            // if (!(EMs.includes(selectedEM))) {
            //     const newSelectedEMIdx = (editEggMoves.idx === 3 && newEMArr === 4) ? '' : editEggMoves.idx+1 // if all egg moves slots are selected, remove selection borders. if not, select next empty slot
            //     setEditEggMoves({...editEggMoves, idx: newSelectedEMIdx})
            // } else if (EMs.includes(selectedEM)) {
            //     setEditEggMoves({...editEggMoves, idx: ''})
            // }
            dispatch(setUnsavedChanges())
        }
    }
    const handleDefaultChange = () => {
        dispatch(setDefault({idx: selectedIdx, ball: selectedBall, prevDefault: currentDefault}))
        dispatch(setUnsavedChanges())
    }
    const handleEditTags = (tagType, idx, ball) => {
        dispatch(setTags({tagType, idx, ball}))
        dispatch(setUnsavedChanges())
    }

    const toggleSelectedEM = (i) => {
        setEmStates({...emStates, selectedEm: i === emStates.selectedEm ? '' : i})
    }
    const toggleModalScreen = () => {
        setEmStates({...emStates,  open: emStates.open === 'firstRenderFalse' ? true : !emStates.open})
    }

    const toggleEMScreen = (idx) => {
        if (idx !== 'close') {
            setEmStates({...emStates, open: true, selectedEm: EMs.length})
        } else if (idx === 'close') {
            setEmStates({...emStates, open: false, selectedEm: ''})
        }
    }

    useEffect(() => {
        if (emStates.open !== 'firstRenderFalse' && emStates.selectedEm !== '') {
            setEmStates({selectedEm: '', open: 'firstRenderFalse'})
        }
    }, [selectedBall, pokemon.name])

    return (
        <>
        <Box sx={{width: '100%', height: '100%', ...theme.components.box.fullCenterRow, position: 'relative'}}>
            <Box sx={{width: '100%', maxWidth: '376px', height: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start', gap: 1, position: 'relative'}}>
                <Box sx={{width: '100%', height: '25%', ...theme.components.box.fullCenterRow, gap: 0}}>
                    <IsOwnedSelectionForm
                        isOwned={isOwnedState} 
                        handleChange={handleIsOwnedChange}
                        width='45%'
                        checkboxProps={{size: 'large'}}
                        formHeight='20%'
                        cbHeight='80%'
                    />
                    <HASelectionForm
                        noHA={noHA} 
                        isHA={isHAState} 
                        handleChange={handleIsHAChange}
                        disabled={isOwnedState === false}
                        buttonSizes={'medium'}
                        width='45%'
                    />
                    
                </Box>
                {/* <Box sx={{width: '100%', height: '12px'}}>
                    <Typography sx={{fontSize: '12px', textAlign: 'center'}}><b>Egg Moves</b></Typography>
                </Box> */}
                <Box sx={{width: '100%', height: '40%', ...theme.components.box.fullCenterRow, gap: 0}}>
                    <EggMoveSelectionForm
                        noEMs={noEMs} 
                        emCount={emCountState}
                        EMs={EMs}
                        maxEms={maxEMs}
                        idxOfSelectedEM={emStates.selectedEm}
                        handleEmCountChange={handleEmCountChange}
                        handleEMChange={handleEMChange}
                        toggleScreen={toggleEMScreen}
                        disabled={isOwnedState === false}
                        isHomeCollection={isHomeCollection}
                        width='100%'
                        otherEmTextStyles={{fontSize: '14px'}}
                    />
                </Box>
                {isOwnedState ? 
                    !(isHAState === undefined && emCountState === undefined) ? 
                        <ToggleButton 
                            sx={{width: '60%', fontSize: '14px', padding: 0, py: 2, border: 'none', marginLeft: '3%', color: '#73661e'}}
                            size='small'
                            value='default'
                            selected={pokemon.balls[selectedBall].default !== undefined}
                            onClick={handleDefaultChange}
                        >
                            {pokemon.balls[selectedBall].default !== undefined ? 'Current Default' : 'Set as Default'}
                        </ToggleButton> : <></> :  
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 7}}>
                        <ToggleButton 
                            value='highlyWanted'
                            size='medium' 
                            sx={{fontSize: '18px', padding: 2, border: 'none', color: '#73661e'}} 
                            selected={activeTag === 'highlyWanted'}
                            onClick={() => handleEditTags('highlyWanted', idxOfPokemon, selectedBall)}
                        >
                                Wanted
                        </ToggleButton>
                        <ToggleButton 
                            value='pending'
                            size='medium' 
                            sx={{fontSize: '18px', padding: 2, border: 'none', color: '#73661e'}} 
                            selected={activeTag === 'pending'}
                            onClick={() => handleEditTags('pending', idxOfPokemon, selectedBall)}
                        >
                                Pending
                        </ToggleButton> 
                    </Box>
                }
                
            </Box>
            
        </Box>
        {!isHomeCollection && 
        <SWEditEggMovesForm 
            EMs={EMs}
            maxEms={maxEMs}
            emCount={emCountState}
            idxOfSelectedEM={emStates.selectedEm}
            possibleEggMoves={possibleEggMoves}
            toggleScreen={toggleEMScreen}
            handleEMChange={handleEMChange}
            toggleClass={emStates.open === 'firstRenderFalse' ? '' : emStates.open ? 'open-sw-em-selection' : 'close-sw-em-selection'}
        />
        }
        </>
    )
}