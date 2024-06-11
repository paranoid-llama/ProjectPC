import {Box, Typography, useTheme} from '@mui/material'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import { useRouteLoaderData } from 'react-router'
import hexToRgba from 'hex-to-rgba'
import { useState } from 'react'

export default function NewTrade({}) {
    const theme = useTheme()
    const targetColData = useRouteLoaderData('showCollection')
    const targetColDisplay = isNaN(parseInt(targetColData.gen)) ? `${targetColData.gen.toUpperCase()} Aprimon Collection` : `Gen ${targetColData.gen} Aprimon Collection`

    const [tradeData, setTradeData] = useState({displaySteps: {1: false, 2: false, 3: false}, compareWith: '', comparison})

    const stepButtonStyles = {
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: hexToRgba(theme.palette.color1.dark, 0.5),
            borderRadius: '10px'
        }
    }

    return (
        <BodyWrapper sx={{mt: 3, mx: 1, ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '1200px', width: '100%', height: '100%'}}>
                <Typography variant='h1' sx={{fontWeight: 700, width: '100%', fontSize: '36px', mb: 1}}>New Trade</Typography>
                <Box sx={{border: `1px solid ${theme.palette.color2.light}`, borderRadius: '10px', backgroundColor: hexToRgba(theme.palette.color2.light, 0.3), width: '75%', height: '50px', ...theme.components.box.fullCenterCol, mb: 3}}>
                    <Typography><b>Trading with:</b> {targetColData.owner.username}'s {targetColDisplay}</Typography>
                </Box>
                <Box sx={{border: `1px solid ${theme.palette.color3.dark}`, borderRadius: '10px', backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), width: '100%', height: '150px', ...theme.components.box.fullCenterCol, mb: 3, color: 'white'}}>
                    <Box sx={{width: '100%', borderBottom: `1px solid ${theme.palette.color3.dark}`, minHeight: '49px', alignItems: 'start', ...stepButtonStyles}}>
                        <Typography sx={{fontWeight: 700, ml: 3, height: '49px', display: 'flex', alignItems: 'center'}}>1. Select and Compare Collections</Typography>
                    </Box>
                    <Box sx={{width: '100%', borderBottom: `1px solid ${theme.palette.color3.dark}`, minHeight: '49px', alignItems: 'start', ...stepButtonStyles}}>
                        <Typography sx={{fontWeight: 700, ml: 3, height: '49px', display: 'flex', alignItems: 'center'}}>2. Set Offer/Receiving</Typography>
                    </Box>
                    <Box sx={{width: '100%', minHeight: '50px', alignItems: 'start', ...stepButtonStyles}}>
                        <Typography sx={{fontWeight: 700, ml: 3, height: '50px', display: 'flex', alignItems: 'center'}}>3. Finalize Trade</Typography>
                    </Box>
                </Box>
            </Box>
        </BodyWrapper>
    )
}