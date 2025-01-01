import {Box, FormLabel, ToggleButtonGroup, styled, Grid, Typography} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import RenderEggMoves from './rendereggmoves'

export default function EggMoveSelectionForm({noEMs, EMs, emCount, handleEmCountChange, toggleScreen, maxEms=4, idxOfSelectedEM, handleEMChange, disabled, width='40%', height='100%', color='black', newOnHandSelect=false, noInfoBgColor, isHomeCollection, otherEmTextStyles={}}) {

    const disabledStyle = disabled ? {opacity: 0.5} : {}

    const ToggleButton = styled(MuiToggleButton)({
        '&.Mui-selected, &.Mui-selected:hover': {
            color: 'white',
            backgroundColor: newOnHandSelect ? '#283f57' : '#4d4d4d'
        }
    })

    return (
        <Box sx={{display: 'flex', flexDirection: noEMs === true ? 'column' : 'row', justifyContent: 'start', alignItems: 'center', width, height, marginLeft: '5px', ...disabledStyle}}>
            {noEMs === true ? 
            <>
                <Box sx={{height: '30%', width: '100%'}}>
                    <Typography align='center' sx={{color, fontSize: '13px'}}>Egg Moves</Typography>
                </Box> 
                <Box sx={{height: '70%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography align='center' sx={{color, fontSize: isHomeCollection ? '11px' : '13px', opacity: 0.8}}>{isHomeCollection ? 'Disabled in HOME collections' : 'Egg Moves Unavailable'}</Typography>
                </Box>
            </> :
            <>
                <Box sx={{height: '100%', width: '35%', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                    <FormLabel sx={{height: '30%', color, fontSize: '12px', marginTop: '3px'}}>Egg Moves</FormLabel>
                    <Box sx={{height: '70%', width: '100%', display: 'flex', alignItems: 'center'}}>
                        <ToggleButtonGroup
                            sx={{height: '80%', width: '100%', display: 'flex', justifyContent: 'center'}}
                            value={emCount === 0 || disabled ? 'disable' : emCount}
                            size='small'
                            onChange={disabled ? undefined : (e) => handleEmCountChange(e)}
                            exclusive
                        >
                            <ToggleButton
                                sx={{color}}
                                value={emCount}
                            >
                                {disabled ? '0' : emCount}EM
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>
                <Box sx={{height: '100%', width: '65%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <RenderEggMoves 
                        emCount={emCount} 
                        EMs={EMs} 
                        maxEms={maxEms} 
                        idxOfSelectedEM={idxOfSelectedEM} 
                        toggleScreen={toggleScreen} 
                        handleEMChange={handleEMChange} 
                        disabledSelection={disabled} 
                        noInfoBgColor={noInfoBgColor}
                        otherEmTextStyles={otherEmTextStyles}
                        // {...swRenderEMTooltipInfo}
                    />
                </Box>
            </>
            }
        </Box>
    )
}