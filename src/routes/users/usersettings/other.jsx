import {Box, useTheme, Typography} from '@mui/material'

export default function Other({}) {
    const theme = useTheme()

    return (
        <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '100%', margin: 2, position: 'relative'}}>
            <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', width: '100%'}}>
                <Typography sx={{color: 'grey', fontSize: '24px'}}><i>No settings</i></Typography>
            </Box>
        </Box>
    )
}