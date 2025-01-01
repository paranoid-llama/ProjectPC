import {Box, Typography, Grid, Button, Select, MenuItem} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Header from '../../../../titlecomponents/subcomponents/header'
import { DragDropContext } from 'react-beautiful-dnd'
import { StrictModeDroppable } from './dndcomponents/stictmodedroppable'
import SortItem from './dndcomponents/sortitem'
import DroppableList from './dndcomponents/droppablelist'
import { useState } from 'react'

export default function CustomSortModalContents({elementBg, customSortState, holdPokemon, handleChange, handleChangeBySortKey, changingCustomSort=false, changeOptionsSave, saveErrorNoticeShow, sw}) {
    const nameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    const [sortType, setSortType] = useState('NatDexNumL2H')
    const sortKeys = ['NatDexNumL2H', 'A2Z', 'NatDexNumH2L', 'Z2A']
    const sortKeyButton = ['Dex Number - Lowest to Highest', 'Name - A to Z', 'Dex Number - Highest to Lowest', 'Name - Z to A']
    const displayOrientationMediaQuery = {
        '@media only screen and (max-width: 499px)': {
            flexDirection: 'column'
        }
    }
    const listMq = {
        '@media only screen and (max-width: 499px)': {
            height: '45%',
            width: '100%',
            mb: 3
        }
    }
    const labelMq = {
        '@media only screen and (max-width: 499px)': {
            top: '-12%'
        }
    }

    return (
        <>
        {changingCustomSort && 
        <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center', mb: 1}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeOptionsSave(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeOptionsSave(false, 'sorting')}>Sorting Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1, textAlign: 'center'}}>Custom Sorting</Typography>
        </Box>
        }
        <Box sx={{...elementBg, width: '95%', height: '5%'}}>
            <Header additionalStyles={{fontSize: '20px', py: 0.5}}>Sort Collection List</Header>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '80%', mt: 1, display: 'flex', flexDirection: 'column'}}>
            <Box sx={{width: '100%', height: '5%'}}>

            </Box>
            <Box sx={{width: '100%', height: '95%', display: 'flex', justifyContent: 'center', position: 'relative', ...displayOrientationMediaQuery}}>
                <DragDropContext onDragEnd={(e) => handleChange(e)}>
                <Box sx={{width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', ...listMq}}>
                    <Typography sx={{fontSize: '14px', fontWeight: 700, position: 'absolute', top: '-4.5%', ...labelMq}}>List</Typography>
                    <StrictModeDroppable 
                        droppableId="customSort" 
                        mode='virtual' 
                        renderClone={(provided, snapshot, rubric) => (
                            <SortItem provided={provided} pokemon={customSortState[rubric.source.index]} isClone={true} snapshot={snapshot} nameDisplaySettings={nameDisplaySettings}/>
                        )}
                    >
                        {(provided) => (
                            <DroppableList
                                innerRef={provided.innerRef}
                                droppableProps={provided.droppableProps}
                                placeholder={provided.placeholder}
                                provided={provided}
                                listContent={customSortState}
                                isHoldList={false}
                                totalCount={customSortState.length}
                                virtuosoStyles={{border: '1px solid black'}}
                                otherContainerStyles={{backgroundColor: '#1e2f41', height: '95%'}}
                                nameDisplaySettings={nameDisplaySettings}
                            /> 
                        )}
                        
                    </StrictModeDroppable>
                </Box>
                <Box sx={{width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', position: 'relative', ...listMq}}>
                    <Typography sx={{fontSize: '14px', fontWeight: 700, position: 'absolute', top: '-4.5%', ...labelMq}}>On-Hold Pokemon</Typography>
                    <StrictModeDroppable 
                        droppableId="holdList"
                        mode='virtual' 
                        renderClone={(provided, snapshot, rubric) => (
                            <SortItem provided={provided} pokemon={holdPokemon[rubric.source.index]} isDragging={snapshot.isDragging} snapshot={snapshot} isHoldList={true} nameDisplaySettings={nameDisplaySettings}/>
                        )}
                    >
                        {(provided, snapshot) => (
                            <DroppableList
                                innerRef={provided.innerRef}
                                droppableProps={provided.droppableProps}
                                placeholder={provided.placeholder}
                                listContent={holdPokemon}
                                isHoldList={true}
                                snapshot={snapshot}
                                totalCount={holdPokemon.length}
                                virtuosoStyles={{border: '1px solid black'}}
                                otherContainerStyles={{backgroundColor: '#1e2f41', height: '95%'}}
                                nameDisplaySettings={nameDisplaySettings}
                            />
                        )}
                    </StrictModeDroppable>
                </Box>
                </DragDropContext>
            </Box>
            <Typography sx={{fontSize: '11px', textAlign: 'center', mt: -2}}>
                Drag pokemon and drop them into another part of the list, or put them in the On-Hold box to place them later. 
                Pokemon left in the on-hold box will be placed at the end of the list in the same order
            </Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '12%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1}}>
            <Box sx={{width: '100%', height: sw ? '35%' : '15%', display: 'flex', justifyContent: 'center'}}>
                <Typography sx={{fontSize: '14px'}}>Sort List By (Double-Click{sw ? ' the Button' : ''}):</Typography>
            </Box>
            {sw ? 
            <>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '50%', gap: 2}}>
                <Select 
                    value={sortType}
                    sx={{'&.MuiInputBase-root': {width: '60%', height: '100%'}, '& .MuiSelect-select': {fontSize: '12px', color: 'white'}}}
                    size='small'
                    onChange={(e, newVal) => setSortType(newVal.props.value)}
                >
                    {sortKeys.map((sK, idx) => {
                        return (
                            <MenuItem key={`sort-collection-list-${sK}`} value={sK}>{sortKeyButton[idx]}</MenuItem>
                        )
                    })}
                </Select>
                <Button variant='contained' size='small' onDoubleClick={() => handleChangeBySortKey(sortType)}>Sort List</Button>
            </Box>
            </> : 
            <>
            <Box sx={{width: '90%', height: '75%', display: 'flex', justifyContent: 'center', mt: 1}}>
                <Grid container>
                    {sortKeys.map((sK, idx) => (
                    <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={`sort-collection-list-${sK}`}>
                        <Button sx={{fontSize: sw ? '10px' : '11px'}} onDoubleClick={() => handleChangeBySortKey(sK)}>
                            {sortKeyButton[idx]}
                        </Button>
                    </Grid>
                    ))
                    }
                </Grid>
            </Box>
            </>
            }
        </Box>
        {changingCustomSort && 
        <Box sx={{mt: 1, height: sw ? '45px' : '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: sw ? '5%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeOptionsSave(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: sw ? '35%' : '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size={sw ? 'large' : 'small'} variant='contained' sx={{py: 0, fontSize: sw ? '20px' : '15px'}} onClick={() => changeOptionsSave(true, 'sorting')}>Save</Button>
            </Box>
            {saveErrorNoticeShow && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: sw ? 1 : 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700, textAlign: 'center'}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        }
        </>
    )
}