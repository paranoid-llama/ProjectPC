import {Box, Typography, Tabs, Tab} from '@mui/material'
import IndividualRateSelection from './individualrateselection'
import { useState } from 'react'

export default function RateSelection({rateData, items, handleChange, collectionGen}) {
    const [offerType, setOfferType] = useState('pokemon')
    const changeOfferType = () => {
        setOfferType(offerType === 'pokemon' ? 'item' : 'pokemon')
    }

    const handleRateChange = (rateIdx, creatingNew, person, itemValue, removing=false) => {
        const newRateData = [...rateData[rateOfferPath]]
        const newItem = itemValue !== undefined && itemValue.props.value
        const updatingQuantity = !isNaN(parseInt(newItem))
        if (creatingNew) {
            newRateData[rateIdx] = {items: ['', ''], rate: [1, 1]}
            if (newRateData.length < 8) {
                newRateData[rateIdx+1] = {add: true}
            }
        } else if (removing) {
            const finalRateData = newRateData.filter((rate, idx) => idx !== rateIdx)
            if ((finalRateData.filter(rate => rate.add === undefined)).length === 7) {
                finalRateData.push({add: true})
            }
            handleChange(offerType, finalRateData)
            return
        } else if (updatingQuantity) {
            const userRate = person === 'user' ? newItem : newRateData[rateIdx].rate[0]
            const traderRate = person === 'trader' ? newItem : newRateData[rateIdx].rate[1]
            newRateData[rateIdx] = {...newRateData[rateIdx], rate: [userRate, traderRate]}
        } else {
            const userItem = person === 'user' ? newItem : newRateData[rateIdx].items[0]
            const traderItem = person === 'trader' ? newItem : newRateData[rateIdx].items[1]
            newRateData[rateIdx] = {...newRateData[rateIdx], items: [userItem, traderItem]}
        }
        handleChange(offerType, newRateData)
    }

    const rateOfferPath = offerType === 'pokemon' ? 'pokemonOffers' : 'itemOffers'

    const firstColumn = rateData[rateOfferPath].map((rate, idx) => {return {...rate, rateIdx: idx}}).filter((rate, idx) => idx % 2  === 0)
    const secondColumn = rateData[rateOfferPath].map((rate, idx) => {return {...rate, rateIdx: idx}}).filter((rate, idx) => idx % 2 === 1)
    const possibleUserItems = ['On-Hand HA Aprimon', 'HA Aprimon', 'On-Hand Non-HA Aprimon', 'Non-HA Aprimon']
    const possibleTraderPokemonItems = ['HA Aprimon', 'Non-HA Aprimon', 'Wishlist Aprimon']

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
            <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 1}}>Rates</Typography>
            <Typography sx={{fontSize: '12px'}}>Select your exchange rates for trades. Up to 8 per type. All offers are organized as (You:Potential Trader)</Typography>
            <Tabs value={offerType} onChange={changeOfferType}>
                <Tab value='pokemon' label='Pokemon Offers'/>
                <Tab value='item' label='Item Offers' disabled={collectionGen === 'home'}/>
            </Tabs>
            <Box sx={{width: '90%', height: '65%', display: 'flex', flexDirection: 'row', mt: 1}}>
                <Box sx={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
                    {firstColumn.map((rate, idx) => {
                        return (
                            <IndividualRateSelection 
                                key={`${offerType}-rate-${rate.rateIdx}-edit`}
                                rate={rate}
                                rateIdx={rate.rateIdx}
                                possibleItems1={possibleUserItems}
                                possibleItems2={offerType === 'pokemon' ? possibleTraderPokemonItems : items}
                                handleChange={handleRateChange}
                                isOriginalOnHandRate={rate.rateIdx === 0 && offerType === 'pokemon'}
                            />
                        )
                    })}
                </Box>
                <Box sx={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
                    {secondColumn.map((rate, idx) => {
                        return (
                            <IndividualRateSelection 
                                key={`${offerType}-rate-${rate.rateIdx}-edit`}
                                rate={rate}
                                rateIdx={rate.rateIdx}
                                possibleItems1={possibleUserItems}
                                possibleItems2={offerType === 'pokemon' ? possibleTraderPokemonItems : items}
                                handleChange={handleRateChange}
                                isOriginalOnHandRate={rate.rateIdx === 0 && offerType === 'pokemon'}
                            />
                        )
                    })}
                </Box>
            </Box>
        </Box>
    )
}