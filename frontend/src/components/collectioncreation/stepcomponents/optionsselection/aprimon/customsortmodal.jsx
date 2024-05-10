import {Box, Typography, Modal, Backdrop, Fade, Button, Grid} from '@mui/material'
import { Virtuoso } from 'react-virtuoso'
import { useState, useRef, useMemo } from 'react'
import Header from '../../../../titlecomponents/subcomponents/header'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
import CustomSortModalContents from './customsortmodalcontents'
import SpeciesSelect from '../../../../editbar/editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import DraggableSortItem from './dndcomponents/draggablesortitem'
import SortItem from './dndcomponents/sortitem'
import DroppableList from './dndcomponents/droppablelist'
import { StrictModeDroppable } from './dndcomponents/stictmodedroppable'
import { Droppable, DragDropContext, Draggable } from 'react-beautiful-dnd'

export default function CustomSortModal({open, closeModal, customSortState, holdPokemon, handleChange, handleChangeBySortKey}) {
    const elementBg = modalStyles.onhand.modalElementBg
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
                    <CustomSortModalContents 
                        elementBg={elementBg}
                        customSortState={customSortState}
                        holdPokemon={holdPokemon}
                        handleChange={handleChange}
                        handleChangeBySortKey={handleChangeBySortKey}
                    />
                </Box>
            </Fade>
        </Modal>
    )
}