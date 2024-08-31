import {Box, Typography, useTheme, Tabs, Tab, Button} from '@mui/material'
import { useState, useEffect, useRef, memo } from 'react'
import { tradePreferenceDisplay } from '../../../../common/infoconstants/miscconstants.mjs'
import hexToRgba from 'hex-to-rgba'
import RateDisplay from '../../../components/titlecomponents/ratedisplay'
import RelativeValueDisplay from '../partialcomponents/relativevaluedisplay'
import SetPokemon from '../../../components/functionalcomponents/tradeoffer/setpokemon'
import SetItems from '../../../components/functionalcomponents/tradeoffer/setitems'
import { getWantedData } from '../../../../utils/functions/comparecollections/getwantedorfordata'

function SetOfferReceivingFunc({comparisonData, selectedColData, ownerColData, originalTradeRecipientName, isCounteroffer, handleProposedValueChange, proposedValues, receivedValueFrom}) {
    const theme = useTheme()
    const tradePreferences = ownerColData.options.tradePreferences
    const userTradePreferences = selectedColData.options.tradePreferences
    const tradePreferenceSizeMessage = tradePreferences.size === 'any' ? 'accepts any size trade' : 
        tradePreferences.size === 'large only' ? 'only accepts large trades' : tradePreferences.size === 'large preferred' ? 'prefers large trades' : 
        tradePreferences.size === 'small only' ? 'only accepts small trades' : 'prefers small trades'
    const tradePreferenceOnhandMessage = tradePreferences.onhandOnly === 'no' ? 'is trading from any list' : tradePreferences.onhandOnly === 'preferred' ? 'prefers trading from their on-hand' : 'is only trading from their on-hand'
    const tradePreferencesMessage = `${ownerColData.owner.username} ${tradePreferenceSizeMessage} and ${tradePreferenceOnhandMessage}`
    const hasComparisonData = Object.keys(comparisonData).length !== 0 && (comparisonData.comparedWith === selectedColData._id)
    const noComparisonData = !hasComparisonData
    const oneHomeCollection = selectedColData.gen === 'home' || ownerColData.gen === 'home'
    const [offerData, setOfferData] = useState({userRate: false, ownerRate: false, display: 'offer', view: noComparisonData ? undefined : 'comparison', onhandView: 'byIndividual', allowItemTrading: false, allowUserOffer: false, allowOwnerOffer: false})

    const selectedColDataRef = useRef(selectedColData._id)
    // const comparisonDataRef

    const allowItemTradeType = (type) => {
        const dataKey = type === 'item' ? 'allowItemTrading' : type === 'userOffer' ? 'allowUserOffer' : 'allowOwnerOffer'
        setOfferData({...offerData, [dataKey]: true})
    }

    const toggleRateDisplay = (type) => {
        const otherType = type === 'user' ? 'owner' : 'user'
        const changeOtherType = offerData[`${type}Rate`] === false && offerData[`${otherType}Rate`] === true ? {[`${otherType}Rate`]: false} : {}
        setOfferData({...offerData, [`${type}Rate`]: !offerData[`${type}Rate`], ...changeOtherType})
    }
    const rateDisplayStyles = {
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: hexToRgba(theme.palette.color1.dark, 0.5),
            borderRadius: '5px'
        }
    }

    const tabStyles = {
        '& .MuiButtonBase-root': {
            color: 'white',
            fontWeight: 700,
        },
        '& .MuiTab-root.Mui-selected': {
            color: theme.palette.color3.main
        },
        '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.color3.main
        },
        '& .MuiTabs-flexContainer': theme.components.box.fullCenterRow
    }

    useEffect(() => {
        if (hasComparisonData === true) {
            setOfferData({...offerData, view: 'comparison'})
        } else if (noComparisonData) {
            setOfferData({...offerData, view: undefined})
        }
    }, [comparisonData, selectedColData])

    const setPokemonData = (!noComparisonData && offerData.view === 'comparison') ? (offerData.display === 'offer' ? comparisonData.canOffer : offerData.display === 'receive' && comparisonData.canReceive) :
        offerData.display === 'offer' ? {collection: selectedColData.ownedPokemon.filter(p => (p.disabled === undefined) && (Object.values(p.balls).map(ballData => ballData.isOwned === true).includes(true))), onhand: selectedColData.onHand} : 
        offerData.display === 'receive' && {collection: ownerColData.ownedPokemon.filter(p => (p.disabled === undefined) && (Object.values(p.balls).map(ballData => ballData.isOwned === true).includes(true))), onhand: ownerColData.onHand}
    const setPokemonFullColData = (offerData.view !== 'comparison') && (offerData.display === 'offer' ? selectedColData : ownerColData)

    return (
        <Box sx={{width: '100%', overflow: 'hidden', ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{width: '80%', maxWidth: '900px', minHeight: '16px', border: `1px solid ${theme.palette.color3.dark}`, borderTopLeftRadius: '5px', borderTopRightRadius: '5px'}}>
                <Box onClick={() => toggleRateDisplay('owner')} sx={{width: '100%', height: '16px', ...rateDisplayStyles, display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                    <Typography sx={{mx: 1, fontSize: '12px'}}>{offerData.ownerRate ? '-' : '+'}</Typography>
                    <Typography sx={{fontSize: '12px'}}>{offerData.ownerRate ? 'Hide' : 'Show'} {ownerColData.owner.username}'s rates</Typography>
                </Box>
                {offerData.ownerRate && 
                <Box sx={{width: '100%', height: '250px', ...theme.components.box.fullCenterCol}}>
                    <RateDisplay 
                        rates={ownerColData.options.tradePreferences.rates}
                        owner={ownerColData.owner.username}
                        collectionGen={ownerColData.gen}
                        definedAreaStyles={{backgroundColor: hexToRgba(theme.palette.color3.main, 0.3), border: `1px solid ${theme.palette.color3.dark}`, borderRadius: '5px', color: 'white'}}
                    />
                </Box>
                }
            </Box>
            <Box sx={{width: '80%', maxWidth: '900px', minHeight: '16px', border: `1px solid ${theme.palette.color3.dark}`, borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', borderTop: 'none'}}>
                <Box onClick={() => toggleRateDisplay('user')} sx={{width: '100%', height: '16px', ...rateDisplayStyles, display: 'flex', justifyContent: 'start', alignItems: 'center'}}>
                    <Typography sx={{mx: 1, fontSize: '12px'}}>{offerData.userRate ? '-' : '+'}</Typography>
                    <Typography sx={{fontSize: '12px'}}>{offerData.userRate ? 'Hide' : 'Show'} your rates</Typography>
                </Box>
                {offerData.userRate && 
                <Box sx={{width: '100%', height: '250px'}}>
                    <RateDisplay 
                        rates={selectedColData.options.tradePreferences.rates}
                        owner={ownerColData.owner.username}
                        switchPlaces={true}
                        collectionGen={selectedColData.gen}
                        definedAreaStyles={{backgroundColor: hexToRgba(theme.palette.color3.main, 0.3), border: `1px solid ${theme.palette.color3.dark}`, borderRadius: '5px', color: 'white'}}
                    />
                </Box>
                }
            </Box>
            <Typography sx={{mt: 0.5, fontSize: '14px'}}>{tradePreferencesMessage}</Typography>
            {hasComparisonData && <Button onClick={() => setOfferData({...offerData, view: offerData.view === 'comparison' ? 'full' : 'comparison'})} sx={{mt: 1, py: 0, color: theme.palette.color1.light}}>Show {offerData.view === 'comparison' ? 'Full List' : 'Comparison Results'}</Button>}
            <Tabs sx={{width: '80%', height: '10px', ...tabStyles}} value={offerData.display} onChange={(e, newVal) => {setOfferData({...offerData, display: newVal})}}>
                <Tab value='offer' label="What you'll offer"/>
                <Tab value='receive' label="What you'll receive"/>
                <Tab value='items' disabled={oneHomeCollection} label="Offer/receive items"/>
            </Tabs>
            <RelativeValueDisplay 
                isCounteroffer={isCounteroffer}
                originalTradeRecipientName={originalTradeRecipientName}
                handleProposedValueChange={handleProposedValueChange}
                proposedValues={proposedValues}
                traderName={selectedColData.owner.username}
                ownerName={ownerColData.owner.username}
                receivedValueFrom={receivedValueFrom}
            />
            {(offerData.display === 'offer' || offerData.display === 'receive') &&
                <SetPokemon 
                    minHeight={(offerData.userRate === true || offerData.ownerRate === true) ? '650px' : '750px'}
                    type={offerData.display}
                    view={offerData.view === undefined ? 'full' : offerData.view}
                    data={setPokemonData}
                    relValue={0}
                    oneHomeCollection={oneHomeCollection}
                    fullCollectionData={setPokemonFullColData}
                    wantedPokemonData={offerData.display === 'offer' ? getWantedData(ownerColData.ownedPokemon) : []}
                    onhandView={offerData.onhandView}
                    changeOnhandView={() => setOfferData({...offerData, onhandView: offerData.onhandView === 'byIndividual' ? 'byPokemon' : 'byIndividual'})}
                />
            }
            {(offerData.display === 'items') &&
                <SetItems 
                    isCounteroffer={isCounteroffer}
                    userColPreferences={userTradePreferences}
                    ownerColPreferences={tradePreferences}
                    ownerName={ownerColData.owner.username}
                    allowItemTrading={offerData.allowItemTrading}
                    allowUserOffer={offerData.allowUserOffer}
                    allowOwnerOffer={offerData.allowOwnerOffer}
                    allowHandleChange={allowItemTradeType}
                    tabStyles={tabStyles}
                />
            }
        </Box>
    )
}

//oP === oldProps, nP === newProps
const SetOfferReceiving = memo(SetOfferReceivingFunc, (oP, nP) => {
    // const activatedPokemonChanges = (oP.activated.offering.map((p) => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0) !== nP.activated.offering.map((p) => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)) ||
    // (oP.activated.receiving.map((p) => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0) !== nP.activated.receiving.map((p) => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0))
    return (
        Object.keys(oP.comparisonData).length === Object.keys(nP.comparisonData).length &&
        oP.comparisonData.comparedWith === nP.comparisonData.comparedWith &&
        oP.selectedColData._id === nP.selectedColData._id &&
        oP.receivedValueFrom === nP.receivedValueFrom
        // !activatedPokemonChanges
    )
})

export default SetOfferReceiving