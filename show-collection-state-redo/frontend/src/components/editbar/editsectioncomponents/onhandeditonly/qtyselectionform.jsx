import {Box, Typography, ButtonBase} from '@mui/material'
import ImgData from '../../../collectiontable/tabledata/imgdata'

export default function QtySelectionForm({qty, handleIncrement, handleDecrement, newOnHand=false, width='10%'}) {
    const disabled = qty === 0
    const disabledStyles = disabled ? {opacity: 0.5} : {}
    return (
        <Box sx={{width, height: '100%', marginLeft: '3px', display: 'flex', flexDirection: 'column', alignItems: 'center', ...disabledStyles}}>
            <Box sx={{height: '20%'}}><Typography sx={{fontSize: '13px'}}>Qty</Typography></Box>
            <Box sx={{height: '80%', display: 'flex', width: '100%'}}>
                <ButtonBase sx={{width: '49%'}} onClick={disabled ? undefined : handleDecrement}> 
                    <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end'}}>
                        <Box sx={{height: '40%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'start'}}>
                            <ImgData linkKey='arrowleft' type='gender' size='14px'/>
                        </Box>
                    </Box>
                </ButtonBase>
                <Box sx={{height: '100%', width: '2%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography sx={{fontSize: '18px'}}>{qty}</Typography>
                </Box>
                <ButtonBase sx={{width: '49%'}} onClick={disabled ? undefined : handleIncrement}> 
                    <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end'}}>
                        <Box sx={{height: '40%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'end'}}>
                            <ImgData linkKey='arrowright' type='gender' size='14px'/>
                        </Box>
                    </Box>
                </ButtonBase>
            </Box>
        </Box>
    )
}