import {Box, Typography, useTheme, Button, Modal, Fade, Backdrop, Tabs, Tab, Tooltip} from '@mui/material'
import hexToRgba from 'hex-to-rgba'
import ControlledTextInput from '../../../components/functionalcomponents/controlledtextinput'
import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import ImgData from '../../../components/collectiontable/tabledata/imgdata'
import { selectSpecificRelativeValue } from '../../../app/selectors/tradeselectors'
import { reFormatToIndividual } from '../../../../utils/functions/comparecollections/comparison'
import { Virtuoso } from 'react-virtuoso'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import { items } from '../../../../../common/infoconstants/miscconstants.mjs'
import CountDownButton from '../partialcomponents/countdownbutton'

export default function FinalizeTrade({selectedColDisplay, proposedValues}) {
    const theme = useTheme()
    const offeringPokemon = useSelector((state) => state.tradeOffer.offering)
    const receivingPokemon = useSelector((state) => state.tradeOffer.receiving)
    const offeringItems = useSelector((state) => state.tradeOffer.offeringItems)
    const receivingItems = useSelector((state) => state.tradeOffer.receivingItems)

    const [detailsModal, setDetailsModal] = useState({open: false, screen: 'offering', subTab: 'pokemon', countDown: false, second: 5, canConfirm: false})
    const [message, setMessage] = useState('')
    
    const offeringPCount = offeringPokemon.map(p => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const receivingPCount = receivingPokemon.map(p => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const offeringItemCount = offeringItems.map(i => i.qty).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const receivingItemCount = receivingItems.map(i => i.qty).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const pokemonRelValue = useSelector((state) => selectSpecificRelativeValue(state, proposedValues, 'pokemon'))
    const itemRelValue = useSelector((state) => selectSpecificRelativeValue(state, proposedValues, 'items'))

    const toggleModal = (screen, closingConfirmScreen) => {
        const changeScreen = screen !== undefined ? {screen} : {}
        const countDownToggle = closingConfirmScreen ? {countDown: false, canConfirm: false} : {}
        setDetailsModal({...detailsModal, open: !detailsModal.open, ...changeScreen, ...countDownToggle})
    }
    const changeScreen = (newScreen) => {
        setDetailsModal({...detailsModal, screen: newScreen})
    }
    const changeTab = (newTab) => {
        setDetailsModal({...detailsModal, subTab: newTab})
    }
    const confirmOfferButton = () => {
        setDetailsModal({...detailsModal, screen: 'confirm', open: !detailsModal.open, countDown: true, second: 5})
    }
    const changeSecond = (second) => {setDetailsModal((curr) => {return {...curr, second}})}
    const changeCanConfirm = () => {setDetailsModal((curr) => {return {...curr, canConfirm: true, countDown: false}})}

    const shownListOfModal = detailsModal.screen === 'offering' ? (detailsModal.subTab === 'pokemon' ? offeringPokemon : offeringItems) : (detailsModal.subTab === 'pokemon' ? receivingPokemon : receivingItems)
    const shownListOfModalValue = detailsModal.screen === 'offering' ? (detailsModal.subTab === 'pokemon' ? pokemonRelValue.offer : itemRelValue.offer) : (detailsModal.subTab === 'pokemon' ? pokemonRelValue.receiving : itemRelValue.receiving)
    const shownListOfModalFormatted = detailsModal.subTab === 'item' ? shownListOfModal : reFormatToIndividual(shownListOfModal, true)

    const changeMessage = (newVal) => {newVal.length <= 200 ? setMessage(newVal) : null}

    const listPokemon = (p) => {
        const nameDisplay = `${capitalizeFirstLetter(p.ball)} ${p.name}`
        // const sizeScaling = displayName.length >= 18 && displayName.length < 35 ? 'small' : displayName.length >= 35 ? 'smaller' : 'regular'
        // const nameSizeAdjust = sizeScaling === 'small' ? {fontSize: '10px'} : sizeScaling === 'smaller' ? {fontSize: '8.5px'} : {fontSize: '12px'}
        return (
            <Box sx={{...theme.components.box.fullCenterRow, height: '25px', width: '100%', borderRadius: '3px', backgroundColor: theme.palette.color1.main, my: 0.5}}>
                <Box sx={{width: '70%', height: '100%', ...theme.components.box.fullCenterRow, justifyContent: 'start', ml: 1}}>
                    <Box sx={{width: '12%'}}>
                        <Typography sx={{fontSize: '12px', mr: 1}}>#{p.natDexNum}</Typography>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow}}>
                        <ImgData type='ball' linkKey={p.ball} size='24px'/>
                        <ImgData linkKey={p.id}/>
                    </Box>
                    <Typography sx={{textAlign: 'center', fontSize: '12px', ml: 1}}>{nameDisplay}</Typography>
                    {p.onhandId !== undefined && <Typography sx={{textAlign: 'center', fontSize: '12px', ml: 0.5}}>(On-Hand)</Typography>}
                </Box>
                <Box sx={{width: '30%', height: '100%', ...theme.components.box.fullCenterRow, justifyContent: 'end', mr: 0.5}}>
                    {p.isHA !== undefined && <Typography sx={{fontSize: '12px', opacity: p.isHA ? 1 : 0.5, fontWeight: p.isHA ? 700 : 400, mx: 0.5}}>HA</Typography>}
                    {p.emCount !== undefined && <Typography sx={{fontSize: '12px', opacity: p.emCount !== 0? 1 : 0.5, fontWeight: p.emCount !== 0 ? 700 : 400, mx: 0.5}}>{p.emCount}EM</Typography>}
                    {p.wanted === true && 
                        <Tooltip title={`This is marked as 'Highly Wanted' in ${detailsModal.screen === 'offering' ? 'their' : 'your'} collection.`}>
                            <Typography sx={{fontSize: '10px', mx: 0.5, ':hover': {cursor: 'pointer'}}}>WANT</Typography>
                        </Tooltip>
                    }
                    {p.for !== undefined && 
                        <Tooltip title={`This is an equivalent pokemon. ${detailsModal.screen === 'offering' ? 'They' : 'You'} are looking for ${p.for}`}>
                            <Typography sx={{fontSize: '10px', mx: 0.5, ':hover': {cursor: 'pointer'}}}>EQ</Typography>
                        </Tooltip>
                    }
                </Box>
            </Box>
        )
    }
    const listItem = (i) => {
        const nameDisplay = items.filter(item => item.value === i.name)[0].display
        return (
            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', height: '25px', width: '100%', borderRadius: '3px', backgroundColor: theme.palette.color1.main, my: 0.5}}>
                <Box sx={{...theme.components.box.fullCenterRow, ml: 4}}>
                <ImgData type='items' linkKey={i.name} size='24px'/>
                <Typography sx={{ml: 1, fontSize: '12px'}}>{nameDisplay} x<b>{i.qty}</b></Typography>
                </Box>
            </Box>
        )
    }
    const itemContentFunc = detailsModal.subTab === 'item' ? listItem : listPokemon
    return (
        <>
        <Box sx={{width: '100%', overflow: 'hidden', ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Typography><b>Your Selected Collection:</b> {selectedColDisplay}</Typography>
            <Typography sx={{mt: 1}}><b>Final Offer:</b></Typography>
            <Box sx={{width: '90%', height: '50%', ...theme.components.box.fullCenterCol}}>
                <Box sx={{...theme.components.box.fullCenterRow}}>
                    <Typography><b>Offering:</b> {offeringPCount} Aprimon ({pokemonRelValue.offer}), {offeringItemCount} Items ({itemRelValue.offer})</Typography>
                    <Button size='small' sx={{padding: 0, ml: 2, px: 1}} variant='contained' onClick={() => toggleModal('offering')}>See details</Button>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow}}>
                    <Typography><b>Receiving:</b> {receivingPCount} Aprimon ({pokemonRelValue.receiving}), {receivingItemCount} Items ({itemRelValue.receiving})</Typography>
                    <Button size='small' sx={{padding: 0, ml: 2, px: 1}} variant='contained' onClick={() => toggleModal('receiving')}>See details</Button>
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
        <Modal
            aria-labelledby='select-pokemon-ball-combos'
            aria-describedby='exclude specific unwanted pokemon/ball combinations'
            open={detailsModal.open}
            onClose={() => toggleModal(undefined, detailsModal.screen === 'confirm')}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={detailsModal.open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: detailsModal.screen === 'confirm' ? '400px' : '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    {(detailsModal.screen === 'offering' || detailsModal.screen === 'receiving') ?
                    <>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '8%', width: '95%', ...theme.components.box.fullCenterRow}}>
                        <Typography sx={{fontSize: '32px', fontWeight: 700}}>{detailsModal.screen === 'offering' ? 'Offering' : 'Receiving'}</Typography>
                        <Box sx={{width: 0, height: '100%', position: 'relative', ...theme.components.box.fullCenterCol}}>
                            <Button 
                                sx={{position: 'absolute', left: '50px', padding: 0, fontSize: '12px', width: '100px'}} 
                                size='small' 
                                variant='contained' 
                                onClick={() => changeScreen(detailsModal.screen === 'offering' ? 'receiving' : 'offering')}
                            >
                                {detailsModal.screen === 'offering' ? 'See Receiving' : 'See Offering'}
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '90%', width: '95%', mt: 1, ...theme.components.box.fullCenterCol}}>
                        <Tabs value={detailsModal.subTab} onChange={(e, newVal) => changeTab(newVal)}>
                            <Tab value='pokemon' label='Pokemon Offer'/>
                            <Tab value='item' label='Item Offer'/>
                        </Tabs>
                        <Typography sx={{my: 2}}>Estimated Value: {shownListOfModalValue}</Typography>
                        <Virtuoso 
                            totalCount={shownListOfModalFormatted.length}
                            style={{height: '480px', width: '90%', border: '1px solid white', borderRadius: '5px'}}
                            itemContent={(idx) => itemContentFunc(shownListOfModalFormatted[idx])}
                        />
                    </Box>
                    </> : 
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '95%', width: '95%', ...theme.components.box.fullCenterCol}}>
                        <Typography sx={{fontSize: '24px'}}>Would you like to send the trade offer?</Typography>
                        <Typography sx={{mt: 1, textAlign: 'center'}}>
                            Once you confirm the trade offer, any on-hand pokemon you are offering will be marked as "reserved" and will not be tradeable.
                        </Typography>
                        <Box sx={{...theme.components.box.fullCenterRow, gap: 5, mt: 5}}>
                            <Button variant='contained' size='large' onClick={() => toggleModal(undefined, true)}>No</Button>
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
                                handleChange={() => {}}
                                handleChangeSecond={changeSecond}
                                handleCanConfirmChange={changeCanConfirm}
                                second={detailsModal.second}
                                isCounting={detailsModal.countDown}
                                canConfirm={detailsModal.canConfirm}
                            />
                        </Box>
                    </Box>
                    }
                </Box>
            </Fade>
        </Modal>
        </>
    )
}