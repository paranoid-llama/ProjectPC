import {Box, Typography, ToggleButton, Button, Grid, Tooltip, ClickAwayListener, useTheme} from '@mui/material'
import { useState } from 'react'
import getMoveStyles from '../../../../utils/functions/eggmoves/getmovestyles'

export default function EMIndicator({sx, textOnly, isEditMode, emCount, EMs, handleChange, smallWidth}) {
    const theme = useTheme()
    const [emsOpen, setEmsOpen] = useState(false)
    const disabledButton = !textOnly && !isEditMode
    const offset = smallWidth ? {} : !textOnly ? {right: '-2px'} : {}

    const renderEmTooltip = () => {
        const renderedEms = EMs.slice(0, emCount)
        if (emCount > EMs.length) {
            const noInfoCount = emCount - EMs.length
            for (let i=0;i < noInfoCount;i++) {
                renderedEms.push('none')
            }
        }
        return (
            <Grid container sx={{...theme.components.box.fullCenterRow, justifyContent: 'start'}}>
                {renderedEms.map((rEm, idx)=> {
                    const moveStyles = rEm === 'none' ? {backgroundColor: 'dark grey', color: 'white'} : getMoveStyles(rEm)
                    return (
                        <Grid item xs={6} key={`egg-move-${rEm}-${idx+1}`}>
                            <Box sx={{...theme.components.box.fullCenterCol, ...moveStyles, width: '95%', height: '95%', borderRadius: '10px'}}>
                                <Typography sx={{width: '100%', textAlign: 'center', fontSize: '12px'}}>
                                    {rEm === 'none' ? <i>No Info</i> : rEm}
                                </Typography>
                            </Box>
                        </Grid>
                    )
                })}

            </Grid>
        )
    }

    if (textOnly) {
        return (
            <Typography 
                sx={{
                    position: 'absolute', 
                    ':hover': {cursor: 'pointer'},
                    bottom: '0px', 
                    width: '100%',
                    color: 'white', 
                    fontSize: '14px', 
                    opacity: emCount === 0 ? 0.5 : 1, 
                    fontWeight: emCount === 0 ? 400 : 700,
                    ...sx
                }}
                // onClick={() => setEmsOpen(true)}
            >
                {emCount}EM
            </Typography>
        )
    } else {
        if (isEditMode) {
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
        } else {
            return (
                <ClickAwayListener onClickAway={() => setEmsOpen(false)}>
                    <Tooltip
                        PopperProps={{
                            disablePortal: true,
                            sx: {width: '300px'}
                        }}
                        arrow
                        onClose={() => setEmsOpen(false)}
                        open={emsOpen}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={renderEmTooltip()}
                    >
                        <ToggleButton
                            sx={{
                                position: 'absolute',
                                zIndex: 1,
                                color: 'white',
                                bottom: '-2px',
                                borderLeftColor: '2px',
                                backgroundColor: 'none',
                                border: 'none',
                                '& .MuiButtonBase-root': {width: '100%'},
                                ...offset,
                                margin: 0,
                                padding: '2px',
                                width: '100%',
                                fontWeight: emCount >  0 ? 700 : 400,
                                opacity: emCount > 0 ? 1 : 0.5,
                                ...sx
                            }}
                            value={''}
                            onClick={emCount !== 0 ? () => setEmsOpen(true) : null}
                        >
                            {emCount}EM
                        </ToggleButton>
                    </Tooltip>
                </ClickAwayListener>
            )
        }
    }
}