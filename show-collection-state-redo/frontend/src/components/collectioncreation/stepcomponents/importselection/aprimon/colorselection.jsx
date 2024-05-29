import {Box, Typography, TextField, Tooltip, Button, InputAdornment} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpIcon from '@mui/icons-material/Help';

export default function ColorSelection({totalColors, colors, handleChange, field, height='65%', width='100%', firstColorFieldWidth='223px', includeAdornment=true, otherStyles={}}) {
    const multipleColorsArr = Array.from(Array(totalColors).keys()).filter(num => num !== 0)
    return (
        <Box sx={{width, height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', position: 'relative', ...otherStyles}}>
            <Box sx={{height: '25%', display: 'flex', flexDirection: 'row', justifyContent: 'start', position: 'relative'}}>
                {/* <Typography>Colors:</Typography> */}
                <TextField 
                    inputProps={{sx: {paddingY: '2px'}}}
                    InputProps={{
                        endAdornment: includeAdornment && 
                                    <InputAdornment position="end" sx={{':hover': {cursor: 'pointer'}}}>
                                            <Tooltip sx={{width: '20px'}} title={'Input the hex code of background colors which indicate a ball combo has their HA (if applicable)'} arrow>
                                                <HelpIcon/>
                                            </Tooltip> 
                                        </InputAdornment>
                    }} 
                    InputLabelProps={{sx: {fontSize: '14px', top: '-5px'}}} 
                    value={colors[0]} 
                    size='small' 
                    sx={{width: firstColorFieldWidth}}
                    placeholder={totalColors > 1 ? 'Color 1' : 'Color'}  
                    disabled={otherStyles.opacity === 0.5}
                    onChange={(e) => handleChange(e, field, false, 0)}
                />
                {totalColors === 1 && 
                <Box sx={{position: 'absolute', right: '-50px', top: '3px', ':hover': {cursor: 'pointer'}}}>
                    <Tooltip sx={{width: '16px'}} title='Add Color'>
                        <Button sx={{padding: 0, margin: 0, maxWidth: '16px'}} onClick={(e) => handleChange(e, field, true)} disabled={otherStyles.opacity === 0.5}>
                            <AddCircleOutlineIcon/>
                        </Button>
                    </Tooltip>
                </Box>}
            </Box>
            {multipleColorsArr.length > 0 &&
            <>
                {multipleColorsArr.map((color) => {
                    const actualColorNum = color + 1
                    return (
                        <Box sx={{height: '25%', display: 'flex', flexDirection: 'row', justifyContent: 'start', position: 'relative', mt: '1px'}} key={`color-coded-${field}-import-${actualColorNum}`}>
                            <TextField
                                key={`color-select-${actualColorNum}`}
                                sx={{marginTop: '0.5px', width: firstColorFieldWidth}}
                                inputProps={{sx: {paddingY: '2px'}}} 
                                InputLabelProps={{sx: {fontSize: '14px', top: '-5px'}}}  
                                value={colors[color]} 
                                size='small'
                                placeholder={`Color ${actualColorNum}`} 
                                disabled={otherStyles.opacity === 0.5}
                                onChange={(e) => handleChange(e, field, false, color)}
                            />
                            {(totalColors < 4 && actualColorNum === totalColors) && 
                            <Box sx={{position: 'absolute', right: '-50px', top: '3px', ':hover': {cursor: 'pointer'}}} key={`add-another-color`}>
                                <Tooltip sx={{width: '16px'}} title='Add Color'>
                                    <Button sx={{padding: 0, margin: 0, maxWidth: '16px'}} onClick={(e) => handleChange(e, field, true)} disabled={otherStyles.opacity === 0.5}>
                                        <AddCircleOutlineIcon/>
                                    </Button>
                                </Tooltip>
                            </Box>}
                        </Box>
                    )
                })}
                
            </>}
        </Box>
    )
}