import {Box, Typography, ToggleButton, IconButton} from '@mui/material'
import ImgData from './../../../collectiontable/tabledata/imgdata'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'

export default function GenderSelectionForm({width='15%', gender, possibleGenders, handleChange, newOnHand=false}) {
    const oneGenderOnly = possibleGenders === 'male' || possibleGenders === 'female'
    const genderless = possibleGenders === 'none'
    const unknown = gender === 'unknown'
    const disabled = gender === undefined
    return (
        <Box sx={{width, display: 'flex', flexDirection: 'column', justifyContent: disabled ? 'center' : 'start', alignItems: 'center'}}>
            { !disabled &&
            <>
            <Typography sx={{fontSize: '13px', height: '25%'}}>Gender</Typography>
            {oneGenderOnly ? 
            <Box sx={{height: '50%'}}>
                <ImgData type='gender' linkKey={gender}/>
            </Box> : 
            genderless ? 
            <Box sx={{marginTop: '3px', height: '60%', display: 'flex', alignItems: 'center'}}>
                <Typography sx={{fontSize: newOnHand ? '16px' : '11px'}}>
                    Genderless
                </Typography>
            </Box>:
            unknown ? 
            <Box sx={{marginTop: '3px', height: '60%', display: 'flex', alignItems: 'center', padding: 0.5, borderRadius: '50%', ':hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)', cursor: 'pointer'}}} onClick={handleChange}>
                <Typography sx={{fontSize: newOnHand ? '16px' : '11px'}}>
                    <i>Unknown</i>
                </Typography>
            </Box> : 
            <IconButton onClick={handleChange}>
                <ImgData type='gender' linkKey={gender}/>
            </IconButton>}
            {oneGenderOnly && 
            <Box sx={{height: '25%'}}><Typography sx={{fontSize: newOnHand ? '8px' : '12px', color: newOnHand ? '#cfcfcf' : '#363636'}}>({capitalizeFirstLetter(possibleGenders)} Only)</Typography></Box>
            } </>}
            {disabled && <Typography sx={{fontSize: '13px', opacity: 0.5}}>Gender</Typography>}
        </Box>
    )
}