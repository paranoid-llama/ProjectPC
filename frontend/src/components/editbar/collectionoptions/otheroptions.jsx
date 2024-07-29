import {Modal, Fade, Backdrop, Box, Typography, Button, ToggleButton, ToggleButtonGroup} from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useContext, useRef } from 'react'
import { AlertsContext } from '../../../alerts/alerts-context'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { changeModalState } from '../../../app/slices/editmode'
import { setNameState, setGlobalDefaultState } from '../../../app/slices/options'
import { backendChangeOptions } from '../../../../utils/functions/backendrequests/collectionoptionsedit'
import ControlledTextInput from '../../functionalcomponents/controlledtextinput'
import SaveChangesConfirmModal from './savechangesconfirmmodal'

export default function OtherOptions({elementBg, collectionId, collectionGen, collectionType, owner}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const collectionNameState = useSelector((state) => state.options.collectionName)
    const globalDefaultInit = useSelector((state) => state.options.globalDefaults)
    const collectionNameRef = useRef(collectionNameState)

    const [otherOptions, setOtherOptions] = useState({globalDefaults: globalDefaultInit, deleteCollectionModal: false, saveChangesConfirmOpen: false})

    const buttonStyles = {
        '&.MuiToggleButton-root': {
            borderColor: 'rgba(230,230,230, 0.5)',
            color: 'white',
            '&:hover': {
                backgroundColor: 'rgba(64, 224, 208, 0.2)'
            }
        },
        '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }
    }

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

    const changeGlobalDefault = (field, newVal) => {
        setOtherOptions({...otherOptions, globalDefaults: {...otherOptions.globalDefaults, [field]: newVal}})
    }

    const closeSaveChangesConfirm = () => {
        setOtherOptions({...otherOptions, saveChangesConfirmOpen: false})
    }

    const toggleDeleteCollectionModal = () => {
        setOtherOptions({...otherOptions, deleteCollectionModal: !otherOptions.deleteCollectionModal})
    }

    const changeOptions = (saveButtonSelected, nextScreen) => {
        const noNameChanges = collectionNameRef.current.value === collectionNameState
        const noGlobalDefaultChanges = (globalDefaultInit.isHA === otherOptions.globalDefaults.isHA) && (globalDefaultInit.emCount === otherOptions.globalDefaults.emCount)
        const noChangesMade = noNameChanges && noGlobalDefaultChanges
        if (saveButtonSelected && noChangesMade) {
            setOtherOptions({...otherOptions, saveErrorNoticeShow: true})
            setTimeout(() => {
                setOtherOptions((curr) => {return {...curr, saveErrorNoticeShow: false}})
            }, 3000)
        } else if (!noChangesMade) {
            setOtherOptions({...otherOptions, saveChangesConfirmOpen: true, saveButtonSelected, nextScreen})
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
            const newName = collectionNameRef.current.value
            const noNameChanges = collectionNameRef === collectionNameState
            const noGlobalDefaultChanges = (globalDefaultInit.isHA === otherOptions.globalDefaults.isHA) && (globalDefaultInit.emCount === otherOptions.globalDefaults.emCount)
            setOtherOptions({...otherOptions, saving: true})
            setTimeout(() => {
                const backendType = noNameChanges && !noGlobalDefaultChanges ? 'globalDefault' : 'name'
                const info = noNameChanges && !noGlobalDefaultChanges ? {globalDefault: otherOptions.globalDefaults} : !noNameChanges && noGlobalDefaultChanges ? {name: newName} : {name: newName, globalDefault: otherOptions.globalDefaults}
                const backendFunc = async() => await backendChangeOptions(backendType, info, collectionId)
                
                const successFunc = () => {
                    if (!noNameChanges && !noGlobalDefaultChanges) {
                        // backendChangeOptions('name', {name: newName, globalDefault: otherOptions.globalDefaults}, collectionId)
                        dispatch(setNameState({name: newName, globalDefault: otherOptions.globalDefaults}))
                    } else if (!noNameChanges) {
                        // backendChangeOptions('name', {name: newName}, collectionId)
                        dispatch(setNameState({name: newName}))
                    } else if (!noGlobalDefaultChanges) {
                        // backendChangeOptions('globalDefault', {globalDefault: otherOptions.globalDefaults}, collectionId)
                        dispatch(setGlobalDefaultState(otherOptions.globalDefaults))
                    }

                    //spawning alert
                    const alertMessage = `Set Other Options!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
                }

                handleError(backendFunc, false, successFunc, () => {})
                dispatch(changeModalState({open: false}))
            }, 1000)
        } else if (nextScreen === 'goBack') {
            setOtherOptions({...otherOptions, saveChangesConfirmOpen: false})
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    const isHomeCollection = collectionGen === 'home'
    const disabledEMSelection = isHomeCollection ? {filter: 'blur(10px)', pointerEvents: 'none'} : {}

    return (
        <>
        <Box sx={{...elementBg, width: '95%', height: '35px', display: 'flex', alignItems: 'center', mb: 1}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeOptions(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1}}>Other Options</Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '95%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{width: '90%', height: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: -1}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, marginRight: 1}}>Collection Name:</Typography>
                <ControlledTextInput
                    textFieldProps={{
                        size: 'small',
                        FormHelperTextProps: {
                            sx: {fontSize: '10px', height: 2, color: 'white'}
                        },
                        helperText: `If empty: '${owner}'s ${collectionType}'`,
                        inputRef:  collectionNameRef
                    }}
                    textFieldStyles={{
                        width: '70%',
                        '& .MuiInputBase-input': {
                            color: 'white',
                            py: 0.5
                        }
                    }}
                    defaultValue={collectionNameState}
                    charLimit={60}
                />
            </Box>
            <Box sx={{width: '90%', height: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: -1}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, marginRight: 1}}>Global Defaults:</Typography>
                <Box sx={{display: 'flex', flexDirection: 'row', width: '100%', height: '90%'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%'}}>
                        <Typography sx={{fontSize: '14px', mb: 1, fontWeight: 700}}>Hidden Ability</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <ToggleButtonGroup exclusive value={otherOptions.globalDefaults.isHA} onChange={(e, newVal) => changeGlobalDefault('isHA', newVal)}>
                            <ToggleButton sx={{fontSize: '12px', ...buttonStyles}} value={true}>
                                HA
                            </ToggleButton>
                            <ToggleButton sx={{fontSize: '12px', ...buttonStyles}} value={false}>
                                Non-HA
                            </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: '100%', position: 'relative'}}>
                    {isHomeCollection && <Typography sx={{position: 'absolute', fontSize: '12px', top: '25%', right: '20%', fontWeight: 700, width: '70%', height: '50%', textAlign: 'center'}}>Egg Moves are disabled in <br></br>HOME collections</Typography>}
                        <Typography sx={{fontSize: '14px', mb: 1, fontWeight: 700, ...disabledEMSelection}}>Egg Move Count</Typography>
                        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', ...disabledEMSelection}}>
                            {Array.from(Array(5).keys()).map((emCount, idx) => {
                                return (
                                    <ToggleButton sx={{fontSize: '12px', mx: 0.5, ...buttonStyles}} value={emCount} selected={otherOptions.globalDefaults.emCount === emCount} onChange={(e, newVal) => changeGlobalDefault('emCount', newVal)} key={`global-default-emCount-${emCount}`}>
                                        {emCount}
                                    </ToggleButton>
                                )
                            })}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{width: '90%', height: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Button sx={{backgroundColor: '#ED4337', color: 'white'}} onClick={toggleDeleteCollectionModal}>Delete Collection</Button>
            </Box>
        </Box>
        <Box sx={{mt: 1, height: '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeOptions(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeOptions(true, 'main')}>Save</Button>
            </Box>
            {otherOptions.saveErrorNoticeShow && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        {/* <Modal                               come back to this modal once you setup users and trades, so you can setup deleting the collection references in both of them
            aria-labelledby={`confirm delete collection`}
            aria-describedby={`confirm the decision to delete your collection`}
            open={otherOptions.deleteCollectionModal}
            onClose={toggleDeleteCollectionModal}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }} 
        >

        </Modal> */}
        <SaveChangesConfirmModal 
            open={otherOptions.saveChangesConfirmOpen}
            modalScreen='other'
            saveButtonSelected={otherOptions.saveButtonSelected}
            nextScreen={otherOptions.nextScreen}
            handleChange={finalizeChanges}
            closeModal={closeSaveChangesConfirm}
            saving={otherOptions.saving}
        />
        </>
    )
}