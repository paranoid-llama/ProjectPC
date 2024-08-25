import {Box, Typography, ToggleButton, Button, Grid, Select, MenuItem, Paper, styled, Tooltip} from '@mui/material'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import HelpIcon from '@mui/icons-material/Help';
import ItemSelectionModal from '../aprimon/itemselectionmodal'
import { useState } from 'react'

export default function TradePreferencesSelection({formData, handleChange, totalItems, collectionGen}) {
    const [itemSelectionModal, setItemSelectionModal] = useState({open: false, tab: 'lf', ftSelectedItem: 'none'})
    const homeCollection = collectionGen === 'home'
    const disabledItemSelectionStyles = homeCollection ? {filter: 'blur(10px)', pointerEvents: 'none'} : {}

    const toggleModal = () => {
        setItemSelectionModal({...itemSelectionModal, open: false})
    }
    const openModal = (e, tab) => {
        setItemSelectionModal({...itemSelectionModal, open: true, tab})
    }
    const changeItemsTab = (e, newVal) => {
        setItemSelectionModal({...itemSelectionModal, tab: newVal})
    }
    const changeFtSelectedItem = (e, newVal) => {
        setItemSelectionModal({...itemSelectionModal, ftSelectedItem: newVal.props.value})
    }

    const handleLfItemsChange = (newItem) => {
        const newLfItems = formData.lfItems.includes(newItem) ? formData.lfItems.filter(item => item !== newItem) : [...formData.lfItems, newItem]
        handleChange('lfItems', newLfItems)
    }
    
    const handleFtItemsChange = (item, changingQty, newQty) => {
        const copyOfFt = {...formData.ftItems}
        if (Object.keys(copyOfFt).includes(item)) {
            if (changingQty) {
                if (newQty <= 999) {
                    copyOfFt[item] = newQty
                }
            }
            else {
                delete copyOfFt[item]
                setItemSelectionModal({...itemSelectionModal, ftSelectedItem: 'none'})
            }
        } else {
            copyOfFt[item] = 0
            setItemSelectionModal({...itemSelectionModal, ftSelectedItem: item})
        }
        handleChange('ftItems', copyOfFt)
    }

    const disabledItemTabStyles = formData.items === 'none' ? {opacity: 0.5, pointerEvents: 'none'} : {}
    const disabledLfItemsStyles = formData.items === 'ft' ? {opacity: 0.5, pointerEvents: 'none'} : {}
    const disabledFtItemsStyles = formData.items === 'lf' ? {opacity: 0.5, pointerEvents: 'none'} : {}

    const ModalButtonItem = styled(Paper)(() => ({
        backgroundColor:'#222222',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        padding: '8px',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial'
    }));

    const onHandOnlyTooltip = 'Indicates whether you want to only offer pokemon that you have on-hand, which are listed separately to everyone'

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 1}}>Trade Preferences</Typography>
            <Typography sx={{fontSize: '12px'}}>Select your preferences for trade offers</Typography>
            <Box sx={{width: '90%', height: '90%', display: 'flex', flexDirection: 'row', mt: 1, position: 'relative'}}>
                <Box sx={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
                    <Typography sx={{fontSize: '14px', fontWeight: 700}}>Trade Status:</Typography>
                    <Box sx={{width: '100%', height: '10%', display: 'flex', justifyContent: 'center', gap: 4}}>
                        <ToggleButton value='open' selected={formData.status === 'open'} onChange={(e, newValue) => handleChange('status', newValue)}>
                            Open
                        </ToggleButton>
                        <ToggleButton value='closed' selected={formData.status === 'closed'} onChange={(e, newValue) => handleChange('status', newValue)}>
                            Closed
                        </ToggleButton>
                    </Box>
                    <Typography sx={{fontSize: '14px', fontWeight: 700, mt: 1}}>Trade Size:</Typography>
                    <Grid container sx={{width: '100%', height: '40%', display: 'flex', justifyContent: 'center'}}>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <ToggleButton sx={{padding: 1, fontSize: '12px'}} value='any' selected={formData.size === 'any'} onChange={(e, newValue) => handleChange('size', newValue)}>
                                Any
                            </ToggleButton>
                        </Grid>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <ToggleButton sx={{padding: 1, fontSize: '12px'}} value='small preferred' selected={formData.size === 'small preferred'} onChange={(e, newValue) => handleChange('size', newValue)}>
                                Small Preferred
                            </ToggleButton>
                        </Grid>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <ToggleButton sx={{padding: 1, fontSize: '12px'}} value='small only' selected={formData.size === 'small only'} onChange={(e, newValue) => handleChange('size', newValue)}>
                                Small Only
                            </ToggleButton>
                        </Grid>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <ToggleButton sx={{padding: 1, fontSize: '12px'}} value='large preferred' selected={formData.size === 'large preferred'} onChange={(e, newValue) => handleChange('size', newValue)}>
                                Large Preferred
                            </ToggleButton>
                        </Grid>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <ToggleButton sx={{padding: 1, fontSize: '12px'}} value='large only' selected={formData.size === 'large only'} onChange={(e, newValue) => handleChange('size', newValue)}>
                                Large Only
                            </ToggleButton>
                        </Grid>
                    </Grid>
                    <Typography sx={{fontSize: '14px', fontWeight: 700, mt: 1, position: 'relative', width: '175px'}}>
                        On-Hand Trades Only:
                        <Tooltip describeChild title={onHandOnlyTooltip} sx={{position: 'absolute', height: '16px', top: '-5px', right: '-10px'}}>
                            <HelpIcon/>
                        </Tooltip>
                    </Typography>
                    <Box sx={{width: '100%', height: '10%', display: 'flex', justifyContent: 'center', gap: 4}}>
                        <ToggleButton value='yes' selected={formData.onhandOnly === 'yes'} onChange={(e, newValue) => handleChange('onhandOnly', newValue)}>
                            Yes
                        </ToggleButton>
                        <ToggleButton value='no' selected={formData.onhandOnly === 'no'} onChange={(e, newValue) => handleChange('onhandOnly', newValue)}>
                            No
                        </ToggleButton>
                        <ToggleButton value='preferred' selected={formData.onhandOnly === 'preferred'} onChange={(e, newValue) => handleChange('onhandOnly', newValue)}>
                            Preferred
                        </ToggleButton>
                    </Box>
                </Box>
                <Box sx={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative'}}>
                {homeCollection && <Typography sx={{position: 'absolute', top: '45%', right: '25%', fontWeight: 700, width: '50%'}}>Item trading disabled for <br></br> HOME Collections</Typography>}
                    <Box sx={{width: '100%', height: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', ...disabledItemSelectionStyles}}>
                        <Typography sx={{fontSize: '14px', fontWeight: 700, mt: 1}}>Item Trading:</Typography>
                        <Select 
                            value={formData.items}
                            onChange={(e, newValue) => handleChange('items', newValue)}
                            sx={{width: '80%', height: '100%', '& .MuiSelect-select': {padding: 0.5}}}
                        >
                            <MenuItem value='none'>Not looking to trade items</MenuItem>
                            <MenuItem value='lf'>I'm looking for items</MenuItem>
                            <MenuItem value='ft'>I have items to offer</MenuItem>
                            <MenuItem value='lf/ft'>I'm looking for items and have items to offer</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{width: '100%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', ...disabledItemTabStyles, ...disabledItemSelectionStyles}}>
                        <Box sx={{width: '100%', height: '80%', mt: 2}}>
                            <Box sx={{height: '50%', weight: '100%',  display: 'flex', flexDirection: 'column', alignItems: 'center', ...disabledLfItemsStyles}}>
                                <Typography sx={{fontSize: '12px', mt: 1}}>Select which items you're looking for</Typography>
                                <Button sx={{padding: 0, margin: 0, textTransform: 'none', mt: 3}} onClick={(e) => openModal(e, 'lf')}>
                                    <ModalButtonItem>
                                        Select LF Items
                                    </ModalButtonItem>
                                </Button>
                            </Box>
                            <Box sx={{height: '50%', weight: '100%',  display: 'flex', flexDirection: 'column', alignItems: 'center', ...disabledFtItemsStyles}}>
                                <Typography sx={{fontSize: '12px', mt: 3}}>Select which items you're offering</Typography>
                                <Button sx={{padding: 0, margin: 0, textTransform: 'none', mt: 3}} onClick={(e) => openModal(e, 'ft')}>
                                    <ModalButtonItem>
                                        Select FT Items
                                    </ModalButtonItem>
                                </Button>
                            </Box>
                            <ItemSelectionModal
                                itemsState={formData.items}
                                lfItems={formData.lfItems}
                                ftItems={formData.ftItems}
                                handleChange={itemSelectionModal.tab === 'lf' ? handleLfItemsChange : handleFtItemsChange}
                                open={itemSelectionModal.open}
                                toggleModal={toggleModal}
                                activeTab={itemSelectionModal.tab}
                                changeTab={changeItemsTab}
                                totalItems={totalItems}
                                ftSelectedItem={itemSelectionModal.ftSelectedItem}
                                changeFtSelectedItem={changeFtSelectedItem}
                            />
                            {/* <Grid container>
                                {renderItems()}
                            </Grid> */}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}