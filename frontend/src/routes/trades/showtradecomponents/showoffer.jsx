import {Box, Typography, useTheme, Select, MenuItem, Tooltip, Button, CircularProgress, ToggleButton} from '@mui/material'
import { useRouteLoaderData, useNavigate, useRevalidator } from 'react-router'
import hexToRgba from 'hex-to-rgba'
import { forwardRef, useContext, useEffect, useState } from 'react'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { AlertsContext } from '../../../alerts/alerts-context'
import { Virtuoso } from 'react-virtuoso'
import { reFormatToIndividual } from '../../../../utils/functions/comparecollections/comparison'
import { listTradeItem, listTradePokemon } from '../partialcomponents/listtradestuff'
import ScrollBar from '../../../components/functionalcomponents/scrollbar'
import { acceptTradeOffer, rejectTradeOffer, counterTradeOffer, cancelTrade, toggleMarkedAsComplete } from '../../../../utils/functions/backendrequests/trades/traderesponse'
import ConfirmDecisionModal from '../../../components/functionalcomponents/confirmdecisionmodal'
import DotWaitingText from '../../../components/functionalcomponents/dotwaitingtext'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import { items } from '../../../../common/infoconstants/miscconstants.mjs'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay'

export default function ShowOffer({numOfOffers, tradeParticipants, offersBasicData, selectedOfferIdx, selectedOfferData, handleSelectedOfferChange, tradeId, tradeUsers, isPending, markedCompleteData, tradeStatus, errorSelection}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const {handleError} = useContext(ErrorContext)
    const revalidator = useRevalidator()
    const loggedInUserData = useRouteLoaderData('root')
    const [statuses, setStatuses] = useState({tradeStatus, offerStatus: selectedOfferData.status})
    const [confirmDecisionModal, setConfirmDecisionModal] = useState({open: false, error: false, type: ''})
    const [markingComplete, setMarkingComplete] = useState(false)
    const [copiedToClipboard, setCopiedToClipboard] = useState({offer: false, receiving: false})
    const isLatestOffer = numOfOffers === selectedOfferIdx+1
    const isTradeParticipant = loggedInUserData.loggedIn && tradeParticipants.includes(loggedInUserData.user.username)
    const otherParticipant = isTradeParticipant && tradeParticipants.filter(tradePart => tradePart !== loggedInUserData.user.username)[0]

    const responder = selectedOfferData.recipient
    const notCancelledTrade = statuses.tradeStatus !== 'cancelled'
    const canRespondToOffer = loggedInUserData.loggedIn && loggedInUserData.user.username === responder && isLatestOffer && statuses.offerStatus !== 'rejected' && statuses.tradeStatus !== 'completed' && statuses.tradeStatus !== 'pending' && notCancelledTrade 
    const canMarkComplete = (statuses.offerStatus === 'accepted' && statuses.tradeStatus === 'pending') && loggedInUserData.loggedIn && isTradeParticipant && notCancelledTrade 
    const canCancelTrade = isTradeParticipant && !canRespondToOffer && statuses.tradeStatus !== 'completed' && statuses.tradeStatus !== 'rejected' && notCancelledTrade
    
    const markedCompleteAlready = canMarkComplete && markedCompleteData === loggedInUserData.user.username
    const otherUserHasntMarkedComplete = canMarkComplete && markedCompleteData !== otherParticipant
    const listOfferSelectionItem = () => {
        return Array.from(Array(numOfOffers).keys()).map((offerIdx) => {
            const initialOffer = offerIdx === 0
            const displayLatestOffer = numOfOffers === offerIdx+1
            const createdAt = offersBasicData[offerIdx].createdAt
            return (
                <MenuItem key={`trade-offer-${offerIdx+1}-selection`} value={offerIdx}>
                    <Box sx={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                        <Typography sx={{width: '60%', textAlign: 'start'}}>
                            {initialOffer ? 'Initial Offer' : `Counter-Offer #${offerIdx}`} {displayLatestOffer && '(Latest Offer)'}
                        </Typography>
                        <Typography sx={{width: '40%', textAlign: 'end'}}>
                            {createdAt.slice(0, 10)}
                        </Typography> 
                    </Box>
                </MenuItem>
            )
        })
    }

    useEffect(() => {
        setStatuses({...statuses, offerStatus: selectedOfferData.status})
    }, [selectedOfferData._id])
    useEffect(() => {
        if (copiedToClipboard.offer || copiedToClipboard.receiving) {
            setTimeout(() => {
                setCopiedToClipboard({offer: false, receiving: false})
            }, 3000)
        }
    }, [copiedToClipboard.offer, copiedToClipboard.receiving])

    const copyToClipboardFunc = (side) => {
        const sideToUse = side === 'offer' ? selectedOfferData.trade.offer : selectedOfferData.trade.receiving
        let text = ''
        if (sideToUse.pokemon !== undefined) {
            sideToUse.pokemon.forEach((p, idx) => {
                p.balls.forEach(b => {
                    const isLastEntry = idx === sideToUse.pokemon.length-1 && sideToUse.items === undefined
                    const display = `${capitalizeFirstLetter(b.ball)}${b.isHA ? ' HA ' : ' '}${getNameDisplay(userNameDisplaySettings, p.name, p.natDexNum)}${b.onhandId !== undefined ? ' (On-Hand)' : ''}`
                    if (isLastEntry) {
                        text = text+display
                    } else {
                        text = text+`${display}\n`
                    }
                })
            }) 
        }
        if (sideToUse.items !== undefined) {
            sideToUse.items.forEach((i, idx) => {
                const isLastEntry = idx === sideToUse.items.length-1
                const nameDisplay = items.filter(item => item.value === i.name)[0].display
                const display = `${nameDisplay} x${i.qty}`
                if (isLastEntry) {
                    text = text+display
                }
                else {
                    text = text+`${display}\n`
                }
            })
        }
        navigator.clipboard.writeText(text)
        setCopiedToClipboard({...copiedToClipboard, [side]: true})
    }

    const offerPokemon = selectedOfferData.trade.offer.pokemon === undefined ? [] : reFormatToIndividual(selectedOfferData.trade.offer.pokemon, true)
    const receivingPokemon = selectedOfferData.trade.receiving.pokemon === undefined ? [] : reFormatToIndividual(selectedOfferData.trade.receiving.pokemon, true)
    const offerItems = selectedOfferData.trade.offer.items === undefined ? [] : selectedOfferData.trade.offer.items
    const receivingItems = selectedOfferData.trade.receiving.items === undefined ? [] : selectedOfferData.trade.receiving.items
    const offerItemCount = offerItems.map(i => i.qty).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const receivingItemCount = receivingItems.map(i => i.qty).reduce((accumulator, currentValue) => accumulator+currentValue, 0)

    const totalOffer = [...offerPokemon, ...offerItems]
    const totalReceiving = [...receivingPokemon, ...receivingItems]

    const offerStatusDisplay = {
        'pending': 'PENDING',
        'countered': 'COUNTER-OFFERED',
        'rejected': 'REJECTED',
        'accepted': 'ACCEPTED'
    }
    const offerStatusColors = {
        'countered': {color: 'rgb(0, 123, 255)'},
        'rejected': {color: 'rgb(220, 53, 69)'},
        'pending': {color: 'rgb(252, 139, 0)'},
        'accepted': {color: 'rgb(40, 167, 69)'}
    }
    const offerStatusTooltip = {
        'pending': 'This offer is waiting on a response.',
        'countered': 'This offer was countered with another offer.',
        'rejected': 'This offer was rejected and the trade was closed.',
        'accepted': 'This offer was accepted.'
    }

    const userNameDisplaySettings = !loggedInUserData.loggedIn ? undefined : loggedInUserData.user.settings.display.pokemonNames

    //alerts
    const [alertIds, setAlertIds] = useState([])
    const {addAlert, dismissAlert} = useContext(AlertsContext)

    const clearAlerts = () => {
        alertIds.forEach((id) => {
            dismissAlert(id);
        });
        setAlertIds([]);
    }

    useEffect(() => {
        return () => {
            clearAlerts();
        };
    }, []);

    const noOfferMessage = selectedOfferData.comment.length === 0

    const acceptOffer = () => {
        const offererColId = tradeUsers.filter(userD => userD.username === selectedOfferData.offerer)[0].tradeCollection._id
        const recipientColId = tradeUsers.filter(userD => userD.username === selectedOfferData.recipient)[0].tradeCollection._id
        const backendFunc = async() => await acceptTradeOffer(tradeId, tradeUsers.filter(userD => userD.username === otherParticipant)[0]._id, offererColId, recipientColId, loggedInUserData.user.username)
        const successFunc = () => {
            setTimeout(() => {
                revalidator.revalidate()
            }, 250)
            setStatuses({tradeStatus: 'pending', offerStatus: 'accepted'})
            toggleConfirmDecisionModal()
            //spawning alert
            const alertMessage = `Accepted the trade offer!`
            const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
            const id = addAlert(alertInfo);
            setAlertIds((prev) => [...prev, id]);
        }
        const errorFunc = (errorData) => {
            setConfirmDecisionModal({...confirmDecisionModal, error: true, errorData})
        }
        handleError(backendFunc, false, successFunc, errorFunc)
    } 
    const rejectOffer = () => {
        const offererColId = tradeUsers.filter(userD => userD.username === selectedOfferData.offerer)[0].tradeCollection._id
        const backendFunc = async() => await rejectTradeOffer(tradeId, tradeUsers.filter(userD => userD.username === otherParticipant)[0]._id, offererColId, loggedInUserData.user.username)
        const successFunc = () => {
            setTimeout(() => {
                revalidator.revalidate()
            }, 250)
            toggleConfirmDecisionModal()
            //spawning alert
            setStatuses({tradeStatus: 'rejected', offerStatus: 'rejected'})
            const alertMessage = `Rejected the trade offer!`
            const alertInfo = {severity: 'error', message: alertMessage, timeout: 3}
            const id = addAlert(alertInfo);
            setAlertIds((prev) => [...prev, id]);
        }
        const errorFunc = (errorData) => {
            setConfirmDecisionModal({...confirmDecisionModal, error: true, errorData})
        }
        handleError(backendFunc, false, successFunc, errorFunc)
    }
    const counterOffer = () => {
        navigate(`/trades/${tradeId}/counter-offer`)
    }
    const cancelTradeFunc = () => {
        const offererColId = tradeUsers.filter(userD => userD.username === selectedOfferData.offerer)[0].tradeCollection._id
        const recipientColId = tradeUsers.filter(userD => userD.username === selectedOfferData.recipient)[0].tradeCollection._id
        const backendFunc = async() => await cancelTrade(tradeId, tradeUsers.filter(userD => userD.username === otherParticipant)[0]._id, offererColId, recipientColId, loggedInUserData.user.username)
        const successFunc = () => {
            setTimeout(() => {
                revalidator.revalidate()
            }, 250)
            setStatuses({...statuses, tradeStatus: 'cancelled'})
            toggleConfirmDecisionModal()
            //spawning alert
            const alertMessage = `Cancelled the trade!`
            const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
            addAlert(alertInfo)
        }
        const errorFunc = (errorData) => {
            setConfirmDecisionModal({...confirmDecisionModal, error: true, errorData})
        }
        handleError(backendFunc, false, successFunc, errorFunc)
    }
    const markTradeAsComplete = () => {
        const tradeIsNowComplete = markedCompleteData === otherParticipant
        setMarkingComplete(true)
        if (tradeIsNowComplete) {
            const offererColId = tradeUsers.filter(userD => userD.username === selectedOfferData.offerer)[0].tradeCollection._id
            const recipientColId = tradeUsers.filter(userD => userD.username === selectedOfferData.recipient)[0].tradeCollection._id
            const backendFunc = async() => await toggleMarkedAsComplete(tradeId, tradeUsers.filter(userD => userD.username === otherParticipant)[0]._id, offererColId, recipientColId, loggedInUserData.user.username)
            const successFunc = () => {
                setTimeout(() => {
                    revalidator.revalidate()
                }, 250)
                setStatuses({...statuses, tradeStatus: 'completed'})
                setMarkingComplete(false)
                //spawning alert
                const alertMessage = `Trade is now complete! Collection updated!`
                const alertInfo = {severity: 'success', message: alertMessage, timeout: 5}
                const id = addAlert(alertInfo);
                setAlertIds((prev) => [...prev, id]);
            }
            handleError(backendFunc, false, successFunc, () => {setMarkingComplete(false)})
        } else {
            const backendFunc = async() => await toggleMarkedAsComplete(tradeId, tradeUsers.filter(userD => userD.username === otherParticipant)[0]._id, '', '', loggedInUserData.user.username)
            const successFunc = () => {
                setTimeout(() => {
                    revalidator.revalidate()
                }, 250)
                setMarkingComplete(false)
            }
            handleError(backendFunc, false, successFunc, () => {setMarkingComplete(false)})
        }
    }

    const openConfirmDecisionModal = (type) => {setConfirmDecisionModal({...confirmDecisionModal, open: true, type})}
    const toggleConfirmDecisionModal = () => {setConfirmDecisionModal({...confirmDecisionModal, open: !confirmDecisionModal.open, error: false})}

    return (
        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: '90%', height: canRespondToOffer ? '850px' : '750px', gap: 1, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px', border: `1px solid ${theme.palette.color3.dark}`, alignItems: 'start'}}>
            <Box sx={{width: '100%', mb: 1}}>
                <Select 
                    sx={{width: '70%', mt: 1, '& .MuiSelect-select': {padding: 1, px: 2, color: 'white'}, '& .MuiSelect-icon': {color: 'white'}, '& .MuiInputBase-input': {border: `2px solid ${theme.palette.color3.dark}`}}}
                    value={selectedOfferIdx}
                    onChange={(e, newValProps) => handleSelectedOfferChange(newValProps.props.value)}
                >
                    {listOfferSelectionItem()}
                </Select>
            </Box>
            {isPending ? 
            <>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '85%', gap: 5}}>
                    <Typography sx={{fontSize: '36px', color: theme.palette.color3.dark}}><i>Getting Offer Data...</i></Typography>
                    <CircularProgress size='72px'/>
                </Box>
            </> :
            errorSelection ? 
            <Box sx={{width: '100%', height: '100%', mb: 1, ...theme.components.box.fullCenterCol}}>
                <Typography sx={{fontSize: '24px', color: 'grey'}}><i>Cannot retrieve offer data</i></Typography>
            </Box> : 
            <>
            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '85%'}}>
                <Typography sx={{color: 'white', mb: 1}}>
                    {selectedOfferIdx === 0 ? 'Offer' : 'Counter-offer'} proposed by {selectedOfferData.offerer === 'deleted' ? '<Deleted User>' : selectedOfferData.offerer} on {selectedOfferData.createdAt.slice(0, 10)}
                </Typography>
                <Typography sx={{fontWeight: 700, color: 'white'}}>
                    Offer Status:
                </Typography>
                <Box sx={{width: '30%', minWidth: '150px',  height: '50px', backgroundColor: 'rgba(100, 100, 100, 0.75)', borderRadius: '10px', border: '1px solid grey', ...theme.components.box.fullCenterRow}}>
                    <Tooltip title={offerStatusTooltip[statuses.offerStatus]} arrow>
                        <Typography sx={{color: offerStatusColors[statuses.offerStatus], fontWeight: 700, ':hover': {cursor: 'pointer'}}}>
                            {offerStatusDisplay[statuses.offerStatus]}
                        </Typography>
                    </Tooltip>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '99%', gap: '5%', mt: 1}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '45%', height: '100%'}}>
                        <Typography sx={{color: 'white'}}>What they're offering:</Typography>
                        <Virtuoso 
                            totalCount={totalOffer.length}
                            style={{width: '100%', height: '100%', border: '1px solid white', borderRadius: '10px', color: 'white'}}
                            itemContent={(idx) => {
                                const offerEntity = totalOffer[idx]
                                const isPokemon = offerEntity.natDexNum !== undefined
                                return isPokemon ? listTradePokemon(offerEntity, theme, 'offering', true, true, userNameDisplaySettings) : listTradeItem(offerEntity, theme)
                            }}
                            components={{
                                Scroller: forwardRef((props, ref) => {
                                    const otherProps = {...props, ref: undefined, children: undefined, style: undefined}
                                    return <ScrollBar style={props.style} forwardedRef={ref} color={theme.palette.color2.main} children={props.children} otherProps={otherProps}/>
                                })
                            }}
                        />
                        <Box sx={{...theme.components.box.fullCenterRow, width: '100%'}}>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '50%'}}>
                                <Typography sx={{color: 'white', fontSize: '14px', mt: 0.5, textIndent: '20px'}}>{offerPokemon.length !== 0 ? `${offerPokemon.length} Aprimon${offerItemCount !== 0 ? ',' : ''} ` : ''}{offerItemCount !== 0 ? `${offerItemCount} Items ` : ''}(Value: {selectedOfferData.trade.offer.value})</Typography>
                            </Box>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'end', width: '50%', mr: '20px'}}>
                                <Tooltip title={copiedToClipboard.offer ? 'Copied!' : 'Copy to Clipboard'} arrow><Button onClick={() => copyToClipboardFunc('offer')}><ContentCopyIcon sx={{color: 'white', fontSize: '22px'}}/></Button></Tooltip>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '45%', height: '100%'}}>
                    <Typography sx={{color: 'white'}}>What they're requesting:</Typography>
                        <Virtuoso 
                            totalCount={totalReceiving.length}
                            style={{width: '100%', height: '100%', border: '1px solid white', borderRadius: '5px', color: 'white'}}
                            itemContent={(idx) => {
                                const receivingEntity = totalReceiving[idx]
                                const isPokemon = receivingEntity.natDexNum !== undefined
                                return isPokemon ? listTradePokemon(receivingEntity, theme, 'offering', true, true, userNameDisplaySettings) : listTradeItem(receivingEntity, theme)
                            }}
                            components={{
                                Scroller: forwardRef((props, ref) => {
                                    const otherProps = {...props, ref: undefined, children: undefined, style: undefined}
                                    return <ScrollBar style={props.style} forwardedRef={ref} color={theme.palette.color2.main} children={props.children} otherProps={otherProps}/>
                                })
                            }}
                        />
                        <Box sx={{...theme.components.box.fullCenterRow, width: '100%'}}>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '50%'}}>   
                                <Typography sx={{color: 'white', fontSize: '14px', mt: 0.5, textIndent: '20px'}}>{receivingPokemon.length !== 0 ? `${receivingPokemon.length} Aprimon${receivingItemCount !== 0 ? ',' : ''} ` : ''}{receivingItemCount !== 0 ? `${receivingItemCount} Items ` : ''}(Value: {selectedOfferData.trade.receiving.value})</Typography>
                            </Box>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'end', width: '50%', mr: '20px'}}>
                                <Tooltip title={copiedToClipboard.receiving ? 'Copied!' : 'Copy to Clipboard'} arrow><Button onClick={() => copyToClipboardFunc('receiving')}><ContentCopyIcon sx={{color: 'white', fontSize: '22px'}}/></Button></Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: noOfferMessage ? '50px' : '15%', mb: !canRespondToOffer ? 1 : 0}}>
                <Box sx={{height: '100%', width: '90%', borderRadius: '10px', border: `1px solid ${theme.palette.color3.dark}`, color: 'white', ...theme.components.box.fullCenterCol, justifyContent: noOfferMessage ? 'center' : 'start'}}>
                    {!noOfferMessage ?
                    <>
                    <Typography sx={{width: '100%', textAlign: 'start', fontWeight: 700, ml: 1}}>
                        Message from {selectedOfferData.offerer === 'deleted' ? '<Deleted User>' : selectedOfferData.offerer}:
                    </Typography>
                    <Typography sx={{width: '90%', mt: 1}}>
                        {selectedOfferData.comment}
                    </Typography>
                    </> : 
                    <Typography sx={{color: 'grey', width: '100%'}}><i>No offer message</i></Typography>
                    }
                </Box>
            </Box>
            {(canRespondToOffer || canMarkComplete || canCancelTrade) &&
            <Box sx={{height: '100px', width: '100%', ...theme.components.box[`fullCenter${canMarkComplete ? 'Col' : 'Row'}`], gap: 2, position: 'relative'}}>
                {canMarkComplete ?
                <>
                <Box sx={{width: '100%', height: '100%', ...theme.components.box.fullCenterCol, gap: 2}}>
                    <ToggleButton value='' onChange={markTradeAsComplete} selected={markedCompleteData === loggedInUserData.user.userData} variant='contained' sx={{backgroundColor: 'rgb(40, 167, 69)', color: 'white', py: 1, ':hover': {backgroundColor: 'rgba(40, 167, 69, 0.5)'}, '&.Mui-disabled': {backgroundColor: 'rgba(40, 167, 69, 0.75)', color: 'white'}}} disabled={markingComplete}>
                        {
                            markingComplete ? (markedCompleteAlready ? <>Marking Incomplete<DotWaitingText/></>  : <>Marking Complete<DotWaitingText/></> ) : 
                            markedCompleteAlready ? 'Mark Incomplete' : 'Mark as Complete'
                        }
                    </ToggleButton>
                    <Typography sx={{fontSize: '12px', color: 'white', mt: -1.5}}>
                        {markedCompleteAlready ? 'You have marked this trade as complete!' : 
                            !otherUserHasntMarkedComplete ? `${otherParticipant} has marked this trade as complete!` : 
                            'Neither user has marked this trade as complete!'
                        } 
                    </Typography>
                </Box>
                {canCancelTrade && <Button onClick={() => openConfirmDecisionModal('cancel')} variant='contained' sx={{backgroundColor: 'rgb(150, 12, 28)', ':hover': {backgroundColor: 'rgba(150, 12, 28, 0.5)'}, position: 'absolute', right: '20px', top: '12.5px'}}>Cancel Trade</Button>}
                </> :
                canCancelTrade ? 
                    <Button onClick={() => openConfirmDecisionModal('cancel')} variant='contained' sx={{backgroundColor: 'rgb(150, 12, 28)', ':hover': {backgroundColor: 'rgba(150, 12, 28, 0.5)'}, position: 'absolute', right: '20px', top: '12.5px'}}>Cancel Trade</Button> : 
                canRespondToOffer && 
                <>
                <Button onClick={() => openConfirmDecisionModal('accept')} variant='contained' sx={{backgroundColor: 'rgb(40, 167, 69)', ':hover': {backgroundColor: 'rgba(40, 167, 69, 0.5)'}}}>Accept Offer</Button>
                <Button onClick={() => openConfirmDecisionModal('reject')} variant='contained' sx={{backgroundColor: 'rgb(220, 53, 69)', ':hover': {backgroundColor: 'rgba(220, 53, 69, 0.5)'}}}>Reject Offer</Button>
                {numOfOffers === 5 ? 
                <Tooltip title='Maximum number of offers reached. You have to make a decision!'>
                    <Button disabled variant='contained' sx={{backgroundColor: 'rgb(0, 123, 255)', ':hover': {backgroundColor: 'rgba(0, 123, 255, 0.5)'}}}>Counter-Offer</Button>    
                </Tooltip> :
                <Button onClick={counterOffer} variant='contained' sx={{backgroundColor: 'rgb(0, 123, 255)', ':hover': {backgroundColor: 'rgba(0, 123, 255, 0.5)'}}}>Counter-Offer</Button>
                }
                </>
                }
            </Box>
            }
            </> 
            }
            {(canRespondToOffer || canCancelTrade) &&
                <ConfirmDecisionModal 
                    text={`You are about to ${confirmDecisionModal.type} this trade${confirmDecisionModal.type === 'cancel' ? '' : ' offer'}.`}
                    subText='Are you sure you want to proceed with this?'
                    confirmDecisionFunc={confirmDecisionModal.type === 'accept' ? acceptOffer : confirmDecisionModal.type === 'reject' ? rejectOffer : cancelTradeFunc}
                    toggleModal={toggleConfirmDecisionModal}
                    open={confirmDecisionModal.open}
                    state2={confirmDecisionModal.error ? 
                        () => {
                            return (
                                <>
                                <Typography sx={{fontSize: '24px', textAlign: 'center'}}>ERROR {confirmDecisionModal.errorData.status}: {confirmDecisionModal.errorData.name}</Typography>
                                <Typography sx={{mt: 1, textAlign: 'center'}}>
                                    {confirmDecisionModal.errorData.message}
                                </Typography>
                                <Typography sx={{mt: 1, textAlign: 'center'}}>
                                    Try again later!
                                </Typography>
                                </>
                            )
                        }  : undefined
                    }
                    noPendingPage={true}
                />
            }
        </Box>
    )
}