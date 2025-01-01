import {Typography, ToggleButton, useTheme} from '@mui/material'

const haTopMediaQuery = {'@media only screen and (min-width: 1201px)': {display: 'none'}}
const haBottomMediaQuery = {'@media only screen and (max-width: 1200px)': {display: 'none'}}

export default function HAIndicator({sx, textOnly, topPosition=false, isEditMode, isHAActive, handleChange, noTopRow, smallWidth}) {
    const mediaQuery = smallWidth ? {} : !noTopRow && (topPosition ? haTopMediaQuery : haBottomMediaQuery)
    const disabledButton = !textOnly && !isEditMode
    const positionStyle = smallWidth ? {} :  topPosition ? {top: textOnly ? '0px' : '-2px'} : {bottom: textOnly ? '0px' : '-2px'}
    const offset = smallWidth ? {} :  !textOnly && !topPosition ? {left: '-2px'} : {}
    if (textOnly) {
        return (
            <Typography 
                sx={{
                    position: 'absolute', 
                    ...positionStyle, 
                    color: 'white', 
                    fontSize: '14px', 
                    width: '100%',
                    opacity: isHAActive ? 1 : 0.5, 
                    fontWeight: isHAActive ? 700 : 400,
                    ...mediaQuery,
                    ...sx
                }}
            >
                HA
            </Typography>
        ) 
    } else {
        return (
            <ToggleButton
                sx={{
                    position: 'absolute',
                    zIndex: 1,
                    border: 'none',
                    color: 'white',
                    backgroundColor: 'none',
                    ...positionStyle,
                    ...offset,
                    width: '100%',
                    margin: 0,
                    padding: '2px',
                    fontWeight: isHAActive ? 700 : 400,
                    opacity: isHAActive ? 1 : 0.5,
                    '&.Mui-disabled': {
                        border: 'none',
                        color: 'white',
                        fontWeight: isHAActive ? 700 : 400,
                        opacity: isHAActive ? 1 : 0.5
                    },
                    ...mediaQuery,
                    ...sx
                }}
                onChange={isEditMode ? (e) => handleChange(e) : null}
                value={isHAActive}
                disabled={disabledButton}
            >
                HA
            </ToggleButton>
        )
    }
}