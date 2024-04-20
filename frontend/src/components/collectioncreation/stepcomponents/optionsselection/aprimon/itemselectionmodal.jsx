import {Modal, Box, Typography, Button, ToggleButton, Grid, Tabs, Tab, Backdrop, Fade, Select, MenuItem, TextField} from '@mui/material'
import { useState, useEffect } from 'react'
import { NumericFormat } from 'react-number-format'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'

export default function ItemSelectionModal({activeTab, changeTab, itemsState, totalItems, lfItems, ftItems, open, toggleModal, handleChange, ftSelectedItem, changeFtSelectedItem}) {
   
    const lfDisabled = itemsState === 'none' || itemsState === 'ft'
    const ftDisabled = itemsState === 'none' || itemsState === 'lf'

    const renderItems = () => {
        return (
            totalItems.map(item => {
                return (
                    <Grid item xs={2} key={`${activeTab}-${item.display}-selection`} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton 
                            value={item.value} 
                            sx={{
                                padding: 0.5, 
                                display: 'flex', 
                                flexDirection: 'column',
                                textTransform: 'none',
                                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 3px 0px rgba(0,0,0,0.22)',
                                '&.Mui-selected': {
                                    backgroundColor: '#283f57'
                                },
                                position: 'relative'
                            }}
                            selected={activeTab === 'lf' ? lfItems.includes(item.value) : Object.keys(ftItems).includes(item.value)}
                            onChange={activeTab === 'lf' ? handleChange : (e) => handleChange(e, item.value, false)}
                        >
                            <Typography sx={{fontSize: '14px', color: '#e3e3e3'}}>{item.display}</Typography>
                            <ImgData type='items' linkKey={item.value} size='32px'/>
                            {(activeTab === 'ft' && ftItems[item.value] !== undefined) &&
                                <Typography sx={{position: 'absolute', fontSize: '12px', top: '100%', color: 'white'}}>
                                    {ftItems[item.value] === 0 ? 'Indeterminate' : ftItems[item.value]}
                                </Typography>
                            }
                        </ToggleButton>
                    </Grid>
                )
            })
        )
    }

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
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '8%'}}>
                        <Tabs value={activeTab} onChange={changeTab}>
                            <Tab value='lf' label='LF' disabled={lfDisabled} sx={{'&.Mui-disabled': {opacity: 0.3}, '&.MuiButtonBase-root': {color: 'white'}}}/>
                            <Tab value='ft' label='FT' disabled={ftDisabled} sx={{'&.Mui-disabled': {opacity: 0.3}, '&.MuiButtonBase-root': {color: 'white'}}}/>
                        </Tabs>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '22%', mt: 1}}>
                        <Typography variant='h5' align='center' sx={{paddingTop: '10px', fontSize: '24px', fontWeight: 700, mb: activeTab === 'lf' ? 2 : 1}}>Select {activeTab === 'lf' ? 'LF' : 'FT'} Items</Typography>
                        <Typography align='center' sx={{paddingTop: '10px', fontSize: '16px', fontWeight: 400}}>
                            {activeTab === 'lf' ? "Select which items you're looking for among the below list of valuable items" : 
                                "Select which items you're offering among the below list of valuable items. You do not have to specify a quantity for them, but it helps potential traders!"
                            }
                        </Typography>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '55%', mt: 1, display: 'flex', alignItems: 'center'}}>
                        <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                            {renderItems()}
                        </Grid>
                    </Box>
                    {activeTab === 'ft' && 
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '10%', mt: 1, display: 'flex', alignItems: 'center', gap: 2}}>
                        {ftSelectedItem !== 'none' ? 
                            <>
                            <Box sx={{width: '1%'}}></Box>
                            <Box sx={{width: '7%', display: 'flex', alignItems: 'center'}}>
                                <ImgData type='items' linkKey={ftSelectedItem}/> 
                            </Box>
                            </> :
                            <Box sx={{width: '8%'}}></Box>
                        }  
                        <Select 
                            value={ftSelectedItem === 'none' ? '' : ftSelectedItem} 
                            sx={{width: '30%', '& .MuiSelect-select': {padding: 1, color: 'white'}}} 
                            onChange={changeFtSelectedItem}
                        >
                            {Object.keys(ftItems).map(ftItem => {
                                const label = totalItems.filter(it => it.value === ftItem)[0].display
                                return (
                                    <MenuItem key={`${ftItem}-ft-qty-select`} value={ftItem}>{label}</MenuItem>
                                )
                            })}
                        </Select>
                        {ftSelectedItem !== 'none' && 
                            <>
                            <Typography>Quantity:</Typography>
                            <NumericFormat
                                sx={{position: 'relative', '& .MuiInputBase-root': {width: '100%', color: 'white'}, '&.MuiTextField-root': {width: '30%'}}}
                                InputProps={{
                                    endAdornment: <Box sx={{height: '90%', width: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative'}}>
                                        <Box sx={{height: '50%', width: '100%', position: 'absolute', top: '-30px', right: '25px'}}>
                                            <Button sx={{paddingBottom: 0, paddingLeft: 0}} onClick={ftItems[ftSelectedItem] < 999 ? (e) => handleChange(e, ftSelectedItem, true, ftItems[ftSelectedItem]+1) : null}>
                                                <KeyboardArrowUpIcon/>
                                            </Button>
                                        </Box>
                                        <Box sx={{height: '50%', width: '100%', position: 'absolute', top: '0px', right: '25px'}}>
                                            <Button sx={{paddingTop: 0, paddingLeft: 0}} onClick={ftItems[ftSelectedItem] > 0 ?(e) => handleChange(e, ftSelectedItem, true, ftItems[ftSelectedItem]-1) : null}>
                                                <KeyboardArrowDownIcon/>
                                            </Button>
                                        </Box>
                                    </Box>
                                }}
                                value={ftItems[ftSelectedItem] === undefined ? 0 : ftItems[ftSelectedItem]}
                                onChange={(e) => handleChange(e, ftSelectedItem, true, isNaN(parseInt(e.target.value))? 0 : parseInt(e.target.value))}
                                customInput={TextField} 
                                size='small' 
                                isAllowed={(values) => {
                                    const {floatValue} = values
                                    return (floatValue <= 999 || floatValue === undefined)
                                }}
                                allowNegative={false} 
                                decimalScale={0}
                            />
                            <Button sx={{width: '20%'}} onClick={(e) => handleChange(e, ftSelectedItem, false)}>
                                Remove
                            </Button>
                            </>
                        }
                    </Box>
                    }
                </Box>
            </Fade>
        </Modal>
    )
}