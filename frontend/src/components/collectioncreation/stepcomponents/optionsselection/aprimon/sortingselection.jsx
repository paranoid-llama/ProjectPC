import {Box, Typography, ToggleButton, Button, Select, MenuItem} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import OnHandSortSettingsModal from './onhandsortsettingsmodal'
import CustomSortModal from './customsortmodal'
import SpeciesSelect from '../../../../editbar/editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import { sortList } from '../../../../../../common/sortingfunctions/customsorting.mjs'
import { useState, forwardRef } from 'react'

export default function SortingSelection({sortData, handleChange, handleCustomSortChange, totalBalls, tentativeBallOrder, holdPokemon}) {
    const [modalStates, setModalStates] = useState({onhandSortSettings: {open: false}, collectionSort: {open: false}})
    const nameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames

    const openModal = (type) => {
        setModalStates({...modalStates, [type]: {...modalStates[type], open: true}})
    }
    const closeModal = (type) => {
        setModalStates({...modalStates, [type]: {...modalStates[type], open: false}})
    }

    const handleOnhandBallOrderChange = (newBall) => {
        const newArr = sortData.onhand.ballOrder.includes(newBall) ? sortData.onhand.ballOrder.filter(b => b !== newBall) : [...sortData.onhand.ballOrder, newBall]
        handleChange('ballOrder', newArr, 'onhand')
    }

    const parseHandleSortChangeData = (result) => {
        const draggedPokemonData = result.source.droppableId === 'customSort' ? sortData.customSort.filter(p => p.id === result.draggableId)[0] : holdPokemon.filter(p => p.id === result.draggableId)[0]
        if (result.destination === null) {
            return
        }
        if (result.destination.droppableId === "holdList") {
            const newCustomSortState = result.source.droppableId === 'customSort' ? sortData.customSort.filter(p => p.id !== result.draggableId) : sortData.customSort
            const newHoldListState = result.source.droppableId === 'customSort' ? [...holdPokemon, draggedPokemonData] : [...holdPokemon]
            handleCustomSortChange(newCustomSortState, newHoldListState)
        } else if (result.destination.droppableId === 'customSort') {
            const newHoldListState = result.source.droppableId === 'holdList' ? holdPokemon.filter(p => p.id !== result.draggableId) : holdPokemon
            const newCustomSortState = result.source.droppableId === 'holdList' ? [...sortData.customSort] : sortData.customSort.filter(p => p.id !== result.draggableId)
            newCustomSortState.splice(result.destination.index, 0, draggedPokemonData)
            handleCustomSortChange(newCustomSortState, newHoldListState)
        }
    }

    const handleCollectionSortByKey = (key) => {
        const newCustomSortState = sortList(key, sortData.customSort)
        handleCustomSortChange(newCustomSortState)
    }

    const totalCollectionSortDisplay = [...sortData.customSort, ...holdPokemon]

    const listCustomSortItem = (index) => {
        const pokemon = totalCollectionSortDisplay[index]
        return (
            <>
            <Box sx={{display: 'flex', alignItems: 'center', backgroundColor: '#283f57', borderRadius: '10px', marginBottom: '3px', marginTop: '3px'}}>
                <Box sx={{height: '100%', width: '7%', mx: 1, pointerEvents: 'none'}}>
                    <ImgData linkKey={pokemon.id}/>
                </Box>
                <Box sx={{height: '100%', width: '8%', ml: 1, pointerEvents: 'none'}}>
                    <Typography sx={{fontSize: '10px'}}>#{pokemon.natDexNum}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '35%', ml: 1, pointerEvents: 'none'}}>
                    <Typography sx={{fontSize: '12px'}}>{getNameDisplay(nameDisplaySettings, pokemon.name, pokemon.natDexNum)}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '40%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mr: 4, pointerEvents: 'none'}}>
                    <Typography sx={{fontSize: '12px', width: '70%', ml: 2}}>Position {index+1}</Typography>
                </Box>
            </Box> 
            </>
        )
    }


    const disabledCollectionResortEffect = sortData.collection.reorder === false ? {pointerEvents: 'none', opacity: 0.5} : {}
    const disabledOnhandResortEffect = sortData.onhand.reorder === false ? {pointerEvents: 'none', opacity: 0.5} : {}
    
    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
            <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 1}}>Sorting Mechanisms</Typography>
            <Typography sx={{fontSize: '12px'}}>
                Select the auto-sort method whenever you add/remove pokemon from the collection/on-hand list, and if you want it to reorder everytime.
                Also, custom sort the collection list.
            </Typography>
            <Box sx={{width: '90%', height: '90%', display: 'flex', flexDirection: 'row', mt: 1}}>
                <Box sx={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Box sx={{width: '100%', height: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <Typography sx={{fontSize: '14px', fontWeight: 700}}>Collection List</Typography>
                        <Box sx={{width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2}}>
                            <Typography sx={{fontSize: '14px'}}>Auto Re-Sort List:</Typography>
                            <ToggleButton 
                                sx={{padding: 1, py: 0}} 
                                value={true} 
                                selected={sortData.collection.reorder === true} 
                                onChange={(e) => handleChange('reorder', true, 'collection')}
                            >
                                Yes
                            </ToggleButton>
                            <ToggleButton 
                                sx={{padding: 1, py: 0}} 
                                value={false}
                                selected={sortData.collection.reorder === false} 
                                onChange={(e) => handleChange('reorder', false, 'collection')}
                            >
                                No
                            </ToggleButton>
                        </Box>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, gap: 2, ...disabledCollectionResortEffect}}>
                            <Typography sx={{fontSize: '14px'}}>Sort By:</Typography>
                            <Select 
                                value={sortData.collection.default}
                                sx={{'&.MuiInputBase-root': {width: '70%'}, '& .MuiSelect-select': {fontSize: '12px', py: 0}}}
                                size='small'
                                onChange={(e, newVal) => handleChange('default', newVal.props.value, 'collection')}
                            >
                                <MenuItem value='NatDexNumL2H'>Dex # - Lowest to Highest</MenuItem>
                                <MenuItem value='NatDexNumH2L'>Dex # - Highest to Lowest</MenuItem>
                                <MenuItem value='A2Z'>Name - A to Z</MenuItem>
                                <MenuItem value='Z2A'>Name - Z to A</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height: '80%', display: 'flex', alignItems: 'center', flexDirection: 'column', mt: 2}}>
                        <Typography sx={{fontSize: '14px', fontWeight: 700}}>On-Hand List</Typography>
                        <Box sx={{width: '100%', height: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2}}>
                            <Typography sx={{fontSize: '14px'}}>Auto Re-Sort List:</Typography>
                            <ToggleButton 
                                sx={{padding: 1, py: 0.5}} 
                                value={true} 
                                selected={sortData.onhand.reorder === true} 
                                onChange={(e) => handleChange('reorder', true, 'onhand')}
                            >
                                Yes
                            </ToggleButton>
                            <ToggleButton 
                                sx={{padding: 1, py: 0.5}} 
                                value={false}
                                selected={sortData.onhand.reorder === false} 
                                onChange={(e) => handleChange('reorder', false, 'onhand')}
                            >
                                No
                            </ToggleButton>
                        </Box>
                        <Box sx={{width: '100%', height: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, gap: 2, ...disabledOnhandResortEffect}}>
                            <Typography sx={{fontSize: '14px'}}>Sort By:</Typography>
                            <Select 
                                value={sortData.onhand.default}
                                sx={{'&.MuiInputBase-root': {width: '70%'}, '& .MuiSelect-select': {fontSize: '12px'}}}
                                size='small'
                                onChange={(e, newVal) => handleChange('default', newVal.props.value, 'onhand')}
                            >
                                <MenuItem value='NatDexNumL2H'>Dex # - Lowest to Highest</MenuItem>
                                <MenuItem value='NatDexNumH2L'>Dex # - Highest to Lowest</MenuItem>
                                <MenuItem value='A2Z'>Name - A to Z</MenuItem>
                                <MenuItem value='Z2A'>Name - Z to A</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={{width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 0.5, ...disabledOnhandResortEffect}}>
                            <Button onClick={() => openModal('onhandSortSettings')}>
                                Other On-Hand Sort Settings
                            </Button>
                            <OnHandSortSettingsModal 
                                onhandSortSettings={sortData.onhand} 
                                open={modalStates.onhandSortSettings.open} 
                                closeModal={closeModal} 
                                handleBallOrderChange={handleOnhandBallOrderChange}
                                totalBalls={totalBalls}
                                tentativeBallOrder={tentativeBallOrder}
                                handleChange={handleChange}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{width: '60%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
                    <Typography sx={{fontSize: '14px', fontWeight: 700}}>Custom Sort Collection List</Typography>
                    <SpeciesSelect
                        listItemContent={(index) => listCustomSortItem(index, false)}
                        totalCount={totalCollectionSortDisplay.length}
                        height='70%'
                        onlyList={true}
                        otherStyles={{width: '100%', mt: 1, backgroundColor: 'none'}}
                        virtuosoStyles={{backgroundColor: 'rgb(30, 47, 65)', border: '1px solid black'}}
                        onHoverStyles={true}
                        virtuosoProps={{onClick: () => openModal('collectionSort')}}
                    />
                    <Typography sx={{fontSize: '12px'}}>Click to enlarge and edit</Typography>
                    <CustomSortModal 
                        open={modalStates.collectionSort.open}
                        closeModal={closeModal}
                        customSortState={sortData.customSort}
                        holdPokemon={holdPokemon}
                        handleChange={parseHandleSortChangeData}
                        handleChangeBySortKey={handleCollectionSortByKey}
                    />
                </Box>
            </Box>
        </Box>
    )
}