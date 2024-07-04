import {Box, Typography, useTheme, Button, Tooltip, Select, MenuItem} from '@mui/material'
import ImgData from '../../components/collectiontable/tabledata/imgdata'
import { useNavigate, useLoaderData, useRouteLoaderData, useRevalidator } from 'react-router'
import { useState, useTransition, useEffect } from 'react'
import hexToRgba from 'hex-to-rgba'
import ShowOffer from './showtradecomponents/showoffer'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import { getOfferData } from '../../../utils/functions/backendrequests/trades/getofferdata'
import readNotification from '../../../utils/functions/backendrequests/users/readnotification'

export default function ShowTrade({}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const loggedInUserData = useRouteLoaderData('root').user
    const tradeAndLOfferData = useLoaderData()
    const tradeData = tradeAndLOfferData.tradeData 
    const [selectedOffer, setSelectedOffer] = useState({selected: tradeData.history.length-1, data: tradeAndLOfferData.latestOfferData})
    const [isPending, startTransition] = useTransition()
    const isCrossGenTrade = tradeData.gen.includes('-')
    const tradeGenDisplay = isCrossGenTrade ? 'Cross-Gen Trade' : isNaN(parseInt(tradeData.gen)) ? `${tradeData.gen.toUpperCase()} Trade` : `Gen ${tradeData.gen} Trade`
    const tradeCollection1Display = isNaN(parseInt(tradeData.users[0].tradeCollection.gen)) ? `${tradeData.users[0].tradeCollection.gen.toUpperCase()} Aprimon Collection` : `Gen ${tradeData.users[0].tradeCollection.gen} Aprimon Collection`
    const tradeCollection2Display = isNaN(parseInt(tradeData.users[1].tradeCollection.gen)) ? `${tradeData.users[1].tradeCollection.gen.toUpperCase()} Aprimon Collection` : `Gen ${tradeData.users[1].tradeCollection.gen} Aprimon Collection`
    
    const requestBackendOfferData = async(newSelectedOfferIdx) => {
        const offerData = await getOfferData(tradeData._id, newSelectedOfferIdx)
        setSelectedOffer({selected: newSelectedOfferIdx, data: offerData})    
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
        'completed': 'COMPLETED'
    }
    const tradeStatusColors = {
        'initialoffer': {color: 'rgb(23, 162, 184)'},
        'counteroffer': {color: 'rgb(0, 123, 255)'},
        'rejected': {color: 'rgb(220, 53, 69)'},
        'pending': {color: 'rgb(252, 139, 0)'},
        'completed': {color: 'rgb(40, 167, 69)'}
    }
    const tradeStatusTooltip = {
        'initialoffer': "The trade's initial offer is waiting on a response.",
        'counteroffer': "The trade is in the counter-offer phase.",
        'rejected': `The trade was rejected${tradeData.closeDate !== undefined ? closeDateTotal : '.'}`,
        'pending': "An offer was accepted and the trade is pending.",
        'completed': `The trade was marked complete by both parties${tradeData.closeDate !== undefined ? closeDateTotal : '.'}`
    }

    useEffect(() => {
        const userHasPendingNotiOfTrade = loggedInUserData !== undefined && tradeData.users.filter(userData => loggedInUserData.username === userData.username)[0].notifications.length !== 0
        if (userHasPendingNotiOfTrade) {
            readNotification(loggedInUserData.username, tradeData._id, true)
        }
    }, [])

    return (
        <BodyWrapper sx={{mt: 3, mx: 1, ...theme.components.box.fullCenterCol, justifyContent: 'start', mb: 0}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '1200px', width: '100%', gap: 1}}>  
                <Typography variant='h1' sx={{fontWeight: 700, width: '100%', fontSize: '36px', mb: 1}}>Trade Summary</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, width: '90%', gap: 1, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px', border: `1px solid ${theme.palette.color3.dark}`, alignItems: 'start'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '30%', height: '100%', margin: 1}}>
                        <ImgData type='icons' linkKey='user' size='150px'/>
                        <Button sx={{textTransform: 'none', my: 1, padding: 0.5, borderRadius: '10px', ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.95)}}} onClick={() => navigate(`/users/${tradeData.users[0].username}`)}>
                            <Typography sx={{fontSize: '18px', color: theme.palette.color1.contrastText}}>
                                {tradeData.users[0].username}
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
                            onClick={() => navigate(`/collections/${tradeData.users[0].tradeCollection._id}`)}
                        >
                            <Box sx={{width: '100%', ...theme.components.box.fullCenterCol}}>
                                <Typography sx={{fontSize: '16px', textAlign: 'center'}}>
                                    {tradeData.users[0].tradeCollection.name}
                                </Typography>
                                <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                                    {tradeCollection1Display}
                                </Typography>
                            </Box>
                        </Button>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '35%', height: '100%', margin: 1, mt: 3, color: theme.palette.color1.contrastText, position: 'relative'}}>
                        <Typography variant='h4' sx={{fontWeight: 700, fontSize: '28px'}}>
                            Trading With
                        </Typography>
                        <Typography sx={{my: 2}}>
                            Trade proposed by {tradeData.users[0].username} on {tradeData.createdAt.slice(0, 10)}
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
                        <Button sx={{textTransform: 'none', my: 1, padding: 0.5, borderRadius: '10px', ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.95)}}}  onClick={() => navigate(`/users/${tradeData.users[1].username}`)}>
                            <Typography sx={{fontSize: '18px', color: theme.palette.color1.contrastText}}>
                                {tradeData.users[1].username}
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
                            onClick={() => navigate(`/collections/${tradeData.users[1].tradeCollection._id}`)}
                        >
                            <Box sx={{width: '100%', ...theme.components.box.fullCenterCol}}>
                                <Typography sx={{fontSize: '16px', textAlign: 'center'}}>
                                    {tradeData.users[1].tradeCollection.name}
                                </Typography>
                                <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                                    {tradeCollection2Display}
                                </Typography>
                            </Box>
                        </Button>
                    </Box>
                </Box>
                <ShowOffer 
                    numOfOffers={tradeData.history.length}
                    tradeParticipants={tradeData.users.map(userData => userData.username)}
                    offersBasicData={tradeData.history}
                    selectedOfferIdx={selectedOffer.selected}
                    selectedOfferData={selectedOffer.data}
                    handleSelectedOfferChange={changeSelectedOffer}
                    tradeId={tradeData._id}
                    tradeUsers={tradeData.users}
                    isPending={isPending}
                    markedCompleteData={tradeData.markedCompleteBy}
                    tradeStatus={tradeData.status}
                />
            </Box>
        </BodyWrapper>
    )
}