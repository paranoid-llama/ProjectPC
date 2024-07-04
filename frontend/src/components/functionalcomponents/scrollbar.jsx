import {Box} from '@mui/material'

export default function ScrollBar({forwardedRef, color, children, style, otherProps}) {
    return (
        <Box 
            {...otherProps}
            ref={forwardedRef}
            sx={{
                ...style,
                '&::-webkit-scrollbar': {
                    width: '0.3em'
                },
                '&::-webkit-scrollbar-track': {
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: color,
                    borderRadius: '5px'   
                },
            }}
        >
            {children}
        </Box>
    )
}