import {Box, Typography, ToggleButton, ToggleButtonGroup} from '@mui/material'

export default function MiscSelection({globalDefaultData, handleChange, collectionGen}) {
    const homeCollection = collectionGen === 'home'
    const disabledStyles = homeCollection ? {filter: 'blur(10px)', pointerEvents: 'none'} : {}
    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
            <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 1}}>Set Global Defaults</Typography>
            <Typography sx={{fontSize: '12px'}}>
                Global Defaults affect the state of peripheral data (Hidden Ability, Egg Moves) of a ball combo when you first mark a combo as owned. 
                You can set pokemon-specific defaults later!
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'row', height: '30%', width: '80%', justifyContent: 'center', alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '50%', height: '100%'}}>
                    <Typography sx={{fontSize: '14px', mb: 1, fontWeight: 700}}>Hidden Ability</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <ToggleButtonGroup exclusive value={globalDefaultData.isHA} onChange={(e, newVal) => handleChange('isHA', newVal)}>
                        <ToggleButton sx={{fontSize: '12px'}} value={true}>
                            HA
                        </ToggleButton>
                        <ToggleButton sx={{fontSize: '12px'}} value={false}>
                            Non-HA
                        </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '50%', height: '100%', position: 'relative'}}>
                    {homeCollection && <Typography sx={{position: 'absolute', fontSize: '12px', top: '25%', right: '25%', fontWeight: 700, width: '50%', height: '50%'}}>Egg Moves are disabled in <br></br>HOME collections</Typography>}
                    <Typography sx={{fontSize: '14px', mb: 1, fontWeight: 700, ...disabledStyles}}>Egg Move Count</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', ...disabledStyles}}>
                        {Array.from(Array(5).keys()).map((emCount, idx) => {
                            return (
                                <ToggleButton sx={{fontSize: '12px', mx: 0.5}} value={emCount} selected={globalDefaultData.emCount === emCount} onChange={(e, newVal) => handleChange('emCount', newVal)} key={`global-default-emCount-${emCount}`}>
                                    {emCount}
                                </ToggleButton>
                            )
                        })}
                    </Box>
                    
                </Box>
            </Box>
            <Typography sx={{fontSize: '10px', width: '100%'}}>
                Defaults will account for cases where a pokemon may not have HA/EMs, as well as cases where the max possible EMs may be less than 4.
            </Typography>
        </Box>
    )
}