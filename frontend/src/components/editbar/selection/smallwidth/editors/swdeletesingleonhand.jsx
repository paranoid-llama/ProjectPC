import {Box, Typography, useTheme, Button} from '@mui/material'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import { useRouteLoaderData } from 'react-router'
import { useDispatch } from 'react-redux'
import { removeOnHandPokemonFromList } from '../../../../../app/slices/collectionstate'
import { deleteOnHandPutRequest } from '../../../../../../utils/functions/backendrequests/deleteonhand'
import { deselect } from '../../../../../app/slices/editmode'
import { ErrorContext } from '../../../../../app/contexts/errorcontext'
import { AlertsContext } from '../../../../../alerts/alerts-context'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'
import { useState, useContext } from 'react'

export default function SWDeleteSingleOnHand({handleClose, pokemonName, dexNum, ball, imgLink, isHA, emCount, gender, isMaxEMs, pokemonId, collectionID, demo, isHomeCollection, additionalDispatchProps={}, additionalSuccessFunction=null}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const userData = useRouteLoaderData('root').user
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)

    const [isDeleting, setIsDeleting] = useState(false)
    const haStyles= isHA ? {fontWeight: 700} : {opacity: 0.5}
    const emStyles = isMaxEMs ? {fontWeight: 700} : emCount === 0 ? {opacity: 0.5} : {}

    const deleteAndClose = () => {
        setIsDeleting(true)
        const backendFunc = async() => await deleteOnHandPutRequest(pokemonId, collectionID)
        const successFunc = () => {
            if (additionalSuccessFunction) {
                additionalSuccessFunction()
            } else {
                dispatch(deselect()) 
            }

            dispatch(removeOnHandPokemonFromList({pokemonid: pokemonId, ...additionalDispatchProps})) //list display state - refer to slice

            setIsDeleting(false)
            handleClose()
            //spawning alert
            const alertMessage = `Deleted ${capitalizeFirstLetter(ball)} ${pokemonName}`
            const alertInfo = {severity: 'success', message: alertMessage, timeout: 3, messageImgs: [{type: 'ball', linkKey: ball}, {type: 'poke', linkKey: imgLink}]}
            addAlert(alertInfo);
        }
        if (demo) {
            successFunc()
        } else {
            handleError(backendFunc, false, successFunc, () => {handleClose()})
        }
    }

    return (
        <>
        <Box sx={{...modalStyles.onhand.modalElementBg, width: '90%'}}>
            <Typography variant='body1' align='center' sx={{padding: '10px'}}>Are you sure you want to delete this pokemon?</Typography>
        </Box>
        <Box sx={{...modalStyles.onhand.modalElementBg, height: '85%', width: '90%', marginTop: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{height: '40%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <ImgData type='ball' linkKey={ball} size='50px'/><Box sx={{width: '5%'}}></Box><ImgData linkKey={imgLink} size='50px'/>
            </Box>
            <Box sx={{height: '30%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{textAlign: 'center', fontSize: '24px'}}>{capitalizeFirstLetter(ball)} Ball {(gender !== 'none' && gender !== 'unknown') && <ImgData type='gender' linkKey={gender} size='20px'/>} {getNameDisplay(userData === undefined ? undefined : userData.settings.display.pokemonNames, pokemonName, dexNum)}</Typography>
            </Box>
            <Box sx={{height: '15%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {isHA !== undefined && <Typography sx={haStyles}>{isHA === false ? 'Non-HA' : 'HA'}</Typography>}
                {isHA !== undefined && emCount !== undefined && <Box sx={{width: '5%'}}></Box>}
                {(emCount !== undefined && !isHomeCollection) && <Typography sx={emStyles}>{emCount}EM</Typography>}
            </Box>
            <Box sx={{height: '20%', width: '90%', my: '15px', display: 'flex'}}>
                <Button variant='contained' sx={{width: '40%', mr: '20%'}} onClick={deleteAndClose}>{isDeleting ?  'Deleting..' : 'Yes'}</Button>
                <Button variant='contained' sx={{width: '40%'}} onClick={handleClose}>No</Button>
            </Box>
        </Box>
        
        </>
    )
}