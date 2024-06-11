import {Box, Typography, Tabs, Tab} from '@mui/material'
import { useState } from 'react'

export default function RateDisplay({rates, owner, collectionGen}) {
    const [offerType, setOfferType] = useState('pokemonOffers')
    const changeOfferType = (newVal) => {setOfferType(newVal)}

    const noRates = rates[offerType].length === 0
    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Box sx={{width: '100%', height: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant='h6' sx={{fontSize: '18px', fontWeight: 700}}>Rates</Typography>
                <Typography sx={{fontSize: '12px', marginLeft: 2, fontWeight: 700}}>({owner} : You)</Typography>
            </Box>
            <Tabs value={offerType} onChange={(e, newVal) => changeOfferType(newVal)} sx={{'&.MuiTabs-root': {height: '20px', minHeight: '12px', my: 1}, '& .MuiTab-root': {py: 0, minHeight: '12px'}}}>
                <Tab label='Pokemon Offers' value='pokemonOffers'/>
                <Tab label='Item Offers' value='itemOffers' disabled={collectionGen === 'home'}/>
            </Tabs>
            <Box sx={{width: '90%', px: '2%', height: '70%', display: 'flex', flexDirection: 'column', justifyContent: noRates ? 'center' : 'start', alignItems: 'center', maxWidth: '500px', backgroundColor: 'rgba(240, 240, 240, 0.9)', boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'}}>
                {noRates && <Typography>No {offerType === 'pokemonOffers' ? 'Pokemon' : 'Item'} Rates</Typography>}
                {rates[offerType].map((rate, idx) => {
                    const height = `${100/8}%`
                    const borderBottom = idx !== rates[offerType].length-1 ? {borderBottom: '1px solid rgba(0, 0, 0, 0.5)'} : {}
                    return (
                        <Box sx={{height, display: 'flex', width: '100%'}} key={`${offerType}-rate-display-${idx+1}`}>
                            <Typography sx={{height: '100%', width: '45%', fontSize: '12px', textAlign: 'center', ...borderBottom}}>
                                {rate.items[0]} 
                            </Typography>
                            <Typography sx={{height: '100%', width: '5%', fontSize: '12px', textAlign: 'center', ...borderBottom}}>
                                : 
                            </Typography>
                            <Typography sx={{height: '100%', width: '30%', fontSize: '12px', textAlign: 'center', ...borderBottom}}>
                                {rate.items[1]}
                            </Typography>
                            <Typography sx={{height: '100%', width: '20%', fontSize: '14px', textAlign: 'end', fontWeight: 700, ...borderBottom}}>
                                {rate.rate[0]} : {rate.rate[1]}
                            </Typography>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}