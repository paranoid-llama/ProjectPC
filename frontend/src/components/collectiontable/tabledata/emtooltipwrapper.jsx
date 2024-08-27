import { ClickAwayListener, Tooltip, useTheme, Grid, Box, Typography } from "@mui/material";
import { useState } from "react";
import getMoveStyles from "../../../../utils/functions/eggmoves/getmovestyles";

export default function EmTooltipWrapper({children, EMs, emCount, popperWidth='300px', open, closeTooltip, hoverTooltipInstead=false}) {
    const theme = useTheme()

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

    if (hoverTooltipInstead) {
        return (
            <Tooltip
                PopperProps={{
                    sx: {width: popperWidth}
                }}
                arrow
                title={renderEmTooltip()}
            >
                {children}
            </Tooltip>
        )
        
    }

    return (
        <ClickAwayListener onClickAway={closeTooltip}>
            <Tooltip
                PopperProps={{
                    disablePortal: true,
                    sx: {width: popperWidth}
                }}
                arrow
                onClose={closeTooltip}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={renderEmTooltip()}
            >
                {children}
            </Tooltip>
        </ClickAwayListener>
    )
}
