import {Modal, Box, Typography, Button, ToggleButton, Grid, Tabs, Tab, Backdrop, Fade, Select, MenuItem, TextField} from '@mui/material'
import { useState, useEffect } from 'react'
import { NumericFormat } from 'react-number-format'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
import ItemSelectionModalContents from './itemselectionmodalcontents';

export default function ItemSelectionModal({activeTab, changeTab, itemsState, totalItems, lfItems, ftItems, open, toggleModal, handleChange, ftSelectedItem, changeFtSelectedItem}) {
   
    const lfDisabled = itemsState === 'none' || itemsState === 'ft'
    const ftDisabled = itemsState === 'none' || itemsState === 'lf'

    return (
        <Modal 
            aria-labelledby='select-items'
            aria-describedby="select items you're looking for or items you're offering"
            open={open}
            onClose={toggleModal}
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
                    <ItemSelectionModalContents 
                        elementBg={modalStyles.onhand.modalElementBg}
                        activeTab={activeTab}
                        changeTab={changeTab}
                        totalItems={totalItems}
                        lfItems={lfItems}
                        ftItems={ftItems}
                        handleChange={handleChange}
                        ftSelectedItem={ftSelectedItem}
                        changeFtSelectedItem={changeFtSelectedItem}
                        lfDisabled={lfDisabled}
                        ftDisabled={ftDisabled}
                    />
                </Box>
            </Fade>
        </Modal>
    )
}