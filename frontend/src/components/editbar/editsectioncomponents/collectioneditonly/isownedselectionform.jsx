import {useDispatch} from 'react-redux'
import {setIsOwned} from './../../../../app/slices/collection'
import {Box, FormLabel, Checkbox} from '@mui/material'

export default function IsOwnedSelectionForm({isOwned, handleChange, width='10%', checkboxProps={}, formHeight='30%', cbHeight='70%'}) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', width, height: '100%'}}>
            <Box sx={{height: formHeight, width: '100%', textAlign: 'center'}}>
                <FormLabel sx={{color: 'black', fontSize: '13px'}}>Owned</FormLabel>
            </Box>
            <Box sx={{height: cbHeight, width: '100%', textAlign: 'center'}}>
                <Checkbox
                    checked={isOwned}
                    sx={{paddingTop: '7px'}}
                    {...checkboxProps}
                    onClick={(e) => handleChange(e)}
                />
            </Box>
        </Box>
    )
}