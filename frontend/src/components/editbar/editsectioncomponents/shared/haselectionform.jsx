import {Box, FormLabel, ToggleButtonGroup, styled} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'

export default function HASelectionForm({noHA=false, isHA, handleChange, disabled=false, width='15%', otherStyles={}, selectColor='#4d4d4d', buttonSizes='large', color='black'}) {

    const ToggleButton = styled(MuiToggleButton)({
        '&.Mui-selected, &.Mui-selected:hover': {
            color: 'white',
            backgroundColor: selectColor
        }
    })

    const disabledStyle = disabled ? {opacity: 0.5} : {}

    const renderToggleGroup = (noHA) => {
        return (
            noHA === false ? 
            <ToggleButtonGroup
                exclusive
                value={disabled ? 'none' : isHA}
                sx={{width: '100%', height: '100%', justifyContent: 'center'}}
                onChange={disabled ? undefined : (e) => handleChange(e)}
            >
                <ToggleButton value={true} sx={{fontSize: '10px', color, ...otherStyles}} size={buttonSizes}>HA</ToggleButton>
                <ToggleButton value={false} sx={{fontSize: '10px', color, ...otherStyles}} size={buttonSizes}>Non-HA</ToggleButton>
            </ToggleButtonGroup> :
            <ToggleButtonGroup value='nonHA' sx={{width: '100%', height: '100%', justifyContent: 'center', color}} onChange={undefined}>
                <ToggleButton value='nonHA' size='small'>Non-HA</ToggleButton>
            </ToggleButtonGroup>
        )
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', width, height: '100%', marginLeft: '5px', ...disabledStyle}}>
            <Box sx={{height: '30%', width: '100%', textAlign: 'center'}}>
                <FormLabel sx={{color, fontSize: '15px', ...otherStyles}}>Ability</FormLabel>
            </Box>
            <Box sx={{height: '70%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Box sx={{height: '90%', width: '100%'}}>
                    {renderToggleGroup(noHA)}
                </Box>
            </Box>
        </Box>
    )
}