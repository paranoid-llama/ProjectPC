import {Box, Typography, useTheme, Button, Modal, Fade, Backdrop, Tabs, Tab, Tooltip, CircularProgress} from '@mui/material'
import hexToRgba from 'hex-to-rgba'
import ControlledTextInput from '../../../components/functionalcomponents/controlledtextinput'
import { useNavigate, Link, useRouteLoaderData } from 'react-router-dom'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay'
import { useSelector } from 'react-redux'
import { useState, useEffect, useContext, useRef, startTransition } from 'react'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import ImgData from '../../../components/collectiontable/tabledata/imgdata'
import { selectSpecificRelativeValue } from '../../../app/selectors/tradeselectors'
import { reFormatToIndividual } from '../../../../utils/functions/comparecollections/comparison'
import { Virtuoso } from 'react-virtuoso'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import { items } from '../../../../common/infoconstants/miscconstants.mjs'
import CountDownButton from '../partialcomponents/countdownbutton'
import TradeDetailsModal from '../partialcomponents/tradedetailsmodal'
import { newTradeBackendFormatting, newTradeBackend } from '../../../../utils/functions/backendrequests/trades/newtrade'
import { counterTradeOffer } from '../../../../utils/functions/backendrequests/trades/traderesponse'

export default function FinalizeTrade({selectedColDisplay, proposedValues, traderId, ownerId, traderUsername, ownerUsername, traderGen, ownerGen, isCounteroffer, tradeId, traderColId, ownerColId}) {
    const theme = useTheme()
    const nameDisplaySettings = useRouteLoaderData('root').user.settings.display.pokemonNames
    const navigate = useNavigate()
    const {handleError} = useContext(ErrorContext)
    const offeringPokemon = useSelector((state) => state.tradeOffer.offering)
    const receivingPokemon = useSelector((state) => state.tradeOffer.receiving)
    const offeringItems = useSelector((state) => state.tradeOffer.offeringItems)
    const receivingItems = useSelector((state) => state.tradeOffer.receivingItems)

    const [detailsModal, setDetailsModal] = useState({open: false, screen: 'offering', subTab: 'pokemon', finalizeScreenOpen: false, countDown: false, second: 5, canConfirm: false})
    const [message, setMessage] = useState('')
    const [newTradeId, setNewTradeId] = useState({pending: false, id: '', countDown: false, second: 5})
    
    const offeringPCount = offeringPokemon.map(p => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const receivingPCount = receivingPokemon.map(p => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const offeringItemCount = offeringItems.map(i => i.qty).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const receivingItemCount = receivingItems.map(i => i.qty).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const pokemonRelValue = useSelector((state) => selectSpecificRelativeValue(state, proposedValues, 'pokemon'))
    const itemRelValue = useSelector((state) => selectSpecificRelativeValue(state, proposedValues, 'items'))
    const totalOfferValue = parseFloat(pokemonRelValue.offer) + parseFloat(itemRelValue.offer)
    const totalReceivingValue = parseFloat(pokemonRelValue.receiving) + parseFloat(itemRelValue.receiving)
    // console.log(pokemonRelValue)
    // console.log(itemRelValue)

    const cannotFinalizeTrade = (offeringPCount === 0 && offeringItemCount === 0) && (receivingPCount === 0 && receivingItemCount === 0)
    //you can have trades where one person offers nothing, just not any trades where both sides offer nothing 

    const toggleDetailsModal = (screen) => {
        const switchScreen = screen !== undefined ? {screen} : {}
        setDetailsModal({...detailsModal, open: !detailsModal.open, ...switchScreen})
    }

    const toggleConfirmModal = (closingScreen=false) => {
        const countDownToggle = closingScreen ? {countDown: false, canConfirm: false} : {countDown: true}
        setDetailsModal({...detailsModal, finalizeScreenOpen: !detailsModal.finalizeScreenOpen, ...countDownToggle})
    }
    const changeScreen = (newScreen) => {
        setDetailsModal({...detailsModal, screen: newScreen})
    }
    const changeTab = (newTab) => {
        setDetailsModal({...detailsModal, subTab: newTab})
    }
    const confirmOfferButton = () => {
        setDetailsModal({...detailsModal, finalizeScreenOpen: !detailsModal.finalizeScreenOpen, countDown: true, second: 5})
    }
    const changeSecond = (second) => {setDetailsModal((curr) => {return {...curr, second}})}
    const changeCanConfirm = () => {setDetailsModal((curr) => {return {...curr, canConfirm: true, countDown: false}})}

    const backendCreateTrade = async(offer, receiving, gen) => {
        const backendFunc = async() => await newTradeBackend(offer, receiving, message, traderId, ownerId, traderUsername, ownerUsername, gen, traderColId)
        const successFunc = (newTradeId) => {setNewTradeId({pending: false, id: newTradeId, countDown: true, second: 5})}
        const errorFunc = (errorData) => {setNewTradeId({...newTradeId, pending: false, error: true, errorData})}
        handleError(backendFunc, false, successFunc, errorFunc)
    }

    const finalizeAndCreateTrade = async() => {
        if (isCounteroffer) {
            const {offer, receiving, gen} = newTradeBackendFormatting(offeringPokemon, offeringItems, receivingPokemon, receivingItems, totalOfferValue, totalReceivingValue, traderGen, ownerGen)
            const offerBackendFormat = {
                status: 'pending',
                offerer: traderUsername,
                recipient: ownerUsername,
                comment: message,
                trade: {
                    offer,
                    receiving
                }
            }
            setNewTradeId({...newTradeId, pending: true})
            const backendFunc = async() => await counterTradeOffer(tradeId, ownerId, traderColId, ownerColId, offerBackendFormat, traderUsername)
            const successFunc = () => {
                setTimeout(() => {
                    setNewTradeId({pending: false, id: tradeId, countDown: true, second: 5})
                }, 500) 
            }
            const errorFunc = (errorData) => {setNewTradeId({...newTradeId, pending: false, error: true, errorData})}
            handleError(backendFunc, false, successFunc, errorFunc)
        } else {
            const {offer, receiving, gen} = newTradeBackendFormatting(offeringPokemon, offeringItems, receivingPokemon, receivingItems, totalOfferValue, totalReceivingValue, traderGen, ownerGen)
            setNewTradeId({...newTradeId, pending: true})
            setTimeout(() => {
                backendCreateTrade(offer, receiving, gen)
            }, 500)
        }
        
    }

    const shownListOfModal = detailsModal.screen === 'offering' ? (detailsModal.subTab === 'pokemon' ? offeringPokemon : offeringItems) : (detailsModal.subTab === 'pokemon' ? receivingPokemon : receivingItems)
    const shownListOfModalValue = detailsModal.screen === 'offering' ? (detailsModal.subTab === 'pokemon' ? pokemonRelValue.offer : itemRelValue.offer) : (detailsModal.subTab === 'pokemon' ? pokemonRelValue.receiving : itemRelValue.receiving)
    const shownListOfModalFormatted = detailsModal.subTab === 'item' ? shownListOfModal : reFormatToIndividual(shownListOfModal, true)

    const changeMessage = (newVal) => {newVal.length <= 200 ? setMessage(newVal) : null}

    const tradeCreationPending = newTradeId.pending === true
    const tradeCompletedCreation = newTradeId.id !== ''
    const tradeCreationError = newTradeId.error

    useEffect(() => {
        if (newTradeId.countDown === true) {
            if (newTradeId.second !== 0) {
                setTimeout(() => {
                    setNewTradeId({...newTradeId, second: newTradeId.second-1})
                }, 1000)
            } else {
                setTimeout(() => {
                    navigate(`/trades/${newTradeId.id}`)
                }, 1000)
            }
        }
    }, [newTradeId.countDown, newTradeId.second])

    return (
        <>
        <Box sx={{width: '100%', overflow: 'hidden', ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Typography><b>Your Selected Collection:</b> {selectedColDisplay}</Typography>
            <Typography sx={{mt: 1}}><b>Final Offer:</b></Typography>
            <Box sx={{width: '90%', height: '50%', ...theme.components.box.fullCenterCol}}>
                <Box sx={{...theme.components.box.fullCenterRow}}>
                    <Typography><b>Offering:</b> {offeringPCount} Aprimon ({pokemonRelValue.offer}), {offeringItemCount} Items ({itemRelValue.offer})</Typography>
                    <Button size='small' sx={{padding: 0, ml: 2, px: 1}} variant='contained' onClick={() => toggleDetailsModal('offering')}>See details</Button>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow}}>
                    <Typography><b>Receiving:</b> {receivingPCount} Aprimon ({pokemonRelValue.receiving}), {receivingItemCount} Items ({itemRelValue.receiving})</Typography>
                    <Button size='small' sx={{padding: 0, ml: 2, px: 1}} variant='contained' onClick={() => toggleDetailsModal('receiving')}>See details</Button>
                </Box>
            </Box>
            <Typography sx={{mt: 2, fontWeight: 700}}>Provide Message (optional):</Typography>
            <Box sx={{position: 'relative', width: '80%'}}>
            <ControlledTextInput
                textFieldProps={{
                    multiline: true,
                    rows: 4,
                    placeholder: 'explanation for certain offer/receiving choices'
                }}
                textFieldStyles={{
                    '&.MuiTextField-root': {
                        width: '100%',
                        border: '1px solid white',
                        borderRadius: '5px',
                        my: 2
                    },
                    '& .MuiInputBase-input': {
                        color: 'white',
                        '&::-webkit-scrollbar': {
                            width: '0.3em'
                        },
                        '&::-webkit-scrollbar-track': {
                            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: hexToRgba(theme.palette.color1.dark, 0.75),
                            borderRadius: '5px'   
                        },
                    }
                }}
                charLimit={200}
                defaultValue={message}
                controlInputFunc={changeMessage}
            />
            <Typography sx={{position: 'absolute', left: 0, top: '90%', color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: message.length === 200 ? 700 : 400}}><i>{message.length}/200</i></Typography>
            </Box>
            <Button size='large' variant='contained' sx={{my: 2}} onClick={confirmOfferButton}>Confirm Offer</Button>
        </Box>
        <TradeDetailsModal 
            offerData={{
                pokemonValue: pokemonRelValue.offer,
                itemValue: itemRelValue.offer,
                pokemon: offeringPokemon,
                items: offeringItems
            }}
            receivingData={{
                pokemonValue: pokemonRelValue.receiving,
                itemValue: itemRelValue.receiving,
                pokemon: receivingPokemon,
                items: receivingItems
            }}
            currentScreen={detailsModal.screen}
            subTab={detailsModal.subTab}
            isTradeSummaryScreen={false}
            open={detailsModal.open}
            toggleModal={toggleDetailsModal}
            changeScreen={changeScreen}
            changeTab={changeTab}
            nameDisplaySettings={nameDisplaySettings}
        />
        <Modal
            aria-labelledby='confirm-trade'
            aria-describedby='confirm and finalize a trade offer'
            open={detailsModal.finalizeScreenOpen}
            onClose={() => toggleConfirmModal(true)}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={detailsModal.finalizeScreenOpen}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '400px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '95%', width: '95%', ...theme.components.box.fullCenterCol}}>
                        {cannotFinalizeTrade ? 
                        <>
                        <Typography sx={{fontSize: '24px'}}>You cannot finalize the trade!</Typography>
                        <Typography sx={{mt: 1, textAlign: 'center'}}>
                            Neither side is offering anything!
                        </Typography>
                        <Button sx={{mt: 5}} variant='contained' size='large' onClick={() => toggleConfirmModal(true)}>Close</Button>
                        </> : 
                        tradeCreationPending ? 
                        <>
                            <Typography sx={{fontSize: '24px', mb: 5}}>Sending Trade Offer...</Typography>
                            <CircularProgress/>
                        </>: 
                        tradeCreationError ? 
                        <>
                            <Typography sx={{fontSize: '24px', mb: 2}}>There was a problem with the trade offer!</Typography>
                            <Typography sx={{fontSize: '16px', color: 'rgb(200, 50, 50)'}}><b>ERROR {newTradeId.errorData.status}:</b> {newTradeId.errorData.name}</Typography>
                            <Typography sx={{fontSize: '16px', color: 'rgb(200, 50, 50)'}}>{newTradeId.errorData.message}</Typography>
                            <Button onClick={finalizeAndCreateTrade} sx={{fontSize: '16px', mt: 2}}>Try Again</Button>
                        </> : 
                        tradeCompletedCreation ? 
                        <>
                            <Typography sx={{fontSize: '24px', mb: 1}}>Trade Offer Sent!</Typography>
                            <Typography sx={{mb: 1, textAlign: 'center'}}>
                                You will be re-directed to the trade summary page in {newTradeId.second}...
                            </Typography>
                            <Typography sx={{textAlign: 'center'}}>
                                Alternatively, you can <Link to={`/trades/${newTradeId.id}`}>click here</Link> to redirect immediately.
                            </Typography>
                        </> :
                        <>
                        <Typography sx={{fontSize: '24px'}}>Would you like to send the trade offer?</Typography>
                        <Typography sx={{mt: 1, textAlign: 'center'}}>
                            Once you confirm the trade offer, any on-hand pokemon you are offering will be marked as "reserved" and will not be tradeable.
                        </Typography>
                        <Box sx={{...theme.components.box.fullCenterRow, gap: 5, mt: 5}}>
                            <Button variant='contained' size='large' onClick={() => toggleConfirmModal(true)}>No</Button>
                            <CountDownButton 
                                buttonProps={{
                                    variant: 'contained',
                                    size: 'large',
                                    sx: {
                                        '&.Mui-disabled': {
                                            color: 'rgba(255, 255, 255, 0.5)'
                                        }
                                    }
                                }}
                                buttonLabel='Yes'
                                handleChange={finalizeAndCreateTrade}
                                handleChangeSecond={changeSecond}
                                handleCanConfirmChange={changeCanConfirm}
                                second={detailsModal.second}
                                isCounting={detailsModal.countDown}
                                canConfirm={detailsModal.canConfirm}
                            />
                        </Box>
                        </>
                        }
                    </Box>
                </Box>
            </Fade>
        </Modal>
        </>
    )
}