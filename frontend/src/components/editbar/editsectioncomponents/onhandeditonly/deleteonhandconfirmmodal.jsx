import { useTransition, useState, useContext, useEffect } from 'react'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import {AlertsContext} from '../../../../alerts/alerts-context'
import {useDispatch} from 'react-redux'
import {Modal, Box, Backdrop, Fade, Typography, Button} from '@mui/material'
import modalStyles from '../../../../../utils/styles/componentstyles/modalstyles'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import { deleteOnHand } from '../../../../app/slices/onhand'
import { deselect } from '../../../../app/slices/editmode'
import { removePokemonFromList } from '../../../../app/slices/listdisplay'
import { deleteOnHandPutRequest } from '../../../../../utils/functions/backendrequests/deleteonhand'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'

export default function DeleteOnHandConfirm({open, handleClose, pokemonName, ball, imgLink, isHA, emCount, gender, isMaxEMs, pokemonId, collectionID}) {

    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)

    const [alertIds, setAlertIds] = useState([])
    const {addAlert, dismissAlert} = useContext(AlertsContext)

    const [isDeleting, setIsDeleting] = useState(false)

    const haStyles= isHA ? {fontWeight: 700} : {opacity: 0.5}
    const emStyles = isMaxEMs ? {fontWeight: 700} : emCount === 0 ? {opacity: 0.5} : {}

    const deleteAndClose = () => {
        setIsDeleting(true)
        const backendFunc = async() => await deleteOnHandPutRequest(pokemonId, collectionID)
        const successFunc = () => {
            dispatch(deselect()) 

            dispatch(removePokemonFromList({pokemonid: pokemonId, listType: 'onhand'})) //list display state - refer to slice
            // dispatch(deleteOnHand(pokemonId)) //onhand pokemon state //brings an error when deleting it from this part of the state. same effect is brought if this is left out, though its less cleaner
            //might be useful to leave this out as it leaves the option to revert changes if user wants to manually save (not have auto-save)
            
            
            setTimeout(() => {
                dispatch(deleteOnHand(pokemonId))
            }, 500)
            // setting timeout to update onhand pokemon state for each individual row actually works with only one re-render on the deleted row and re-renders on the other row (which should be normal)
            // do not know why it works this way but hey it does
            
            //spawning alert
            const alertMessage = `Deleted ${capitalizeFirstLetter(ball)} ${pokemonName}`
            const alertInfo = {severity: 'success', message: alertMessage, timeout: 3, messageImgs: [{type: 'ball', linkKey: ball}, {type: 'poke', linkKey: imgLink}]}
            const id = addAlert(alertInfo);
            setAlertIds((prev) => [...prev, id]);
        }
        setTimeout(() => {
            handleError(backendFunc, false, successFunc, () => {})
            handleClose()
            
        }, 1000)
        
    }

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

    return (
        <>
        <Modal
            aria-labelledby='delete-onhand-confirm'
            aria-describedby='confirm-the-deletion-of-an-onhand-pokemon'
            open={open}
            onClose={isDeleting ? null : handleClose}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >  
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '30%', width: '40%', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '90%'}}>
                        <Typography variant='body1' align='center' sx={{padding: '10px'}}>Are you sure you want to delete this pokemon?</Typography>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '55%', width: '90%', marginTop: '5px', display: 'flex', flexDirection: 'column'}}>
                        <Box sx={{height: '40%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <ImgData type='ball' linkKey={ball}/><Box sx={{width: '5%'}}></Box><ImgData linkKey={imgLink}/>
                        </Box>
                        <Box sx={{height: '30%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Typography>{capitalizeFirstLetter(ball)} Ball {gender !== 'none' && <ImgData type='gender' linkKey={gender} size='20px'/>} {pokemonName}</Typography>
                        </Box>
                        <Box sx={{height: '25%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {isHA !== undefined && <Typography sx={haStyles}>{isHA === false ? 'Non-HA' : 'HA'}</Typography>}
                            {isHA !== undefined && emCount !== undefined && <Box sx={{width: '5%'}}></Box>}
                            {emCount !== undefined && <Typography sx={emStyles}>{emCount}EM</Typography>}
                        </Box>
                    </Box>
                    <Box sx={{height: '10%', width: '90%', marginTop: '7px', display: 'flex'}}>
                        <Button variant='contained' onClick={deleteAndClose}>{isDeleting ?  'Deleting..' : 'Yes'}</Button>
                        <Box sx={{width: '80%', height: '100%'}}></Box>
                        <Button variant='contained' onClick={handleClose}>No</Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
        </>
    )
}

