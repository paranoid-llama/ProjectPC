import {Box, Typography, useTheme} from '@mui/material'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import { useLoaderData, useRouteLoaderData } from 'react-router'
import { useDispatch } from 'react-redux'
import { resetTradeData } from '../../app/slices/tradeoffer'
import hexToRgba from 'hex-to-rgba'
import { useState, useRef, useEffect, useTransition } from 'react'
import './newtrade.css'
import SelectAndCompare from './newtradesteps/selectandcompare'
import SetOfferReceiving from './newtradesteps/setofferreceiving'
import { checkIfCanTrade } from '../../../utils/functions/comparecollections/checkifcantrade'
import getUserCollectionData from '../../../utils/functions/backendrequests/getusercollectiondata'

export default function NewTrade({}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const targetColData = useLoaderData()
    const userData = useRouteLoaderData("root")
    const targetColDisplay = isNaN(parseInt(targetColData.gen)) ? `${targetColData.gen.toUpperCase()} Aprimon Collection` : `Gen ${targetColData.gen} Aprimon Collection`
    const step1ClassRef = useRef('')
    const step2ClassRef = useRef('')
    const step3ClassRef = useRef('')

    const [tradeData, setTradeData] = useState({displaySteps: {1: false, 2: false, 3: false}, compareWith: '', userCollectionData: {}, comparisonData: {}})
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
        setTimeout(() => {
            step1ClassRef.current = 'grow-trade-step-1'
            setTradeData({...tradeData, displaySteps: {...tradeData.displaySteps, 1: true}})
        }, 500)
    }, [])

    useEffect(() => {
        dispatch(resetTradeData())
    }, [tradeData.compareWith])

    const changeSelectedCol = async(newColId) => {
        const userCollectionData = await getUserCollectionData(newColId)
        setTradeData({...tradeData, compareWith: newColId, userCollectionData})
    }
    const setComparisonData = (data) => {
        data.comparedWith = tradeData.compareWith
        setTradeData({...tradeData, comparisonData: data})
    }
    const setOfferReceiving = (tradeSide, type, data) => {
        //tradeSide = if offering/receiving, type = if pokemon/item, data is the selected data.
        if (type === 'pokemon') {
            const periphData = data.peripherals
            const addToSide = periphData.onhandId !== undefined ? periphData.onhandId : `${data.id} ${periphData.ball}`
            const pokemonDataInState = tradeData[tradeSide].filter(d => d.name === data.name)[0]
            const isInData = pokemonDataInState !== undefined && pokemonDataInState.balls.filter(ballData => ((ballData.onhandId === undefined && `${data.id} ${ballData.ball}` === addToSide) || (ballData.onhandId !== undefined && ballData.onhandId === addToSide)))[0] !== undefined
            const isLastSelectedBall = isInData && pokemonDataInState.balls.length === 1
            const isFirstTimeSelected = pokemonDataInState === undefined
            const newTradeSideState = isLastSelectedBall ? tradeData[tradeSide].filter(d => d.name !== data.name) :
                isInData ? tradeData[tradeSide].map(d => {
                    const isPokemon = d.name === data.name 
                    const newData = isPokemon ? {...d, balls: d.balls.filter(ballData => (ballData.onhandId === undefined && `${data.id} ${ballData.ball}` !== addToSide) || (ballData.onhandId !== undefined && ballData.onhandId !== addToSide))} : d
                    return newData
                }) : 
                isFirstTimeSelected ? [...tradeData[tradeSide], {name: data.name, id: data.id, natDexNum: data.natDexNum, balls: [{...periphData}]}] :
                tradeData[tradeSide].map(d => {
                    const isPokemon = d.name === data.name 
                    const newData = isPokemon ? {...d, balls: [...d.balls, {...periphData}]} : d
                    return newData
                })
            setTradeData({...tradeData, [tradeSide]: newTradeSideState})
        }
    }

    const userTradeableCollections = userData.user.collections.filter(col => checkIfCanTrade(col, targetColData))
    
    return (
        <BodyWrapper sx={{mt: 3, mx: 1, ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '1200px', width: '100%'}}>
                <Typography variant='h1' sx={{fontWeight: 700, width: '100%', fontSize: '36px', mb: 1}}>New Trade Offer</Typography>
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
                                selectedColData={tradeData.userCollectionData}
                                ownerColData={targetColData}
                                handleChange={setOfferReceiving}
                            />}
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', minHeight: '50px', alignItems: 'start', ...disabledStep2}}>
                        <Box sx={{...stepButtonStyles}} onClick={() => toggleTradeStep(3)}>
                            <Typography sx={{fontWeight: 700, ml: 3, height: '50px', display: 'flex', alignItems: 'center'}}>3. Finalize Trade</Typography>
                        </Box>
                        <Box className={step3ClassRef.current} sx={{height: '0px', width: '100%', position: 'relative'}}>

                        </Box>
                    </Box>
                </Box>
            </Box>
        </BodyWrapper>
    )
}