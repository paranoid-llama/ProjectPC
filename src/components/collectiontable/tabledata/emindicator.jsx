import {Typography, ToggleButton} from '@mui/material'

export default function EMIndicator({sx, textOnly, isEditMode, emCount, handleChange}) {
    const disabledButton = !textOnly && !isEditMode
    const offset = !textOnly ? {right: '-2px'} : {}
    if (textOnly) {
        return (
            <Typography 
                sx={{
                    position: 'absolute', 
                    bottom: '0px', 
                    width: '100%',
                    color: 'white', 
                    fontSize: '14px', 
                    opacity: emCount === 0 ? 0.5 : 1, 
                    fontWeight: emCount === 0 ? 400 : 700,
                    ...sx
                }}
            >
                {emCount}EM
            </Typography>
        )
    } else {
        return (
            <ToggleButton
                sx={{
                    position: 'absolute',
                    zIndex: 1,
                    color: 'white',
                    bottom: '-2px',
                    backgroundColor: 'none',
                    border: 'none',
                    ...offset,
                    margin: 0,
                    padding: '2px',
                    width: '100%',
                    fontWeight: emCount >  0 ? 700 : 400,
                    opacity: emCount > 0 ? 1 : 0.5,
                    '&.Mui-disabled': {
                        border: 'none',
                        color: 'white',
                        fontWeight: emCount >  0 ? 700 : 400,
                        opacity: emCount > 0 ? 1 : 0.5
                    },
                    ...sx
                }}
                onChange={isEditMode ? (e) => handleChange(e) : null}
                value={emCount}
                disabled={disabledButton}
            >
                {emCount}EM
            </ToggleButton>
        )
    }
}