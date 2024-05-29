import {Box} from '@mui/material'

export default function BodyWrapper({children, sx}) {
    return (
        <Box sx={{flexGrow: 1, margin: 5, textAlign: 'center', ...sx}}>
            {children}
        </Box>
    )
}