import {useDispatch} from 'react-redux'
import {setIsOwned} from './../../../../app/slices/collection'
import {Box, FormLabel, Checkbox} from '@mui/material'

export default function IsOwnedSelectionForm({isOwned, handleChange}) {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', width: '10%', height: '100%'}}>
            <Box sx={{height: '30%', width: '100%', textAlign: 'center'}}>
                <FormLabel sx={{color: 'black', fontSize: '13px'}}>Owned</FormLabel>
            </Box>
            <Box sx={{height: '70%', width: '100%', textAlign: 'center'}}>
                <Checkbox
                    checked={isOwned}
                    sx={{paddingTop: '7px'}}
                    onClick={(e) => handleChange(e)}
                />
            </Box>
        </Box>
    )
}