import {Box, Typography, useTheme, Button, Tooltip, Select, MenuItem} from '@mui/material'
import ImgData from '../../components/collectiontable/tabledata/imgdata'
import { useNavigate, useLoaderData, useRouteLoaderData, useRevalidator } from 'react-router'
import { useState, useTransition, useEffect, useContext } from 'react'
import { ErrorContext } from '../../app/contexts/errorcontext'
import hexToRgba from 'hex-to-rgba'
import ShowOffer from './showtradecomponents/showoffer'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import { getOfferData } from '../../../utils/functions/backendrequests/trades/getofferdata'
import readNotification from '../../../utils/functions/backendrequests/users/readnotification'

export default function ShowTrade({tradeAndLOfferData}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const {handleError} = useContext(ErrorContext)
    const loggedInUserData = useRouteLoaderData('root').user
    // const tradeAndLOfferData = useLoaderData()
    const tradeData = tradeAndLOfferData.tradeData 
    const [selectedOffer, setSelectedOffer] = useState({selected: tradeData.history.length-1, data: tradeAndLOfferData.latestOfferData})
    const [isPending, startTransition] = useTransition()
    const isCrossGenTrade = tradeData.gen.includes('-')
    const tradeGenDisplay = isCrossGenTrade ? 'Cross-Gen Trade' : isNaN(parseInt(tradeData.gen)) ? `${tradeData.gen.toUpperCase()} Trade` : `Gen ${tradeData.gen} Trade`
    const deletedUser0 = tradeData.users[0] === null
    const deletedUser1 = tradeData.users[1] === null
    const deletedCollection0 = tradeData.deletedCollection !== undefined && tradeData.deletedCollection['0'] === true
    const deletedCollection1 = tradeData.deletedCollection !== undefined && tradeData.deletedCollection['1'] === true
    const deletedCollection0Gen = deletedCollection0 ? isCrossGenTrade ? tradeData.gen.slice(0, tradeData.gen.indexOf('-')) : tradeData.gen : undefined
    const deletedCollection1Gen = deletedCollection1 ? isCrossGenTrade ? tradeData.gen.slice(tradeData.gen.indexOf('-')+1, tradeData.gen.length) : tradeData.gen : undefined
    
    const tradeCollection1Display = !deletedCollection0 && (isNaN(parseInt(tradeData.users[0].tradeCollection.gen)) ? `${tradeData.users[0].tradeCollection.gen.toUpperCase()} Aprimon Collection` : `Gen ${tradeData.users[0].tradeCollection.gen} Aprimon Collection`)
    const tradeCollection2Display = !deletedCollection1 && (isNaN(parseInt(tradeData.users[1].tradeCollection.gen)) ? `${tradeData.users[1].tradeCollection.gen.toUpperCase()} Aprimon Collection` : `Gen ${tradeData.users[1].tradeCollection.gen} Aprimon Collection`)
    

    const requestBackendOfferData = async(newSelectedOfferIdx) => {
        const backendFunc = async() => await getOfferData(tradeData._id, newSelectedOfferIdx)
        const successFunc = (offerData) => {setSelectedOffer({selected: newSelectedOfferIdx, data: offerData})}
        const errorFunc = (errorDetails) => {setSelectedOffer({...selectedOffer, selected: newSelectedOfferIdx, error: true, errorDetails})}
        handleError(backendFunc, false, successFunc, errorFunc)
    }

    const changeSelectedOffer = (newSelectedOfferIdx) => {
        startTransition(() => {
            requestBackendOfferData(newSelectedOfferIdx)
        })
    }

    const closeDateTotal = tradeData.closeDate !== undefined && ` on ${tradeData.closeDate.slice(0, 10)} at ${tradeData.closeDate.slice(11, 16)} (GMT +00:00)`

    const tradeStatusDisplay = {
        'initialoffer': 'INITIAL OFFER',
        'counteroffer': 'COUNTER-OFFER',
        'rejected': 'REJECTED',
        'pending': 'PENDING',
        'completed': 'COMPLETED',
        'cancelled': 'CANCELLED'
    }
    const tradeStatusColors = {
        'initialoffer': {color: 'rgb(23, 162, 184)'},
        'counteroffer': {color: 'rgb(0, 123, 255)'},
        'rejected': {color: 'rgb(220, 53, 69)'},
        'pending': {color: 'rgb(252, 139, 0)'},
        'completed': {color: 'rgb(40, 167, 69)'},
        'cancelled': {color: 'rgb(150, 12, 28)'},
    }
    const tradeStatusTooltip = {
        'initialoffer': "The trade's initial offer is waiting on a response.",
        'counteroffer': "The trade is in the counter-offer phase.",
        'rejected': `The trade was rejected${tradeData.closeDate !== undefined ? closeDateTotal : '.'}`,
        'pending': "An offer was accepted and the trade is pending.",
        'completed': `The trade was marked complete by both parties${tradeData.closeDate !== undefined ? closeDateTotal : '.'}`,
        'cancelled': `The trade was cancelled. Either cancelled intentionally by one party, or as a result of a collection being deleted or a party's account being deleted/banned.`
    }

    useEffect(() => {
        const userHasPendingNotiOfTrade = loggedInUserData !== undefined && tradeData.users.filter(userData => !userData ? false : loggedInUserData.username === userData.username)[0].notifications.length !== 0
        if (userHasPendingNotiOfTrade) {
            const backendFunc = async() => await readNotification(loggedInUserData.username, tradeData._id, true)
            handleError(backendFunc, false, () => {}, () => {}, false, true)
        }
    }, [])

    return (
        <BodyWrapper sx={{mt: 3, mx: 1, ...theme.components.box.fullCenterCol, justifyContent: 'start', mb: 0}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '1200px', width: '100%', gap: 1}}>  
                <Typography variant='h1' sx={{fontWeight: 700, width: '100%', fontSize: '36px', mb: 1}}>Trade Summary</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, width: '90%', gap: 1, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px', border: `1px solid ${theme.palette.color3.dark}`, alignItems: 'start'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '30%', height: '100%', margin: 1}}>
                        <ImgData type='icons' linkKey='user' size='150px'/>
                        <Button sx={{textTransform: 'none', my: 1, padding: 0.5, borderRadius: '10px', opacity: deletedUser0 ? 0.5 : 1, ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.95)}}} onClick={deletedUser0 ? null : () => navigate(`/users/${tradeData.users[0].username}`)} disabled={deletedUser0}>
                            <Typography sx={{fontSize: '18px', color: theme.palette.color1.contrastText}}>
                                {deletedUser0 ? `<Deleted User>` : tradeData.users[0].username}
                            </Typography>
                        </Button>
                        <Button 
                            sx={{
                                textTransform: 'none', 
                                color: 'inherit', 
                                width: '100%', 
                                height: '90%', 
                                padding: 0, 
                                ':hover': {backgroundColor: hexToRgba(theme.palette.color3.main, 0.5), borderRadius: '10px'}, 
                                borderRadius: '10px', 
                                backgroundColor: hexToRgba(theme.palette.color3.main, 0.3), 
                                border: `1px solid ${theme.palette.color3.dark}`
                            }}
                            onClick={deletedCollection0 ? null : () => navigate(`/collections/${tradeData.users[0].tradeCollection._id}`)}
                            disabled={deletedCollection0}
                        >
                            
                            
                            <Box sx={{width: '100%', ...theme.components.box.fullCenterCol}}>
                                {deletedCollection0 ? 
                                <Typography sx={{fontSize: '16px', textAlign: 'center'}}>
                                    {`<Deleted ${isNaN(parseInt(deletedCollection0Gen)) ? deletedCollection0Gen.toUpperCase() : `Gen ${deletedCollection0Gen}`} Aprimon Collection>`}
                                </Typography> :
                                <>
                                <Typography sx={{fontSize: '16px', textAlign: 'center'}}>
                                    {tradeData.users[0].tradeCollection.name}
                                </Typography>
                                <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                                    {tradeCollection1Display}
                                </Typography>
                                </>
                                }
                            </Box>
                           
                        </Button>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '35%', height: '100%', margin: 1, mt: 3, color: theme.palette.color1.contrastText, position: 'relative'}}>
                        <Typography variant='h4' sx={{fontWeight: 700, fontSize: '28px'}}>
                            Trading With
                        </Typography>
                        <Typography sx={{my: 2}}>
                            Trade proposed by {deletedUser0 ? '<Deleted User>' : tradeData.users[0].username} on {tradeData.createdAt.slice(0, 10)}
                        </Typography>
                        <Typography sx={{fontWeight: 700}}>
                            Trade Status:
                        </Typography>
                        <Box sx={{width: '70%', height: '50px', backgroundColor: 'rgba(100, 100, 100, 0.75)', borderRadius: '10px', border: '1px solid grey', ...theme.components.box.fullCenterRow, position: 'relative'}}>
                            <Tooltip title={tradeStatusTooltip[tradeData.status]} arrow>
                                <Typography sx={{color: tradeStatusColors[tradeData.status], fontWeight: 700, ':hover': {cursor: 'pointer'}}}>
                                    {tradeStatusDisplay[tradeData.status]}
                                </Typography>
                            </Tooltip>
                            <Typography sx={{position: 'absolute', fontSize: '10px', bottom: '-2px'}}>
                                {tradeData.closeDate !== undefined && 
                                `${tradeData.closeDate.slice(0, 10)} - ${tradeData.closeDate.slice(11, 16)} (GMT +0)`
                                }
                            </Typography>
                        </Box>
                        <Typography sx={{position: 'absolute', top: '105%', fontSize: '14px'}}>
                            {tradeGenDisplay}
                        </Typography>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '30%', height: '100%', margin: 1}}>
                        <ImgData type='icons' linkKey='user' size='150px'/>
                        <Button sx={{textTransform: 'none', my: 1, padding: 0.5, borderRadius: '10px', opacity: deletedUser1 ? 0.5 : 1, ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.95)}}}  onClick={deletedUser1 ? null : () => navigate(`/users/${tradeData.users[1].username}`)} disabled={deletedUser1}>
                            <Typography sx={{fontSize: '18px', color: theme.palette.color1.contrastText}}>
                                {deletedUser1 ? '<Deleted User>' : tradeData.users[1].username}
                            </Typography>
                        </Button>
                        <Button 
                            sx={{
                                textTransform: 'none', 
                                color: 'inherit', 
                                width: '100%', 
                                height: '90%', 
                                padding: 0, 
                                ':hover': {backgroundColor: hexToRgba(theme.palette.color3.main, 0.5), borderRadius: '10px'}, 
                                borderRadius: '10px', 
                                backgroundColor: hexToRgba(theme.palette.color3.main, 0.3), 
                                border: `1px solid ${theme.palette.color3.dark}`
                            }}
                            onClick={deletedCollection1 ? null : () => navigate(`/collections/${tradeData.users[1].tradeCollection._id}`)}
                            disabled={deletedCollection1}
                        >
                            <Box sx={{width: '100%', ...theme.components.box.fullCenterCol}}>
                                {deletedCollection1 ? 
                                <Typography sx={{fontSize: '16px', textAlign: 'center'}}>
                                    {`<Deleted ${isNaN(parseInt(deletedCollection1Gen)) ? deletedCollection1Gen.toUpperCase() : `Gen ${deletedCollection1Gen}`} Aprimon Collection>`}
                                </Typography> :
                                <>
                                <Typography sx={{fontSize: '16px', textAlign: 'center'}}>
                                    {tradeData.users[1].tradeCollection.name}
                                </Typography>
                                <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                                    {tradeCollection2Display}
                                </Typography>
                                </>
                                }
                            </Box>
                        </Button>
                    </Box>
                </Box>
                <ShowOffer 
                    numOfOffers={tradeData.history.length}
                    tradeParticipants={tradeData.users.map(userData => !userData ? null : userData.username)}
                    offersBasicData={tradeData.history}
                    selectedOfferIdx={selectedOffer.selected}
                    selectedOfferData={selectedOffer.data}
                    handleSelectedOfferChange={changeSelectedOffer}
                    tradeId={tradeData._id}
                    tradeUsers={tradeData.users}
                    isPending={isPending}
                    markedCompleteData={tradeData.markedCompleteBy}
                    tradeStatus={tradeData.status}
                    errorSelection={selectedOffer.error}
                /> 
            </Box>
        </BodyWrapper>
    )
}