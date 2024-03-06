import modalStyles from './../../../../../../utils/styles/componentstyles/modalstyles'
import {Box, Typography} from '@mui/material'

export default function Header({label, height='7%'}) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height}}>
            <Box sx={{...modalStyles.onhand.modalElementBg, border: '1px solid black'}}>
                <Typography sx={modalStyles.onhand.modalTitle}>
                    {label}
                </Typography>
            </Box>
        </Box>
    )
}