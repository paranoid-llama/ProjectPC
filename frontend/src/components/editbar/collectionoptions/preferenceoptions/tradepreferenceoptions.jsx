import {Box, Typography, Button, ToggleButton, Grid, Tooltip, Select, MenuItem} from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import HelpIcon from '@mui/icons-material/Help'
import {useState, useEffect, useContext} from 'react'
import { AlertsContext } from '../../../../alerts/alerts-context'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import { useDispatch, useSelector } from 'react-redux'
import { changeModalState } from '../../../../app/slices/editmode'
import { setTradePreferencesState } from '../../../../app/slices/collectionstate'
import { backendChangeOptions } from '../../../../../utils/functions/backendrequests/collectionoptionsedit'
import SaveChangesConfirmModal from '../savechangesconfirmmodal'

export default function TradePreferenceOptions({elementBg, collectionId, isHomeCollection, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const preferencesInit = useSelector((state) => state.collectionState.options.tradePreferences)
    const [preferences, setPreferences] = useState({pref: {...preferencesInit, rates: undefined}, saveChangesConfirmOpen: false})

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

    const buttonStyles = {
        opacity: 0.5,
        fontWeight: 700,
        '&.MuiButtonBase-root': {color: 'white', border: '1px solid white'},
        '&.MuiButtonBase-root:hover': {opacity: 0.8},
        '&.Mui-selected': {backgroundColor: 'rgba(40,63,87,1)', opacity: 1},
        '&.Mui-selected:hover': {backgroundColor: 'rgba(40,63,87,0.8)'},
        '&:hover': {backgroundColor: 'inherit'}
    }

    const closeSaveChangesConfirm = () => {
        setPreferences({...preferences, saveChangesConfirmModal: false})
    }

    const handleChange = (field, newValue) => {
        const actualValue = field === 'items' ? newValue.props.value : newValue
        setPreferences({...preferences, pref: {...preferences.pref, [field]: actualValue}})
    }

    const changePreferencesSave = (saveButtonSelected, nextScreen) => {
        const noChangesMade = (preferencesInit.status === preferences.pref.status) && (preferencesInit.size === preferences.pref.size) && (preferencesInit.onhandOnly === preferences.pref.onhandOnly) && (preferencesInit.items === preferences.pref.items)
        if (saveButtonSelected && noChangesMade) {
            setPreferences({...preferences, saveErrorNotice: true})
            setTimeout(() => {
                setPreferences((curr) => {return {...curr, saveErrorNotice: false}})
            }, 3000)
        } else if (!noChangesMade) {
            setPreferences({...preferences, saveChangesConfirmOpen: true, saveButtonSelected, nextScreen})
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
            const newPreferences = {...preferencesInit, status: preferences.pref.status, size: preferences.pref.size, onhandOnly: preferences.pref.onhandOnly, items: preferences.pref.items}
            setPreferences({...preferences, saving: true})
            setTimeout(() => {
                if (demo) {
                    dispatch(setTradePreferencesState(newPreferences))

                    //spawning alert
                    const alertMessage = `Set Trade Preferences!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    addAlert(alertInfo);
                    // setAlertIds((prev) => [...prev, id]);
                    dispatch(changeModalState({open: false}))
                } else {
                   const backendReq = async() => await backendChangeOptions('preferences', {newPreferences}, collectionId)
                    const successFunc = () => {
                        dispatch(setTradePreferencesState(newPreferences))

                        //spawning alert
                        const alertMessage = `Set Trade Preferences!`
                        const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                        addAlert(alertInfo);
                        // setAlertIds((prev) => [...prev, id]);
                        dispatch(changeModalState({open: false}))
                    }
                    handleError(backendReq, false, successFunc, () => {dispatch(changeModalState({open: false}))}) 
                }
            }, 1000)
        } else if (nextScreen === 'goBack') {
            setPreferences({...preferences, saveChangesConfirmOpen: false})
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    const disabledStyles = preferences.pref.status === 'closed' ? {pointerEvents: 'none', opacity: 0.5} : {}
    const onHandOnlyTooltip = 'Indicates whether you want to only offer pokemon that you have on-hand, which are listed separately to everyone'

    const disabledItemSelection = isHomeCollection ? {filter: 'blur(10px)', pointerEvents: 'none'} : {}

    return (
        <>
        <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center', mb: 1}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: sw ? '13px' : '1rem'}} onClick={() => changePreferencesSave(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: sw ? '13px' : '1rem'}} onClick={() => changePreferencesSave(false, 'tradePreferences')}>Trade Preferences</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1}}>Preferences</Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1}}>
            <Box sx={{width: '100%', height: '20%', display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center'}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700}}>Trade Status</Typography>
                <Box sx={{width: '100%', height: '50%', display: 'flex', justifyContent: 'center', gap: 4}}>
                    <ToggleButton sx={buttonStyles} value='open' selected={preferences.pref.status === 'open'} onChange={(e, newValue) => handleChange('status', newValue)}>
                        Open
                    </ToggleButton>
                    <ToggleButton sx={buttonStyles} value='closed' selected={preferences.pref.status === 'closed'} onChange={(e, newValue) => handleChange('status', newValue)}>
                        Closed
                    </ToggleButton>
                </Box>
            </Box>
            <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center', ...disabledStyles}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700}}>Trade Size</Typography>
                <Grid container sx={{width: '100%', height: '80%', display: 'flex', justifyContent: 'center'}}>
                    <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton sx={{padding: 1, fontSize: '12px', ...buttonStyles}} value='any' selected={preferences.pref.size === 'any'} onChange={(e, newValue) => handleChange('size', newValue)}>
                            Any
                        </ToggleButton>
                    </Grid>
                    <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton sx={{padding: 1, fontSize: '12px', ...buttonStyles}} value='small preferred' selected={preferences.pref.size === 'small preferred'} onChange={(e, newValue) => handleChange('size', newValue)}>
                            Small Preferred
                        </ToggleButton>
                    </Grid>
                    <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton sx={{padding: 1, fontSize: '12px', ...buttonStyles}} value='small only' selected={preferences.pref.size === 'small only'} onChange={(e, newValue) => handleChange('size', newValue)}>
                            Small Only
                        </ToggleButton>
                    </Grid>
                    <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton sx={{padding: 1, fontSize: '12px', ...buttonStyles}} value='large preferred' selected={preferences.pref.size === 'large preferred'} onChange={(e, newValue) => handleChange('size', newValue)}>
                            Large Preferred
                        </ToggleButton>
                    </Grid>
                    <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton sx={{padding: 1, fontSize: '12px', ...buttonStyles}} value='large only' selected={preferences.pref.size === 'large only'} onChange={(e, newValue) => handleChange('size', newValue)}>
                            Large Only
                        </ToggleButton>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{width: '100%', height: '20%', display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center', ...disabledStyles}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, mt: 0.5, position: 'relative'}}>
                    On-Hand Trades Only
                    <Tooltip describeChild title={onHandOnlyTooltip} sx={{position: 'absolute', height: '16px', top: '-5px', right: '-25px'}}>
                        <HelpIcon/>
                    </Tooltip>
                </Typography>
                <Box sx={{width: '100%', height: '60%', display: 'flex', justifyContent: 'center', gap: 4}}>
                    <ToggleButton sx={buttonStyles} value='yes' selected={preferences.pref.onhandOnly === 'yes'} onChange={(e, newValue) => handleChange('onhandOnly', newValue)}>
                        Yes
                    </ToggleButton>
                    <ToggleButton sx={buttonStyles} value='no' selected={preferences.pref.onhandOnly === 'no'} onChange={(e, newValue) => handleChange('onhandOnly', newValue)}>
                        No
                    </ToggleButton>
                    <ToggleButton sx={buttonStyles} value='preferred' selected={preferences.pref.onhandOnly === 'preferred'} onChange={(e, newValue) => handleChange('onhandOnly', newValue)}>
                        Preferred
                    </ToggleButton>
                </Box>
            </Box>
            <Box sx={{width: '100%', height: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', ...disabledStyles, position: 'relative'}}>
            {isHomeCollection && <Typography sx={{position: 'absolute', fontSize: '12px', top: '25%', right: '25%', fontWeight: 700, width: '50%', height: '50%', textAlign: 'center'}}>Item trading is disabled in <br></br>HOME collections</Typography>}
                <Typography sx={{fontSize: '14px', fontWeight: 700, mt: 0.5, ...disabledItemSelection}}>Item Trading:</Typography>
                <Select 
                    value={preferences.pref.items}
                    onChange={(e, newValue) => handleChange('items', newValue)}
                    sx={{width: sw ? '80%' : '50%', height: sw ? 'auto' : '100%', ...disabledItemSelection, '& .MuiSelect-select': {padding: 0.5, py: 1, color: 'white', border: '1px solid white'}}}
                >
                    <MenuItem value='none'>Not looking to trade items</MenuItem>
                    <MenuItem value='lf'>I'm looking for items</MenuItem>
                    <MenuItem value='ft'>I have items to offer</MenuItem>
                    <MenuItem value='lf/ft'>I'm looking for items and have items to offer</MenuItem>
                </Select>
            </Box>
        </Box>
        
        <Box sx={{mt: 1, height: sw ? '45px' : '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: sw ? '5%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changePreferencesSave(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: sw ? '35%' : '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size={sw ? 'large' : 'small'} variant='contained' sx={{py: 0, fontSize: sw ? '20px' : '15px'}} onClick={() => changePreferencesSave(true, 'tradePreferences')}>Save</Button>
            </Box>
            {preferences.saveErrorNotice && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: sw ? 1 : 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700, textAlign: 'center'}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        <SaveChangesConfirmModal 
            open={preferences.saveChangesConfirmOpen}
            modalScreen='preferences'
            saveButtonSelected={preferences.saveButtonSelected}
            nextScreen={preferences.nextScreen}
            handleChange={finalizeChanges}
            closeModal={closeSaveChangesConfirm}
            saving={preferences.saving}
            sw={sw}
        />
        </>
    )
}