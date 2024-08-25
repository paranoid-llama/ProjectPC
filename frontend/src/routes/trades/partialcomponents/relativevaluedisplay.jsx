import {Box, Typography, useTheme, Tooltip, Button} from '@mui/material'
import { useRouteLoaderData } from 'react-router';
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import HelpIcon from '@mui/icons-material/Help';
import { valueDefaults } from '../../../../common/infoconstants/miscconstants.mjs'
import { getValue } from '../../../../utils/functions/comparecollections/getvalue'
import { selectRelativeValue } from '../../../app/selectors/tradeselectors'

export default function RelativeValueDisplay({proposedValues, traderName, ownerName, isCounteroffer, handleProposedValueChange, originalTradeRecipientName, receivedValueFrom}) {
    const theme = useTheme()
    const userData = useRouteLoaderData("root").user
    const currentValue = useSelector((state) => selectRelativeValue(state, proposedValues))
    const canChangeRateUsage = isCounteroffer && (traderName === originalTradeRecipientName)

    return (
        <Box sx={{...theme.components.box.fullCenterCol, mt: 1}}>
            <Box sx={{...theme.components.box.fullCenterRow, gap: 2}}>
                <Typography>Offer Value: {currentValue.offer}</Typography>
                <Typography>Receiving Value: {currentValue.receiving}</Typography>
                <Tooltip
                    arrow 
                    title={
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                            This is a calculation of relative value in units of HA Aprimon (1) based on {isCounteroffer ? receivedValueFrom : ownerName}'s rates/default rates. 
                            This is not the same as the total number of aprimons you can offer/receive.
                            It's only to give you an idea of the worth of both sides of the trade, 
                            and is not to be used as an objective value.
                        </Typography>
                    }
                >
                    <HelpIcon sx={{color: 'white', fontSize: '18px', ml: -1, ':hover': {cursor: 'pointer'}}}/>
                </Tooltip>
            </Box>
            {canChangeRateUsage &&
            <Box sx={{...theme.components.box.fullCenterRow, gap: 2}}>
                <Typography sx={{fontSize: '12px'}}>Calculated value from {receivedValueFrom === userData.username ? 'your' : `${receivedValueFrom}'s`} rates</Typography>
                <Button variant='contained' sx={{padding: 0, px: 0.5, fontSize: '12px'}} onClick={handleProposedValueChange}>Use other rates</Button>
            </Box>
            }
        </Box>
    )
}