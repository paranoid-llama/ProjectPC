import {Box, Typography, useTheme} from '@mui/material'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import { useLoaderData, useRouteLoaderData, useLocation } from 'react-router'
import { useDispatch } from 'react-redux'
import { resetTradeData } from '../../app/slices/tradeoffer'
import hexToRgba from 'hex-to-rgba'
import { useState, useRef, useEffect, useContext, useTransition } from 'react'
import { ErrorContext } from '../../app/contexts/errorcontext'
import './newtrade.css'
import SelectAndCompare from './newtradesteps/selectandcompare'
import SetOfferReceiving from './newtradesteps/setofferreceiving'
import FinalizeTrade from './newtradesteps/finalizetrade'
import { checkIfCanTrade } from '../../../utils/functions/comparecollections/checkifcantrade'
import { getValue } from '../../../utils/functions/comparecollections/getvalue'
import getUserCollectionData from '../../../utils/functions/backendrequests/getusercollectiondata'

export default function NewTrade({loaderData}) {
    const theme = useTheme()
    const userData = useRouteLoaderData("root")
    const {handleError} = useContext(ErrorContext)
    const dispatch = useDispatch()
    const locationData = useLocation()
    // const loaderData = useLoaderData()
    const isCounteroffer = locationData.pathname.includes('counter-offer')

    const offererNumber = isCounteroffer && (userData.user._id.toString() === loaderData.tradeData.users[0]._id.toString()) ? 0 : 1

    const userMakingOfferCol = isCounteroffer ? loaderData[`user${offererNumber}CollectionData`] : {}
    const targetColData = isCounteroffer ? loaderData[`user${offererNumber === 0 ? 1 : 0}CollectionData`] : loaderData
    const proposedValues = useRef({})
    const targetColDisplay = isNaN(parseInt(targetColData.gen)) ? `${targetColData.gen.toUpperCase()} Aprimon Collection` : `Gen ${targetColData.gen} Aprimon Collection`
    const step1ClassRef = useRef('')
    const step2ClassRef = useRef('')
    const step3ClassRef = useRef('')

    const [tradeData, setTradeData] = useState({displaySteps: {1: false, 2: false, 3: false}, compareWith: Object.keys(userMakingOfferCol).length === 0 ? '' : userMakingOfferCol._id, userCollectionData: userMakingOfferCol, comparisonData: {}, receivedValueFrom: ''})
    // const [selectedColIsPending, startColTransition] = useTransition()

    const toggleTradeStep = (tradeStepNum) => {
        const newValue = !tradeData.displaySteps[tradeStepNum]
        const className = `${newValue ? 'grow' : 'shrink'}-trade-step-${tradeStepNum}`
        const refVar = tradeStepNum === 1 ? step1ClassRef : tradeStepNum === 2 ? step2ClassRef : tradeStepNum === 3 && step3ClassRef
        refVar.current = className
        setTradeData({...tradeData, displaySteps: {...tradeData.displaySteps, [tradeStepNum]: newValue}})
    }

    const stepButtonStyles = {
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: hexToRgba(theme.palette.color1.dark, 0.5),
            borderRadius: '10px'
        }
    }
    const disabledStepStyles = {
        pointerEvents: 'none',
        opacity: 0.5
    }
    const disabledStep2 = tradeData.compareWith === '' ? disabledStepStyles : {}

    

    useEffect(() => {
        dispatch(resetTradeData())
    }, [tradeData.compareWith])

    const changeSelectedCol = async(newColId, otherStateChanges={}) => {
        const successFunc = (userCollectionData) => {
            setTradeData({...tradeData, compareWith: newColId, userCollectionData, ...otherStateChanges})
        }
        const backendFunc = async() => await getUserCollectionData(newColId)
        handleError(backendFunc, false, successFunc, () => {})
        
    }
    const setComparisonData = (data) => {
        data.comparedWith = tradeData.compareWith
        setTradeData({...tradeData, comparisonData: data})
    }

    const initDataFromComparison = async() => {
        const backendFunc = async() => await getUserCollectionData(locationData.state.compareWith) 
        const successFunc = (userCollectionData) => {setTradeData({...tradeData, displaySteps: {...tradeData.displaySteps, 2: true}, compareWith: locationData.state.compareWith, userCollectionData, comparisonData: locationData.state.comparisonData})}
        handleError(backendFunc, false, successFunc, () => {})
        //might be worth passing all collection data into the location state rather than re-requesting it. I think that's how its handled for counter-offers anyway
        //not sure why i did it this way but its worth looking into.
    }

    const changeProposedValues = () => {
        const newGetValueFromCol = loaderData.user0CollectionData.owner.username === tradeData.receivedValueFrom ? loaderData.user1CollectionData : loaderData.user0CollectionData
        proposedValues.current = getValue(newGetValueFromCol.options.tradePreferences.rates)
        setTradeData({...tradeData, receivedValueFrom: newGetValueFromCol.owner.username})
    }

    useEffect(() => {
        const getValueFromCol = isCounteroffer ? 
            (loaderData.tradeData.users[1].username === loaderData.user1CollectionData.owner.username ? loaderData.user1CollectionData : loaderData.user0CollectionData) : 
            targetColData
        const gotValueFromName = getValueFromCol.owner.username
        proposedValues.current = getValue(getValueFromCol.options.tradePreferences.rates)
        if (locationData.state !== null && !isCounteroffer)  {//indicates they came from comparison modal in the show page 
            setTimeout(() => { 
                step2ClassRef.current = 'grow-trade-step-2'
                initDataFromComparison()
            }, 500)
        } else {
           setTimeout(() => {
                step1ClassRef.current = 'grow-trade-step-1'
                setTradeData({...tradeData, displaySteps: {...tradeData.displaySteps, 1: true}, receivedValueFrom: gotValueFromName})
            }, 500) 
        }
    }, [])
    
    const userTradeableCollections = userData.user.collections.filter(col => checkIfCanTrade(col, targetColData))
    
    return (
        <BodyWrapper sx={{mt: 3, mx: 1, ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '1200px', width: '100%'}}>
                <Typography variant='h1' sx={{fontWeight: 700, width: '100%', fontSize: '36px', mb: 1}}>New {isCounteroffer ? 'Counter' : 'Trade'} Offer</Typography>
                <Box sx={{border: `1px solid ${theme.palette.color2.light}`, borderRadius: '10px', backgroundColor: hexToRgba(theme.palette.color2.light, 0.3), width: '75%', height: '50px', ...theme.components.box.fullCenterCol, mb: 3}}>
                    <Typography><b>Trading with:</b> {targetColData.owner.username}'s {targetColDisplay}</Typography>
                </Box>
                <Box sx={{border: `1px solid ${theme.palette.color3.dark}`, borderRadius: '10px', backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), width: '100%', minHeight: '150px', ...theme.components.box.fullCenterCol, mb: 3, color: 'white'}}>
                    <Box sx={{width: '100%', borderBottom: `1px solid ${theme.palette.color3.dark}`, minHeight: '49px', alignItems: 'start'}}>
                        <Box sx={{...stepButtonStyles}} onClick={() => toggleTradeStep(1)}>
                            <Typography sx={{fontWeight: 700, ml: 3, height: '49px', display: 'flex', alignItems: 'center'}}>1. Select and Compare Collections</Typography>
                        </Box>
                        <Box className={step1ClassRef.current} sx={{height: '0px', width: '100%', position: 'relative'}}>
                            <SelectAndCompare 
                                selectedCol={tradeData.compareWith}
                                userCollections={userTradeableCollections}
                                ownerCollection={targetColData}
                                comparisonData={tradeData.comparisonData}
                                changeSelectedCol={changeSelectedCol}
                                setComparisonData={setComparisonData}
                                selectedColData={tradeData.userCollectionData}
                                isCounteroffer={isCounteroffer}
                                previousOfferData={isCounteroffer && loaderData.tradeData.history[loaderData.tradeData.history.length-1]}
                            />
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', borderBottom: `1px solid ${theme.palette.color3.dark}`, minHeight: '49px', alignItems: 'start', ...disabledStep2}}>
                        <Box sx={{...stepButtonStyles}} onClick={() => toggleTradeStep(2)}>
                            <Typography sx={{fontWeight: 700, ml: 3, height: '49px', display: 'flex', alignItems: 'center'}}>2. Set Offer/Receiving</Typography>
                        </Box>
                        <Box className={step2ClassRef.current} sx={{height: '0px', width: '100%', position: 'relative', overflow: 'hidden'}}>
                            {!(tradeData.compareWith === '') && 
                            <SetOfferReceiving
                                comparisonData={tradeData.comparisonData}
                                originalTradeRecipientName={isCounteroffer && (loaderData.tradeData.users[1].username === loaderData.user1CollectionData.owner.username ? loaderData.user1CollectionData.owner.username : loaderData.user0CollectionData.owner.username)}
                                selectedColData={tradeData.userCollectionData}
                                ownerColData={targetColData}
                                isCounteroffer={isCounteroffer}
                                receivedValueFrom={tradeData.receivedValueFrom}
                                handleProposedValueChange={changeProposedValues}
                                proposedValues={proposedValues.current}
                            />}
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', minHeight: '50px', alignItems: 'start', ...disabledStep2}}>
                        <Box sx={{...stepButtonStyles}} onClick={() => toggleTradeStep(3)}>
                            <Typography sx={{fontWeight: 700, ml: 3, height: '50px', display: 'flex', alignItems: 'center'}}>3. Finalize Trade</Typography>
                        </Box>
                        <Box className={step3ClassRef.current} sx={{height: '0px', width: '100%', position: 'relative', overflow: 'hidden'}}>
                            {!(tradeData.compareWith === '') && 
                            <FinalizeTrade 
                                selectedColDisplay={isNaN(parseInt(tradeData.userCollectionData.gen)) ? `${tradeData.userCollectionData.gen.toUpperCase()} Aprimon Collection` : `Gen ${tradeData.userCollectionData.gen} Aprimon Collection`}
                                proposedValues={proposedValues.current}
                                traderId={userData.user._id}
                                ownerId={targetColData.owner._id}
                                traderUsername={userData.user.username}
                                ownerUsername={targetColData.owner.username}
                                traderGen={tradeData.userCollectionData.gen}
                                ownerGen={targetColData.gen}
                                isCounteroffer={isCounteroffer}
                                tradeId={isCounteroffer && loaderData.tradeData._id}
                                traderColId={tradeData.userCollectionData._id}
                                ownerColId={targetColData._id}
                            />}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </BodyWrapper>
    )
}