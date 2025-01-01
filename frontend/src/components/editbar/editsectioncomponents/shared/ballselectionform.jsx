import {Virtuoso} from 'react-virtuoso'
import {useState, useEffect} from 'react'
import {FormLabel, Box, ToggleButtonGroup, ToggleButton, Typography} from '@mui/material'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import {capitalizeFirstLetter} from '../../../../../utils/functions/misc'
import BallSelection from './ballselection.jsx'

export default function BallSelectionForm({allowedBalls, handleChange, value, width='20%', height='100%', onhandBallSelect=false, customBallStyles, customBallSize}) {
    const labelStyles = onhandBallSelect ? {color: 'white', height: '25%', fontSize: '16px'} : {color: 'black', height: '25%', fontSize: '13px'}
    const disabledDefaults = {allowedBalls: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'], value: 'fast'}
    const disabled = allowedBalls.length === 0
    const disabledStyles = disabled ? {opacity: 0.5} : {}
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', width, height, ...disabledStyles}}>
            <FormLabel sx={labelStyles}>Ball</FormLabel>
            <>
                <BallSelection
                    relativeHeight='50%' 
                    relativeWidth='90%' 
                    allowedBalls={disabled ? disabledDefaults.allowedBalls : allowedBalls} 
                    handleChange={disabled ? undefined : handleChange} 
                    value={disabled ? disabledDefaults.value : value}
                    customBallSize={customBallSize}
                    customBallStyles={customBallStyles}
                />
                <Typography sx={{fontSize: '15px'}}>{capitalizeFirstLetter(disabled ? disabledDefaults.value : value)}</Typography>
            </>
        </Box>
    )
}