import {Box, Button, Typography} from '@mui/material'
import Header from '../../../titlecomponents/subcomponents/header'

export default function ImportSelection({handleChange, cssClass}) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2}} className={cssClass}>
            <Header additionalStyles={{color: 'black'}}>Import Collection</Header>
            <Box sx={{mt: 5}}><Button size='large' sx={{fontSize: '20px'}}>Import Collection from Google Sheets</Button></Box>
            <Box sx={{margin: 5}}><Typography sx={{fontSize: '16px'}}>or</Typography></Box>
            <Box><Button size='large' sx={{fontSize: '20px'}}>Start from Scratch</Button></Box>
        </Box>
    )
}