import {Modal, Fade, Backdrop, Box, Typography, useTheme, Button, CircularProgress} from '@mui/material'
import { useState, useContext, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AlertsContext } from '../../../../alerts/alerts-context'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import modalStyles from '../../../../../utils/styles/componentstyles/modalstyles'
import SpeciesSelect from './modalcomponents/speciesselect'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'
import { deleteOnHandPutRequest } from '../../../../../utils/functions/backendrequests/deleteonhand'
import { removeOnHandPokemonFromList } from '../../../../app/slices/collectionstate'
import { deleteOnHand } from '../../../../app/slices/onhand'
import { deselect, setDeleteOnHandMode } from '../../../../app/slices/editmode'
import EmTooltipWrapper from '../../../collectiontable/tabledata/emtooltipwrapper'
import SmallWidthModalWrapper from '../../../partials/wrappers/smallwidthmodalwrapper'

function ListDeletedOnHandPokemon({pData, theme, firstItem, onhandView}) {
    const [openEMTooltip, setOpenEMTooltip] = useState(false)

    return (
        <Box sx={{...theme.components.box.fullCenterRow, height: '50px', backgroundColor: 'rgba(225, 30, 30, 0.2)', mt: firstItem ? 0 : 1}}>
            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '70%', ml: 1}}>
                <ImgData type='poke' linkKey={pData.imgLink}/>
                <ImgData type='ball' linkKey={pData.ball}/>
                <Typography sx={{fontSize: '13px', ml: 1.5}}>{capitalizeFirstLetter(pData.ball)} {pData.name}</Typography>
            </Box>
            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'end', width: '30%', mr: 1}}>
                {(pData.gender === 'male' || pData.gender === 'female') && <ImgData type='gender' linkKey={pData.gender} size='24px'/>}
                {pData.isHA !== undefined && <Typography sx={{opacity: pData.isHA ? 1 : 0.5, fontWeight: pData.isHA ? 700 : 400, fontSize: '13px', ml: 1}}>HA</Typography>}
                {pData.emCount !== undefined && 
                    <>
                    <EmTooltipWrapper
                        emCount={pData.emCount}
                        EMs={pData.EMs}
                        open={openEMTooltip}
                        closeTooltip={() => setOpenEMTooltip(false)}
                    >
                        <Typography 
                            sx={{opacity: pData.emCount !== 0 ? 1 : 0.5, fontWeight: pData.emCount !== 0 ? 700 : 400, fontSize: '13px', ml: 1, ':hover': {cursor: 'pointer'}}} 
                            onClick={() => setOpenEMTooltip(true)}
                        >
                            {pData.emCount}EM
                        </Typography>
                    </EmTooltipWrapper>
                    </>
                }
                {onhandView === 'byPokemon' && <Typography sx={{fontSize: '13px', ml: 1}}>x{pData.qty}</Typography>}
            </Box>
        </Box>
    )
}

export default function BulkDeleteConfirm({open, toggleModal, collectionID, demo, sw}) {
    const [savePending, setSavePending] = useState(false)
    const theme = useTheme()
    const dispatch = useDispatch()
    const {addAlert} = useContext(AlertsContext)
    const {handleError} = useContext(ErrorContext)
    const totalOnhands = useSelector((state) => state.collectionState.onhand)
    const onhandView = useSelector((state) => state.collectionState.listDisplay.onhandView)
    const flaggedOnhands = useSelector((state) => state.editmode.deletedOnHandIds)
    const formattedFlaggedOhs = onhandView === 'byPokemon' && flaggedOnhands.map(p => {return {id: p.slice(0, p.indexOf(' ')), ball: p.slice(p.indexOf(' ')+1, p.length)}})
    const setToBeDeletedOhData = onhandView === 'byPokemon' ? 
        totalOnhands.filter(p => formattedFlaggedOhs.filter(p2 => p2.id === p.imgLink && p2.ball === p.ball).length !== 0) : 
        totalOnhands.filter(p => flaggedOnhands.includes(p._id))

    const listDeletedItemContent = (idx) => {
        const pData = setToBeDeletedOhData[idx]
        const firstItem = idx === 0
        return (
            <ListDeletedOnHandPokemon pData={pData} theme={theme} firstItem={firstItem} onhandView={onhandView}/>
        )
    }

    const deleteAndSave = () => {
        setSavePending(true)
        const backendFunc = async() => await deleteOnHandPutRequest(onhandView === 'byPokemon' ? setToBeDeletedOhData.map(p => p._id) : flaggedOnhands, collectionID)
        const successFunc = () => {
            dispatch(removeOnHandPokemonFromList({pokemonid: flaggedOnhands}))
            
            setSavePending(false)
            const alertInfo = {severity: 'success', timeout: 5, message: 'Deleted multiple On-Hand pokemon!'}
            addAlert(alertInfo)
            toggleModal()
        }
        if (demo) {
            successFunc()
        } else {
            const errorFunc = () => {
                setSavePending(false)
                toggleModal()
            }
            handleError(backendFunc, false, successFunc, errorFunc)
        }   
    }

    const generateModalContents = () => (
            <>
            <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%'}}>
                <Typography variant='body1' align='center' sx={{padding: '10px', fontWeight: 700}}>You are about to delete the following pokemon:</Typography>
                
            </Box>
            <Box sx={{...modalStyles.onhand.modalElementBg, ...theme.components.box.fullCenterCol, width: '95%', height: '70%', mt: 1}}>
                {setToBeDeletedOhData.length === 0 ?
                    <Typography sx={{color: 'grey'}}><i>None</i></Typography> : 
                    <SpeciesSelect 
                        onlyList={true}
                        height='100%'
                        otherStyles={{width: '100%'}}
                        totalCount={setToBeDeletedOhData.length}
                        listItemContent={listDeletedItemContent}
                    />
                }
                
            </Box>
            <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '8%', mt: 1}}>
                <Typography variant='body1' align='center' sx={{padding: '10px', fontWeight: 700}}>{setToBeDeletedOhData.length === 0 ? 'Please flag some pokemon for deletion and try again!' : 'Are you sure you want to proceed?'}</Typography>
            </Box>
            {setToBeDeletedOhData.length === 0 && <Button size='large' sx={{mt: 1}} variant='contained' disabled={savePending} onClick={toggleModal}>Back</Button>}
            {setToBeDeletedOhData.length !== 0 &&
            <Box sx={{...theme.components.box.fullCenterRow, gap: 20, mt: 1}}>
                <Button  sx={{'& .Mui-disabled': {color: 'white'}}} size='large' variant='contained' disabled={savePending} onClick={toggleModal}>No</Button>
                <Button size='large' variant='contained' disabled={savePending} onClick={deleteAndSave}>{savePending ? <CircularProgress size='29px'/> : 'Yes'}</Button>
            </Box>
            }
            </>
    )

    const generateModal = () => (
        sw ? 
        <SmallWidthModalWrapper 
            ariaLabel={'bulk-delete-onhand-confirm'}
            ariaDescribe={'confirm-the-deletion-of-all-flagged-onhand-pokmeon'}
            open={open}
            handleClose={savePending ? null : toggleModal}
            sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', pt: 0.5}}
        >
            {generateModalContents()}
        </SmallWidthModalWrapper> : 
        <Modal
            aria-labelledby='bulk-delete-onhand-confirm'
            aria-describedby='confirm-the-deletion-of-all-flagged-onhand-pokmeon'
            open={open}
            onClose={savePending ? null : toggleModal}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '55%', width: '60%', maxWidth: '700px', display: 'flex', alignItems: 'center'}}>
                {generateModalContents()}
                </Box>
            </Fade>
        </Modal>
    )

    return (
        generateModal()
        // <Modal
        // aria-labelledby='bulk-delete-onhand-confirm'
        // aria-describedby='confirm-the-deletion-of-all-flagged-onhand-pokmeon'
        // open={open}
        // onClose={savePending ? null : toggleModal}
        // closeAfterTransition
        // slots={{backdrop: Backdrop}}
        // slotProps={{
        //     backdrop: {
        //         timeout: 500
        //     }
        // }}
        // >
        //     <Fade in={open}>
        //         <Box sx={{...modalStyles.onhand.modalContainer, height: '55%', width: '60%', maxWidth: '700px', display: 'flex', alignItems: 'center'}}>
        //             <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%'}}>
        //                 <Typography variant='body1' align='center' sx={{padding: '10px', fontWeight: 700}}>You are about to delete the following pokemon:</Typography>
                        
        //             </Box>
        //             <Box sx={{...modalStyles.onhand.modalElementBg, ...theme.components.box.fullCenterCol, width: '95%', height: '70%', mt: 1}}>
        //                 {setToBeDeletedOhData.length === 0 ?
        //                     <Typography sx={{color: 'grey'}}><i>None</i></Typography> : 
        //                     <SpeciesSelect 
        //                         onlyList={true}
        //                         height='100%'
        //                         otherStyles={{width: '100%'}}
        //                         totalCount={setToBeDeletedOhData.length}
        //                         listItemContent={listDeletedItemContent}
        //                     />
        //                 }
                        
        //             </Box>
        //             <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '8%', mt: 1}}>
        //                 <Typography variant='body1' align='center' sx={{padding: '10px', fontWeight: 700}}>{setToBeDeletedOhData.length === 0 ? 'Please flag some pokemon for deletion and try again!' : 'Are you sure you want to proceed?'}</Typography>
        //             </Box>
        //             {setToBeDeletedOhData.length === 0 && <Button size='large' sx={{mt: 1}} variant='contained' disabled={savePending} onClick={toggleModal}>Back</Button>}
        //             {setToBeDeletedOhData.length !== 0 &&
        //             <Box sx={{...theme.components.box.fullCenterRow, gap: 20, mt: 1}}>
        //                 <Button  sx={{'& .Mui-disabled': {color: 'white'}}} size='large' variant='contained' disabled={savePending} onClick={toggleModal}>No</Button>
        //                 <Button size='large' variant='contained' disabled={savePending} onClick={deleteAndSave}>{savePending ? <CircularProgress size='29px'/> : 'Yes'}</Button>
        //             </Box>
        //             }
        //         </Box>
        //     </Fade>
        // </Modal>
    )
}