import {Modal, Fade, Backdrop, Box, Typography, Button} from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useContext, useRef } from 'react'
import { AlertsContext } from '../../../alerts/alerts-context'
import { changeModalState } from '../../../app/slices/editmode'
import { setNameState } from '../../../app/slices/options'
import { backendChangeOptions } from '../../../../utils/functions/backendrequests/collectionoptionsedit'
import ControlledTextInput from '../../functionalcomponents/controlledtextinput'
import SaveChangesConfirmModal from './savechangesconfirmmodal'

export default function OtherOptions({elementBg, collectionId, collectionType}) {
    const dispatch = useDispatch()
    const collectionNameState = useSelector((state) => state.options.collectionName)
    const collectionNameRef = useRef(collectionNameState)

    const [otherOptions, setOtherOptions] = useState({deleteCollectionModal: false, saveChangesConfirmOpen: false})

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
        setOtherOptions({...otherOptions, saveChangesConfirmOpen: false})
    }

    const toggleDeleteCollectionModal = () => {
        setOtherOptions({...otherOptions, deleteCollectionModal: !otherOptions.deleteCollectionModal})
    }

    const changeOptions = (saveButtonSelected, nextScreen) => {
        const noNameChanges = collectionNameRef === collectionNameState
        const noChangesMade = noNameChanges
        if (saveButtonSelected && noChangesMade) {
            setOtherOptions({...otherOptions, saveErrorNotice: true})
            setTimeout(() => {
                setOtherOptions((curr) => {return {...curr, saveErrorNotice: false}})
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
            setOtherOptions({...otherOptions, saving: true})
            setTimeout(() => {
                backendChangeOptions('name', {name: newName}, collectionId)
                dispatch(setNameState(newName))

                //spawning alert
                const alertMessage = `Set Trade Rates!`
                const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                const id = addAlert(alertInfo);
                setAlertIds((prev) => [...prev, id]);

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
                        helperText: `If empty: 'twentyfourcharacteryesno's ${collectionType}'`,
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