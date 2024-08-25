import {Box, Typography, useTheme, Button, Grid, Paper, styled, TextField, Tabs, Tab} from '@mui/material'
import ImgData from '../../collectiontable/tabledata/imgdata'
import { NumericFormat } from 'react-number-format'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setItems } from '../../../app/slices/tradeoffer'
import { items } from '../../../../common/infoconstants/miscconstants.mjs'
import NumericTextField from '../numerictextfield'

const Item = styled(Paper)(() => ({
    backgroundColor: 'transparent',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    textAlign: 'center',
    color: 'inherit',
    fontFamily: 'Arial',
    padding: '5%'
}));

export default function SetItems({userColPreferences, ownerColPreferences, ownerName, allowItemTrading, allowUserOffer, allowOwnerOffer, allowHandleChange, tabStyles, isCounteroffer}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [offerTab, setOfferTab] = useState('offering')
    const offeringItemsState = useSelector((state) => state.tradeOffer.offeringItems)
    const receivingItemsState = useSelector((state) => state.tradeOffer.receivingItems)
    const userNotTradingItems = userColPreferences.items === 'none' //give option for the user to trade items anyway
    const ownerNotTradingItems = ownerColPreferences.items === 'none'

    const ownerNotLooking = !ownerColPreferences.items.includes('lf')
    const userNotOffering = !userColPreferences.items.includes('ft')
    const userOfferableItems = (!ownerNotLooking && !userNotOffering) && Object.keys(userColPreferences.ftItems).filter(item => ownerColPreferences.lfItems.includes(item))
    const userCantOfferItems = ownerNotLooking || userNotOffering //note if the owner is looking we give the option to the user to offer items anyway

    const ownerNotOffering = !ownerColPreferences.items.includes('ft')
    const userNotLooking = !userColPreferences.items.includes('lf')
    const ownerOfferableItems = (!ownerNotLooking && !userNotOffering) && Object.keys(ownerColPreferences.ftItems).filter(item => userColPreferences.lfItems.includes(item))
    const ownerCantOfferItems = ownerNotOffering || userNotLooking //note if the owner is offering we give the option to the user to request items anyway

    const dispatchItemChange = (newQty, itemValueName, incrementOrDecrement=false, upperLimit, isIncrement, currValue) => {
        const adjustedNewQty = newQty === '' ? isIncrement ? 1 : 0 : parseInt(newQty)
        const validatedNewQty = adjustedNewQty >= 0 && adjustedNewQty <= upperLimit
        if (!incrementOrDecrement) {
            const realValue = validatedNewQty ? adjustedNewQty : (adjustedNewQty < 0 || newQty === '') ? 0 : adjustedNewQty > upperLimit ? upperLimit : 0
            dispatch(setItems({itemValueName, newQty: realValue, tradeSide: offerTab}))
        } else {
            const actionFails = adjustedNewQty < 0 || adjustedNewQty > upperLimit
            if (actionFails) {
                null
            } else {
                dispatch(setItems({itemValueName, newQty: adjustedNewQty, tradeSide: offerTab}))
            }
        }
    }
    return (
        <>
        <Tabs sx={{width: '80%', height: '10px', ...tabStyles}} value={offerTab} onChange={(e, newVal) => setOfferTab(newVal)}>
            <Tab value='offering' label='Offer Items'/>
            <Tab value='receiving' label='Receive Items'/>
        </Tabs>
        <Box sx={{width: '98%', height: '690px', border: `1px solid ${theme.palette.color3.main}`, borderRadius: '5px', mt: 1, ...theme.components.box.fullCenterCol}}>
            {((userNotTradingItems && !allowItemTrading) || ownerNotTradingItems) ?
            <>
            <Typography sx={{fontSize: '24px', color: 'grey'}}><i>{ownerNotTradingItems ? `${ownerName} is not looking to trade items` : 'You are not looking to trade items'}</i></Typography>
            {(userNotTradingItems && !ownerNotTradingItems) && <Button onClick={() => {allowHandleChange('item')}}>Trade Items Anyway</Button>}
            </> :
            <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '90%'}}>
                {offerTab === 'offering' &&
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '100%'}}>
                    <Typography sx={{fontWeight: 700, fontSize: '24px'}}>Offer Items</Typography>
                    <Box sx={{height: '90%', width: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
                        {(userCantOfferItems && (!allowUserOffer && !(allowItemTrading && userNotOffering))) ? 
                        <>
                        <Typography sx={{fontSize: '18px', color: 'grey'}}><i>{ownerNotLooking ? `${ownerName} is not looking for any items` : userNotOffering ? 'You are not offering any items' : "You are not offering any items that they're looking for"}</i></Typography>
                        {((userNotOffering) && !ownerNotLooking) && <Button onClick={() => {allowHandleChange('userOffer')}}>Offer Items Anyway</Button>}
                        </> :
                        <>
                        <Typography sx={{height: '10%', fontSize: '16px'}}>{ownerName} is looking for the following items:</Typography>
                        <Grid container sx={{display: 'flex', justifyContent: 'center', height: '50%', width: '100%'}} spacing={1}>
                            {ownerColPreferences.lfItems.map(item => {
                                const userHasItem = userColPreferences.ftItems[item] !== undefined
                                const userStock = userHasItem && userColPreferences.ftItems[item] === 0 ? 'indeterminate' : userColPreferences.ftItems[item]
                                const upperLimit = typeof userStock === 'number' ? userStock : 999
                                const itemDisplay = items.filter(itemData => itemData.value === item)[0].display
                                const currentQty = offeringItemsState.filter(itemData => itemData.name === item)[0] === undefined ? 0 : offeringItemsState.filter(itemData => itemData.name === item)[0].qty
                                const itemStyles = userHasItem || currentQty > 0 ? {} : {opacity: 0.5}
                                
                                return (
                                    <Grid item xs={2.5} key={`offer-${item}-button`}>
                                        <Item sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', backgroundColor: theme.palette.color2.main, minHeight: '130px', ...itemStyles}}>
                                            <Typography sx={{fontSize: '14px', my: 1}}>{itemDisplay}</Typography>
                                            <ImgData type='items' linkKey={item} size='28px'/>
                                            {!userHasItem ? <Typography sx={{fontSize: '11px', height: '25px'}}>You do not have this item!</Typography> : 
                                                <Typography sx={{fontSize: '11px', height: '25px'}}>Stock: {userStock}</Typography>
                                            }
                                            <NumericTextField 
                                                width={'100%'}
                                                textFieldStyles={{mt: 1, height: '10%'}}
                                                value={currentQty}
                                                handleChange={(newQty) => dispatchItemChange(newQty, item, false, upperLimit, false, currentQty)}
                                                onClickArrowUp={() => dispatchItemChange(currentQty+1, item, true, upperLimit, true, currentQty)}
                                                onClickArrowDown={() => dispatchItemChange(currentQty-1, item, true, upperLimit, false, currentQty)}
                                                upperLimit={upperLimit}
                                                isAllowedFunc={(values) => {
                                                    const {floatValue} = values
                                                    return floatValue <= upperLimit || floatValue === undefined
                                                }}
                                            />
                                        </Item>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        </>
                        }
                    </Box>
                </Box>
                }
                {offerTab === 'receiving' && 
                <Box sx={{...theme.components.box.fullCenterCol, width: '80%', height: '80%'}}>
                    <Typography sx={{fontWeight: 700, fontSize: '24px'}}>Receive Items</Typography>
                    <Box sx={{height: '90%', width: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
                        {(ownerCantOfferItems && (!allowOwnerOffer && !(allowItemTrading && userNotLooking))) ? 
                        <>
                        <Typography sx={{fontSize: '18px', color: 'grey'}}><i>{ownerNotOffering ? `${ownerName} is not offering any items` : userNotLooking ? 'You are not looking for any items' : "They are not offering any items that you're looking for"}</i></Typography>
                        {((userNotLooking) && !ownerNotOffering) && <Button onClick={() => {allowHandleChange('ownerOffer')}}>Receive Items Anyway</Button>}
                        </> :
                        <>
                        <Typography sx={{height: '10%', fontSize: '16px'}}>{ownerName} can offer the following items:</Typography>
                        <Grid container sx={{...theme.components.box.fullCenterRow, height: '90%', width: '100%'}} spacing={1}>
                            {Object.keys(ownerColPreferences.ftItems).map(item => {
                                const userWantsItem = userColPreferences.lfItems.includes(item)
                                const ownerStock = ownerColPreferences.ftItems[item] === 0 ? 'indeterminate' : ownerColPreferences.ftItems[item]
                                const upperLimit = typeof ownerStock === 'number' ? ownerStock : 999
                                const itemDisplay = items.filter(itemData => itemData.value === item)[0].display
                                const currentQty = receivingItemsState.filter(itemData => itemData.name === item)[0] === undefined ? 0 : receivingItemsState.filter(itemData => itemData.name === item)[0].qty
                                const itemStyles = userWantsItem || currentQty > 0 ? {} : {opacity: 0.5}
                                
                                return (
                                    <Grid item xs={2.5} key={`receive-${item}-button`}>
                                        <Item sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', backgroundColor: theme.palette.color2.main, minHeight: '130px', ...itemStyles}}>
                                            <Typography sx={{fontSize: '14px', my: 1}}>{itemDisplay}</Typography>
                                            <ImgData type='items' linkKey={item} size='28px'/>
                                            {!userWantsItem ? <Typography sx={{fontSize: '11px', height: '25px'}}>You aren't looking for this item!</Typography> : 
                                                <Typography sx={{fontSize: '11px', height: '25px'}}>Stock: {ownerStock}</Typography>
                                            }
                                            <NumericTextField 
                                                width={'100%'}
                                                textFieldStyles={{mt: 1, height: '10%'}}
                                                value={currentQty}
                                                handleChange={(newQty) => dispatchItemChange(newQty, item, false, upperLimit, false, currentQty)}
                                                onClickArrowUp={() => dispatchItemChange(currentQty+1, item, true, upperLimit, true, currentQty)}
                                                onClickArrowDown={() => dispatchItemChange(currentQty-1, item, true, upperLimit, false, currentQty)}
                                                upperLimit={upperLimit}
                                                isAllowedFunc={(values) => {
                                                    const {floatValue} = values
                                                    return floatValue <= upperLimit || floatValue === undefined
                                                }}
                                            />
                                        </Item>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        </>}
                    </Box>
                </Box>
                }
            </Box>
            }
            
        </Box>
        </>
    )
}