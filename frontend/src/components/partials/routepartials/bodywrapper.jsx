import {Box} from '@mui/material'

export default function BodyWrapper({children}) {
    return (
        <Box sx={{flexGrow: 1, margin: 5, textAlign: 'center'}}>
            {children}
        </Box>
    )
}