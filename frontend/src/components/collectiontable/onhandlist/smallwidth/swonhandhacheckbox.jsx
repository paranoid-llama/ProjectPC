import {Box, useTheme, Checkbox} from '@mui/material'
import { useDispatch } from 'react-redux'
import { setIsHA } from '../../../../app/slices/collectionstate'

export default function SWOnHandHACheckbox({isHA, isEditMode, idxOfPokemon}) {
    const theme = useTheme()
    const dispatch = useDispatch()

    return (
        <Box sx={{width: '94%', height: '94%', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.dark, borderRadius: '10px', border: '1px solid black'}}>
            <Checkbox 
                sx={{position: 'absolute', right: 'calc(50% - 26.5px)', top: 'calc(50% - 26.5px)', color: 'white', pointerEvents: isEditMode ? 'auto' : 'none'}}
                checked={isHA}
                size='large'
                onChange={isEditMode ? () => dispatch(setIsHA({listType: 'onhand', idx: idxOfPokemon})) : undefined}
            />
        </Box>
    )
}