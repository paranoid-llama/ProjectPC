import {Box, Typography, Modal, Backdrop, Fade, Button, Grid} from '@mui/material'
import { Virtuoso } from 'react-virtuoso'
import { useState, useRef, useMemo } from 'react'
import Header from '../../../../titlecomponents/subcomponents/header'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
import SpeciesSelect from '../../../../editbar/editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import DraggableSortItem from './draggablesortitem'
import SortItem from './sortitem'
import DroppableList from './droppablelist'
import { StrictModeDroppable } from './stictmodedroppable'
import { Droppable, DragDropContext, Draggable } from 'react-beautiful-dnd'

export default function CustomSortModal({open, closeModal, customSortState, holdPokemon, handleChange, handleChangeBySortKey}) {

    const sortKeys = ['NatDexNumL2H', 'NatDexNumH2L', 'A2Z', 'Z2A']
    const sortKeyButton = ['Dex Number - Lowest to Highest', 'Dex Number - Highest to Lowest', 'Name - A to Z', 'Name - Z to A']

    return (
        <Modal 
            aria-labelledby='custom-collection-sort'
            aria-describedby="sort the positions of your pokemon in the collection list"
            open={open}
            onClose={() => closeModal('collectionSort')}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '5%'}}>
                        <Header additionalStyles={{fontSize: '20px', py: 0.5}}>Sort Collection List</Header>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '80%', mt: 1, display: 'flex', flexDirection: 'column'}}>
                        <Box sx={{width: '100%', height: '5%'}}>

                        </Box>
                        <Box sx={{width: '100%', height: '95%', display: 'flex', justifyContent: 'center', position: 'relative'}}>
                            <DragDropContext onDragEnd={(e) => handleChange(e)}>
                            <Box sx={{width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
                                <Typography sx={{fontSize: '14px', fontWeight: 700, position: 'absolute', top: '-4.5%'}}>List</Typography>
                                <StrictModeDroppable 
                                    droppableId="customSort" 
                                    mode='virtual' 
                                    renderClone={(provided, snapshot, rubric) => (
                                        <SortItem provided={provided} pokemon={customSortState[rubric.source.index]} isClone={true} snapshot={snapshot}/>
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
                                        /> 
                                    )}
                                    
                                </StrictModeDroppable>
                            </Box>
                            <Box sx={{width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', position: 'relative'}}>
                                <Typography sx={{fontSize: '14px', fontWeight: 700, position: 'absolute', top: '-4.5%'}}>On-Hold Pokemon</Typography>
                                <StrictModeDroppable 
                                    droppableId="holdList"
                                    mode='virtual' 
                                    renderClone={(provided, snapshot, rubric) => (
                                        <SortItem provided={provided} pokemon={holdPokemon[rubric.source.index]} isDragging={snapshot.isDragging} snapshot={snapshot} isHoldList={true}/>
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
                                        />
                                    )}
                                </StrictModeDroppable>
                            </Box>
                            </DragDropContext>
                        </Box>
                        <Typography sx={{fontSize: '12px', textAlign: 'center', mt: -2}}>
                            Drag pokemon and drop them into another part of the list, or put them in the On-Hold box to place them later. 
                            Pokemon left in the on-hold box will be placed at the end of the list in the same order
                        </Typography>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '12%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1}}>
                        <Box sx={{width: '100%', height: '15%', display: 'flex', justifyContent: 'center'}}>
                            <Typography sx={{fontSize: '14px'}}>Sort List By (Double-Click):</Typography>
                        </Box>
                        <Box sx={{width: '90%', height: '75%', display: 'flex', justifyContent: 'center', mt: 1}}>
                            <Grid container>
                                {sortKeys.map((sK, idx) => (
                                <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={`sort-collection-list-${sK}`}>
                                    <Button sx={{fontSize: '11px'}} onDoubleClick={() => handleChangeBySortKey(sK)}>
                                        {sortKeyButton[idx]}
                                    </Button>
                                </Grid>
                                ))
                                }
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}