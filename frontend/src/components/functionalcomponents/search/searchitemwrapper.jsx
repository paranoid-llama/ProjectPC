import {Box, Button, useTheme} from '@mui/material'
import hexToRgba from 'hex-to-rgba'

export default function SearchItemWrapper({children, onClickFunc, customColor, customStyles, useOpacityHover=false}) {
    const theme = useTheme()

    const hoverMain = useOpacityHover ? {opacity: 0.75} : {backgroundColor: hexToRgba(theme.palette.color1.light, 0.1)}

    const wrapperStyles = {
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        width: '100%',
        height: '50px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '5px',
        ...customColor,
        ...customStyles
    }

    const hoverStyles = {
        ':hover': {
            boxShadow: '0px 5px 4px -4px rgba(0,0,0,0.2), 0px 5px 5px 0px rgba(0,0,0,0.14), 0px 5px 7px 0px rgba(0,0,0,0.12)',
            ...hoverMain,
            cursor: 'pointer'
        }
    }

    return (
        <Box sx={{...wrapperStyles, ...hoverStyles}} onClick={onClickFunc}>
            {/* <Button sx={{textTransform: 'none', width: '100%', height: '100%', padding: 0}}> */}
            {children}
            {/* </Button> */}
        </Box>
    )
}