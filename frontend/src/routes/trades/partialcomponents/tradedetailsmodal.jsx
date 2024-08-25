import {Box, Typography, useTheme, Modal, Fade, Backdrop, Button, Tabs, Tab, Tooltip} from '@mui/material'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import { useEffect, forwardRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import ScrollBar from '../../../components/functionalcomponents/scrollbar'
import { items } from '../../../../common/infoconstants/miscconstants.mjs'
import ImgData from '../../../components/collectiontable/tabledata/imgdata'
import { reFormatToIndividual } from '../../../../utils/functions/comparecollections/comparison'
import { listTradePokemon, listTradeItem } from './listtradestuff'

export default function TradeDetailsModal({offerData, receivingData, currentScreen, subTab, isTradeSummaryScreen, open, toggleModal, changeScreen, changeTab, nameDisplaySettings}) {
    const theme = useTheme()

    const noOfferData = {
        noOfferPokemon: offerData.pokemon === undefined,
        noOfferItems: offerData.items === undefined,
        noReceivingPokemon: receivingData.pokemon === undefined,
        noReceivingItems: receivingData.items === undefined
    }

    const screenFormatted = currentScreen === 'offering' ? 'Offer' : 'Receiving'
    const disabledSubTab = isTradeSummaryScreen && {
        pokemon: noOfferData[`no${screenFormatted}Pokemon`],
        items: noOfferData[`no${screenFormatted}Items`]
    }
    
    useEffect(() => {
        if (disabledSubTab) {
            const otherTab = subTab === 'pokemon' ? 'items' : 'pokemon'
            changeTab(otherTab)
        }
    }, [currentScreen])

    const shownList = currentScreen === 'offering' ? 
        (subTab === 'pokemon' ? 
            (noOfferData.noOfferPokemon ? [] : reFormatToIndividual(offerData.pokemon, true)) :
            (noOfferData.noOfferItems ? [] : offerData.items) 
        ) : 
        (subTab === 'pokemon' ? 
            (noOfferData.noReceivingPokemon ? [] : reFormatToIndividual(receivingData.pokemon, true)) :
            (noOfferData.noReceivingItems ? [] : receivingData.items) 
        )
    const shownListValue = isTradeSummaryScreen ? (currentScreen === 'offering' ? offerData.value : receivingData.value) : 
        (currentScreen === 'offering' ? (subTab === 'pokemon' ? offerData.pokemonValue : offerData.itemValue) : (subTab === 'pokemon' ? receivingData.pokemonValue : receivingData.itemValue))
    const itemContentFunc = subTab === 'pokemon' ? listTradePokemon : listTradeItem

    return (
        <Modal
            aria-labelledby='see-trade-details'
            aria-describedby='see the details of both sides of a trade'
            open={open}
            onClose={toggleModal}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '8%', width: '95%', ...theme.components.box.fullCenterRow}}>
                        <Typography sx={{fontSize: '32px', fontWeight: 700}}>{currentScreen === 'offering' ? 'Offering' : 'Receiving'}</Typography>
                        <Box sx={{width: 0, height: '100%', position: 'relative', ...theme.components.box.fullCenterCol}}>
                            <Button 
                                sx={{position: 'absolute', left: '50px', padding: 0, fontSize: '12px', width: '100px'}} 
                                size='small' 
                                variant='contained' 
                                onClick={() => changeScreen(currentScreen === 'offering' ? 'receiving' : 'offering')}
                            >
                                {currentScreen === 'offering' ? 'See Receiving' : 'See Offering'}
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '90%', width: '95%', mt: 1, ...theme.components.box.fullCenterCol}}>
                        <Tabs value={subTab} onChange={(e, newVal) => changeTab(newVal)}>
                            <Tab value='pokemon' disabled={disabledSubTab.pokemon} label='Pokemon Offer'/>
                            <Tab value='item' disabled={disabledSubTab.items} label='Item Offer'/>
                        </Tabs>
                        <Typography sx={{my: 2}}>{isTradeSummaryScreen ? 'Total Value' : 'Estimated Value'}: {shownListValue}</Typography>
                        <Virtuoso 
                            totalCount={shownList.length}
                            style={{height: '480px', width: '90%', border: '1px solid white', borderRadius: '5px'}}
                            itemContent={(idx) => itemContentFunc(shownList[idx], theme, currentScreen, false, false, nameDisplaySettings)}
                            components={{
                                Scroller: forwardRef((props, ref) => {
                                    const otherProps = {...props, ref: undefined, children: undefined, style: undefined}
                                    return <ScrollBar style={props.style} forwardedRef={ref} color={theme.palette.color3.main} children={props.children} otherProps={otherProps}/>
                                })
                            }}
                        />
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}
