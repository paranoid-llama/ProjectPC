import {Box, Typography, Button, Select, MenuItem, Paper, styled} from '@mui/material'
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

export default function IndividualRateSelection({rate, rateIdx, possibleItems1, possibleItems2, handleChange, isOriginalOnHandRate, divideFactor=4}) {

    const RateItem = styled(Paper)(() => ({
        backgroundColor:'#222222',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        padding: '8px',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial'
    }));

    const generateOptions = (person) => {
        const itemsArr = person === 'user' ? possibleItems1 : possibleItems2
        return itemsArr.map((item, idx) => {
            return (
                <MenuItem 
                    key={`rate-${rateIdx+1}-${person}-option-${idx+1}`}
                    value={item}
                >
                    {item}
                </MenuItem>
            )
        })
    }

    const generateNumberRanges = (person) => {
        return Array.from(Array(15).keys()).map(i => {
            return (
                <MenuItem
                    key={`rate-${rateIdx+1}-${person}-option-num-${i+1}`}
                    value={i+1}
                >
                    {i+1}
                </MenuItem>
            )
        })
    }

    const generateNumberSelects = () => {
        return (
            <>
                <Select
                    sx={{'& .MuiSelect-select': {paddingY: 0, color: 'white'}}}
                    value={rate.rate[0]}
                    onChange={(e, newVal) => handleChange(rateIdx, false, 'user', newVal)}
                >
                    {generateNumberRanges('user')}
                </Select>
                <Typography sx={{fontSize: '12px', mx: 3}}>:</Typography>
                <Select
                    sx={{'& .MuiSelect-select': {paddingY: 0, color: 'white'}}}
                    value={rate.rate[1]}
                    onChange={(e, newVal) => handleChange(rateIdx, false, 'trader', newVal)}
                >
                    {generateNumberRanges('user')}
                </Select>
            </>
        )
    }

    return (
        <Box sx={{width: '100%', height: `${100/divideFactor}%`, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {rate.add === undefined &&
            <RateItem sx={{padding: 0.5, width: '90%', position: 'relative'}}>
                {/* {!isOriginalOnHandRate && */}
                <Button sx={{position: 'absolute', top: '50%', right: '0px', padding: 0, borderRadius: '50%'}} onClick={(e) => handleChange(rateIdx, false, undefined, undefined, true)}>
                    <CancelTwoToneIcon/>
                </Button>
                {/* } */}
                <Box sx={{width: '100%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {/* {isOriginalOnHandRate ? //the rate of onhandpokemon : pokemon. is required
                        <Typography sx={{fontSize: '14px'}}>
                            On Hand HA Aprimon : HA Aprimon
                        </Typography> : */}
                    {/* removed original onhand rate stuff. no longer needed to be required. */}
                        <>
                        <Select 
                            sx={{'& .MuiSelect-select': {paddingY: 0, color: 'white', fontSize: '12px'}, '&.MuiInputBase-root': {width: '45%'}}}
                            value={rate.items[0]}
                            onChange={(e, newVal) => handleChange(rateIdx, false, 'user', newVal)}
                        >
                            {generateOptions('user')}
                        </Select>
                        <Typography sx={{fontSize: '12px', mx: 1}}>:</Typography>
                        <Select 
                            sx={{'& .MuiSelect-select': {paddingY: 0, color: 'white', fontSize: '12px'}, '&.MuiInputBase-root': {width: '45%'}}}
                            value={rate.items[1]}
                            onChange={(e, newVal) => handleChange(rateIdx, false, 'trader', newVal)}
                        >
                            {generateOptions('trader')}
                        </Select>
                        </>
                    {/* } */}
                    
                </Box>
                <Box sx={{width: '100%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {generateNumberSelects()}
                </Box>
            </RateItem>
            }
            {rate.add !== undefined && 
            <Button onClick={(e) => handleChange(rateIdx, true)}>
                Add Rate
            </Button>
            }
        </Box>
    )
}