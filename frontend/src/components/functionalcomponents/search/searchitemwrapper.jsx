import {Box, Typography, useTheme} from '@mui/material'

export default function SearchItemWrapper({children}) {

    const wrapperStyles = {
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        width: '100%',
        height: '50px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '5px'
    }

    return (
        <Box sx={wrapperStyles}>
            {children}
        </Box>
    )
}