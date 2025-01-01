import {Box, Typography, Tabs, Tab, Button} from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux'
import { changeModalState } from '../../../../app/slices/editmode'
import { setRate } from '../../../../app/slices/collectionstate';
import { useState, useEffect, useContext } from 'react'
import { AlertsContext } from '../../../../alerts/alerts-context'
import { ErrorContext } from '../../../../app/contexts/errorcontext';
import IndividualRateSelection from '../../../collectioncreation/stepcomponents/optionsselection/aprimon/individualrateselection'
import { backendChangeOptions } from '../../../../../utils/functions/backendrequests/collectionoptionsedit';
import { getPossibleItems, apriballLiterals } from '../../../../../common/infoconstants/miscconstants';
import SaveChangesConfirmModal from '../savechangesconfirmmodal'

export default function RateOptions({elementBg, collectionGen, collectionId, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const ratesInit = useSelector((state) => state.collectionState.options.tradePreferences.rates)
    const items = getPossibleItems(collectionGen)
    const rateTotalItemsStep = items.map(item => apriballLiterals.includes(item.value) ? 'Apriballs' : item.display)
    const rateTotalItems = rateTotalItemsStep.filter((item, idx) => rateTotalItemsStep.indexOf(item) === idx)
    const [rates, setRates] = useState({pokemonOffers: ratesInit.pokemonOffers, itemOffers: ratesInit.itemOffers, tab: 'pokemonOffers', saveChangesConfirmOpen: false})

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

    const closeSaveChangesConfirm = () => {
        setRates({...rates, saveChangesConfirmModal: false})
    }

    const changeTab = () => {
        setRates({...rates, tab: rates.tab === 'pokemonOffers' ? 'itemOffers' : 'pokemonOffers'})
    }

    const handleRateChange = (rateIdx, creatingNew, person, itemValue, removing=false) => {
        const newRateData = [...rates[rates.tab]]
        const newItem = itemValue !== undefined && itemValue.props.value
        const updatingQuantity = !isNaN(parseInt(newItem))
        if (creatingNew) {
            newRateData[rateIdx] = {items: ['', ''], rate: [1, 1]}
        } else if (removing) {
            const finalRateData = newRateData.filter((rate, idx) => idx !== rateIdx)
            setRates({...rates, [rates.tab]: finalRateData})
            return
        } else if (updatingQuantity) {
            const userRate = person === 'user' ? newItem : newRateData[rateIdx].rate[0]
            const traderRate = person === 'trader' ? newItem : newRateData[rateIdx].rate[1]
            newRateData[rateIdx] = {...newRateData[rateIdx], rate: [userRate, traderRate]}
        } else {
            const userItem = person === 'user' ? newItem : newRateData[rateIdx].items[0]
            const traderItem = person === 'trader' ? newItem : newRateData[rateIdx].items[1]
            newRateData[rateIdx] = {...newRateData[rateIdx], items: [userItem, traderItem]}
        }
        setRates({...rates, [rates.tab]: newRateData})
    }

    const changeRatesSave = (saveButtonSelected, nextScreen) => {
        const diffPokemonOffers = !(ratesInit.pokemonOffers.length === rates.pokemonOffers.length) || (ratesInit.pokemonOffers.length === 0 && rates.pokemonOffers.length !== 0) ||
            ratesInit.pokemonOffers.map((rateInfo, rateIdx) => {
                const sameTradeItems = !rateInfo.items.map((i, iIdx) => rates.pokemonOffers[rateIdx].items[iIdx] === i).includes(false)
                const sameQtys = !rateInfo.rate.map((r, rIdx) => rates.pokemonOffers[rateIdx].rate[rIdx] === r).includes(false)
                return (sameTradeItems && sameQtys)
            }).includes(false)
        const diffItemOffers = ratesInit.itemOffers === undefined ? false : (!(ratesInit.itemOffers.length === rates.itemOffers.length) || (ratesInit.itemOffers.length === 0 && rates.itemOffers.length !== 0) ||
            ratesInit.itemOffers.map((rateInfo, rateIdx) => {
                const sameTradeItems = !rateInfo.items.map((i, iIdx) => rates.itemOffers[rateIdx].items[iIdx] === i).includes(false)
                const sameQtys = !rateInfo.rate.map((r, rIdx) => rates.itemOffers[rateIdx].rate[rIdx] === r).includes(false)
                return (sameTradeItems && sameQtys)
            }).includes(false))
        const noChangesMade = !diffPokemonOffers && !diffItemOffers
        if (saveButtonSelected && noChangesMade) {
            setRates({...rates, saveErrorNotice: true})
            setTimeout(() => {
                setRates((curr) => {return {...curr, saveErrorNotice: false}})
            }, 3000)
        } else if (!noChangesMade) {
            setRates({...rates, saveChangesConfirmOpen: true, saveButtonSelected, nextScreen})
        } else {
            if (nextScreen === 'exit') {
                dispatch(changeModalState({open: false}))
            } else {
                dispatch(changeModalState({open: true, screen: nextScreen}))
            }
        }
    }

    const finalizeChanges = (saveChanges, nextScreen) => {
        if (saveChanges) {
            const newRatesSection = {pokemonOffers: rates.pokemonOffers.filter(rate => !rate.items.map(item => item === '').includes(true)), itemOffers: ratesInit.itemOffers === undefined ? undefined : rates.itemOffers.filter(rate => !rate.items.map(item => item === '').includes(true))}
            setRates({...rates, saving: true})
            setTimeout(() => {
                if (demo) {
                    dispatch(setRate({newRates: newRatesSection}))

                    //spawning alert
                    const alertMessage = `Set Trade Rates!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
                    dispatch(changeModalState({open: false}))
                } else {
                    const backendReq = async() => await backendChangeOptions('rates', {newRates: newRatesSection}, collectionId)
                    const successFunc = () => {
                        dispatch(setRate({newRates: newRatesSection}))

                        //spawning alert
                        const alertMessage = `Set Trade Rates!`
                        const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                        const id = addAlert(alertInfo);
                        setAlertIds((prev) => [...prev, id]);
                        dispatch(changeModalState({open: false}))
                    }

                    handleError(backendReq, false, successFunc, () => {dispatch(changeModalState({open: false}))})   
                }  
            }, 1000)
        } else if (nextScreen === 'goBack') {
            setRates({...rates, saveChangesConfirmOpen: false})
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    const possibleUserItems = ['On-Hand HA Aprimon', 'HA Aprimon', 'On-Hand Non-HA Aprimon', 'Non-HA Aprimon']
    const possibleTraderPokemonItems = ['HA Aprimon', 'Non-HA Aprimon', 'Wishlist Aprimon']

    return (
        <>
        <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center', mb: 1}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeRatesSave(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeRatesSave(false, 'tradePreferences')}>Trade Preferences</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1}}>Rates</Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
            <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 1}}>Rates</Typography>
            <Typography sx={{fontSize: '14px', textAlign: 'center'}}>Select your exchange rates for trades. Up to 8 per type. All offers are organized as (You:Potential Trader)</Typography>
            <Tabs value={rates.tab} onChange={changeTab}>
                <Tab value='pokemonOffers' label='Pokemon Offers'/>
                <Tab disabled={ratesInit.itemOffers === undefined} value='itemOffers' label='Item Offers'/>
            </Tabs>
            <Box sx={{width: sw ? '100%' : '90%', height: '90%', display: 'flex', flexDirection: 'column', mt: 1}}>
                <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
                    {rates[rates.tab].map((rate, idx) => {
                        return (
                            <IndividualRateSelection 
                                key={`${rates.tab}-rate-${idx}-edit`}
                                rate={rate}
                                rateIdx={idx}
                                possibleItems1={possibleUserItems}
                                possibleItems2={rates.tab === 'pokemonOffers' ? possibleTraderPokemonItems : rateTotalItems}
                                handleChange={handleRateChange}
                                isOriginalOnHandRate={idx === 0 && rates.tab === 'pokemonOffers'}
                                divideFactor={8}
                            />
                        )
                    })}
                    {rates[rates.tab].length < 8 && 
                    <Button sx={{padding: 0, width: '90%', height: '12.5%'}} onClick={(e) => handleRateChange(rates[rates.tab].length, true, undefined, undefined, true)}>
                        <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed black', borderRadius: '5px'}}>
                            <AddCircleOutlineIcon />
                        </Box>
                    </Button>
                    }
                </Box>
            </Box>
        </Box>
        <Box sx={{mt: 1, height: sw ? '45px' : '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: sw ? '5%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeRatesSave(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: sw ? '35%' : '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size={sw ? 'large' : 'small'} variant='contained' sx={{py: 0, fontSize: sw ? '20px' : '15px'}} onClick={() => changeRatesSave(true, 'tradePreferences')}>Save</Button>
            </Box>
            {rates.saveErrorNotice && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: sw ? 1 : 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700, textAlign: 'center'}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        <SaveChangesConfirmModal 
            open={rates.saveChangesConfirmOpen}
            modalScreen='rates'
            saveButtonSelected={rates.saveButtonSelected}
            nextScreen={rates.nextScreen}
            handleChange={finalizeChanges}
            closeModal={closeSaveChangesConfirm}
            saving={rates.saving}
            sw={sw}
        />
        </>
    )
}