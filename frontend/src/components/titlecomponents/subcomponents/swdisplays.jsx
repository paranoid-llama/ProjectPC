import {Box, Typography, ToggleButton, ToggleButtonGroup, useTheme} from '@mui/material'
import { useState, useRef } from 'react'
import CollectionProgress from '../collectionprogress'
import RateDisplay from '../ratedisplay'
import ItemDisplay from '../itemdisplay'
import hexToRgba from 'hex-to-rgba'



export default function SWDisplays({display, changeDisplayScreen, ballScopeInit, isEditMode, demo, gen, owner, collectionList, isOwner, userData, tradePreferences}) {
    const theme = useTheme()
    // const className = useRef('')
    const [open, setOpen] = useState('firstRender')

    const toggleArea = () => {
        setOpen((open === 'firstRender' || open === false) ? true : false)
    }
    const closedArea = open === 'firstRender' || open === false
    const className = open === 'firstRender' ? '' : open ? 'add-sw-progress-height' : 'shrink-sw-progress-height'
    const toggleButtonSelectedStyles = {
        '&.Mui-selected': {backgroundColor: theme.palette.color3.dark, color: theme.palette.color3.contrastText},
        '&.Mui-selected:hover': {backgroundColor: hexToRgba(theme.palette.color3.dark, 0.9)},
        ':hover': {backgroundColor: hexToRgba(theme.palette.color2.main, 0.9)}
    }
    return (
        <>
        <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', backgroundColor: theme.palette.color1.main}}>
            <ToggleButton 
                onClick={toggleArea} 
                value={open}
                sx={{fontSize: '16px', width: '100%', height: '100%', py: 1, color: theme.palette.color1.contrastText, '&.Mui-selected': {color: theme.palette.color1.contrastText}}}
            >
                {closedArea ? 'Show' : 'Hide'} Progress/Rates/Items
            </ToggleButton>
        </Box>
        <Box sx={{height: '0px', width: '99%', ...theme.components.box.fullCenterCol, animationFillMode: 'forwards', overflow: 'hidden', border: `1px solid ${theme.palette.color3.dark}`, borderRadius: '10px', backgroundColor: hexToRgba(theme.palette.color1.main, 0.9)}} className={className}>
            <Box sx={{width: '100%', height: '15%', display: 'flex', justifyContent: 'center'}}>
                <ToggleButtonGroup exclusive sx={{mt: 0.5, mb: 0.5, width: '100%', '& .MuiToggleButton-root': {border: '1px solid rgba(40,63,87,1)', color: 'white', backgroundColor: '#272625', height: '100%'}}} size='small' value={display} onChange={(e, newVal) => changeDisplayScreen(newVal)}>
                    <ToggleButton value='ballProgress' sx={{width: '40%', fontSize: '12px', px: 0, ...toggleButtonSelectedStyles}}>Progress</ToggleButton>
                    <ToggleButton value='rates' sx={{width: '30%', fontSize: '12px', ...toggleButtonSelectedStyles}}>Rates</ToggleButton>
                    <ToggleButton value='items' sx={{width: '30%', fontSize: '12px', ...toggleButtonSelectedStyles, '&.Mui-disabled': {color: 'white', opacity: 0.7}}} disabled={tradePreferences.items === 'none'}>Items</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Box sx={{width: '100%', height: '85%', ...theme.components.box.fullCenterCol, color: theme.palette.color1.contrastText}}>
                {display === 'ballProgress' && <CollectionProgress ballScopeInit={ballScopeInit} isEditMode={isEditMode} demo={demo} collectionList={collectionList} isOwner={isOwner} userData={userData} sw={true}/>}
                {display === 'rates' && <RateDisplay rates={tradePreferences.rates} owner={demo ? '' : owner} collectionGen={gen} demo={demo} sw={true} definedAreaStyles={{backgroundColor: hexToRgba(theme.palette.color3.main, 0.3), border: `1px solid ${theme.palette.color3.dark}`, borderRadius: '5px', color: theme.palette.color3.contrastText}}/>}
                {(display === 'items' && gen !== 'home') && <ItemDisplay collectionGen={gen} itemTradeStatus={tradePreferences.items} lfItems={tradePreferences.lfItems} ftItems={tradePreferences.ftItems} sw={true}/>}
            </Box>
        </Box>
        </>
    )
}