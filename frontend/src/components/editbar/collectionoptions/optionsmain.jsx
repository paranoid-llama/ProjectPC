import {Box, Typography, Button} from '@mui/material'
import { useDispatch } from 'react-redux'
import { changeModalState } from '../../../app/slices/editmode'
import ArrowForward from '@mui/icons-material/ArrowForward'

export default function OptionsMain({elementBg, sw}) {
    const dispatch = useDispatch()
    return (
        <>
        <Box sx={{...elementBg, width: '95%', height: '35px', display: 'flex', alignItems: 'center'}}>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1}}>Collection Options</Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '92%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 1}}>
            <Box sx={{width: '95%', height: '75%', padding: '5%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center'}}>
                <Button size='large' sx={{color: 'white', fontSize: '24px', fontWeight: 700}} onClick={() => dispatch(changeModalState({screen: 'changeScope'}))}>Change Scope</Button>
                <Button size='large' sx={{color: 'white', fontSize: '24px', fontWeight: 700}} onClick={() => dispatch(changeModalState({screen: 'sorting'}))}>Sorting Options</Button>
                <Button size='large' sx={{color: 'white', fontSize: '24px', fontWeight: 700}} onClick={() => dispatch(changeModalState({screen: 'tradePreferences'}))}>Trade Preferences</Button>
                <Button size='large' sx={{color: 'white', fontSize: '24px', fontWeight: 700}} onClick={() => dispatch(changeModalState({screen: 'other'}))}>Other Options</Button>
            </Box>
        </Box>
        </>
    )
}