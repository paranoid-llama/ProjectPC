import {AppBar, Typography, Box, Button, Alert, Modal, Fade, Backdrop, useTheme, CircularProgress, Tooltip} from '@mui/material'
import modalStyles from '../../utils/styles/componentstyles/modalstyles.jsx'
import { setUnsavedChanges } from '../app/slices/editmode.jsx'
import {useLocation, useLoaderData, useRouteLoaderData, Link, useNavigate, useRevalidator} from 'react-router-dom'
import { useEffect, useRef, useContext, useState, useTransition } from 'react'
import { ErrorContext } from '../app/contexts/errorcontext.jsx'
import { AlertsContext } from '../alerts/alerts-context.jsx'
import { setCollectionInitialState } from '../app/slices/collection.jsx'
import { setOnHandInitialState } from '../app/slices/onhand.jsx'
import { setListInitialState } from '../app/slices/listdisplay.jsx'
import { setOptionsInitialState } from '../app/slices/options.jsx'
import {useSelector, useDispatch} from 'react-redux'
import { usePutRequest } from '../../utils/functions/backendrequests/editcollection.js'
import {configureStore, createSlice, current} from '@reduxjs/toolkit'
import store from './../app/store'
import NothingSelected from '../components/editbar/selection/nothingselected.jsx'
import FlexAppBarContainer from '../components/editbar/selection/components/flexappbarcontainer.jsx'
import DisplaySelection from '../components/editbar/selection/displayselection.jsx'
import { changeModalState } from '../app/slices/editmode.jsx'
import CollectionOptionsModal from '../components/editbar/collectionoptions/collectionoptionsmodal.jsx'
import { selectScreenBreakpoint } from '../app/selectors/windowsizeselectors.js'
import SWEditSelection from '../components/editbar/selection/smallwidth/sweditselection.jsx'

export default function EditCollection({demo}) {
    const dispatch = useDispatch()
    const theme = useTheme()
    const [saving, setSaving] = useState(false)
    const [saveConfirm, setSaveConfirm] = useState(false)
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const navigate = useNavigate()
    const collection = useLoaderData()
    const demoCollectionData = useLocation().state !== null && useLocation().state.collection
    const revalidator = useRevalidator()
    const unsavedChanges = useSelector((state) => state.editmode.unsavedChanges)
    const unsavedOnhandChanges = useSelector((state) => state.editmode.unsavedOnhandChanges)

    const screenBreakpoint = useSelector((state) => selectScreenBreakpoint(state, 'default'))

    const demoGen = demo && useSelector((state) => state.collectionState.demoData.gen)
    const anyUnsavedChanges = unsavedChanges || unsavedOnhandChanges
    const linkBack = useLocation().pathname.slice(0, -5)
    const toggleSaveConfirmModal = () => setSaveConfirm(!saveConfirm)

    const leaveEditMode = () => {
        dispatch(setUnsavedChanges('reset')) 
        
        const state = demo ? {state: {collection: passDemoCollectionForward()}} : {}
        navigate(linkBack, state)
        revalidator.revalidate()
        //do not switch the order of these or it ends up revalidating the edit route before it changes which means every other unnecessary state 
        //(col onhand options) gets revalidated too. at least, i THINK thats what happens since it re-renders a LOT when leaving edit mode
    }

    const passDemoCollectionForward = () => {
        const collectionDataInState = store.getState().collectionState
        const collectionDatabaseFormat = {
            type: 'aprimon',
            name: collectionDataInState.options.collectionName,
            gen: demoGen,
            options: {...collectionDataInState.options},
            ownedPokemon: collectionDataInState.collection,
            onHand: collectionDataInState.onhand,
            eggMoveInfo: collectionDataInState.eggMoveInfo,
            availableGamesInfo: collectionDataInState.availableGamesInfo 
        }
        return collectionDatabaseFormat
    }

    const saveCollectionEdits = (exitAfter=false) => {
        //do not compare collection laoder data and collection state, since scope/ball scope/excluded combos update does NOT revalidate to update the loader data.
        //if you do compare, and the user changes the scope before changing, those scope changes wont be reflected in the laoder data.
        const collectionState = store.getState().collectionState.collection
        const onhandState = store.getState().collectionState.onhand
        const newOwnedPokemonArr = unsavedChanges ? JSON.parse(JSON.stringify(collectionState)).map(p => {
            delete p.imgLink
            delete p.possibleGender
            return p
        }) : undefined
        const newOnhandList = unsavedOnhandChanges ? JSON.parse(JSON.stringify(onhandState)).map(p => {
            delete p.imgLink
            return p
        }) : undefined
        setSaving(true)
        const backendFunc = async() => await usePutRequest(newOwnedPokemonArr, newOnhandList, collection._id)
        const successFunc = () => {
            addAlert({severity: 'success', timeout: 5, message: 'Successfully saved the changes to your collection!'})
            setSaving(false)
            if (exitAfter) {leaveEditMode()}
            else {dispatch(setUnsavedChanges('reset'))}
        }
        const errorFunc = () => {
            if (exitAfter) {
                toggleSaveConfirmModal()
            }
            setSaving(false)
        }
        handleError(backendFunc, false, successFunc, errorFunc)
    }

    return (
        <>
        <Box sx={{flexGrow: 1, width: '100%', height: '0px', position: 'relative'}}>
            <AppBar
                position='fixed'
                className='keepZidx'
                sx={{backgroundColor: '#e3e5e6', height: '64.547px', display: 'flex', alignItems: 'center', flexDirection: 'row', zIndex: 700}}
            >
                {screenBreakpoint !== 'sm' && 
                <FlexAppBarContainer
                    widthPercent='10%'
                    additionalStyles={{paddingLeft: '8px', position: 'relative', height: '100%'}}
                >   
                    <Button
                        sx={{color: '#73661e', height: '100%'}}
                        onClick={anyUnsavedChanges && !demo ? toggleSaveConfirmModal : leaveEditMode}
                    >
                        Leave Edit Mode
                    </Button>
                    {anyUnsavedChanges && 
                    <Box sx={{position: 'absolute', backgroundColor: '#e3e5e6', height: '48px', width: '150%', paddingLeft: '8px', top: '64.547px', left: '0px', color: '#73661e', borderBottomRightRadius: '5px', borderTop: '1px solid black'}}>
                        {demo ? 
                        <Tooltip title='Your changes are already saved, but not to the database. To save it there, click the button on the top of the page to register an account!'>
                        <Button
                            sx={{height: '100%', width: '100%', fontSize: '13px', ':hover': {cursor: 'auto'}}}
                            onClick={null}
                        >
                            Save Changes
                        </Button>
                        </Tooltip> : 
                        <Button
                            sx={{height: '100%', width: '100%', fontSize: '13px'}}
                            onClick={() => saveCollectionEdits(false)}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        }
                    </Box>
                    }
                </FlexAppBarContainer>}
                <Box sx={{width: '0%', height: '100%', position: 'relative'}}>
                    
                </Box>
                <DisplaySelection 
                    collection={demo ? {ownedPokemon: store.getState().collectionState.collection, owner: {_id: ''}, _id: '', gen: demoGen} : collection} 
                    demo={demo}
                    anyUnsavedChanges={screenBreakpoint === 'sm' && anyUnsavedChanges}
                    saving={screenBreakpoint === 'sm' && saving}
                    saveCollectionEdits={screenBreakpoint === 'sm' && saveCollectionEdits}
                    smScreen={screenBreakpoint === 'sm'}
                />
            </AppBar>
            <Modal
                aria-labelledby='save-confirm'
                aria-describedby="confirm the changes to your collection"
                open={saveConfirm}
                onClose={toggleSaveConfirmModal}
                closeAfterTransition
                slots={{backdrop: Backdrop}}
                slotProps={{
                    backdrop: {
                        timeout: 500
                    }
                }}
            >
                <Fade in={saveConfirm}>
                    <Box sx={{...modalStyles.onhand.modalContainer, height: '400px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                        <Box sx={{...modalStyles.onhand.modalElementBg, height: '95%', width: '95%', ...theme.components.box.fullCenterCol}}>
                            <Typography sx={{fontSize: '24px', textAlign: 'center'}}>You have unsaved changes!</Typography>
                            <Typography sx={{mt: 1, textAlign: 'center'}}>
                                Are you sure you want to exit?
                            </Typography>
                            <Box sx={{...theme.components.box.fullCenterRow, gap: 5, mt: 5}}>
                                <Button variant='contained' size='large' onClick={leaveEditMode} sx={{'&.Mui-disabled': {color: 'rgba(255, 255, 255, 0.5)'}}} disabled={saving}>Yes</Button>
                                <Button variant='contained' size='large' onClick={toggleSaveConfirmModal} sx={{'&.Mui-disabled': {color: 'rgba(255, 255, 255, 0.5)'}}} disabled={saving}>No (Cancel)</Button>
                                <Button 
                                    variant='contained' 
                                    size='large' 
                                    onClick={() => saveCollectionEdits(true)} 
                                    sx={{'&.Mui-disabled': {color: 'rgba(255, 255, 255, 0.5)'}}} 
                                    disabled={saving}
                                >
                                    {saving ? 
                                        <CircularProgress
                                            size='26.25px'
                                            sx={{color: 'white'}}
                                        />  :
                                        'Save and Exit'
                                    }
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <CollectionOptionsModal collectionGen={demo ? demoGen : collection.gen} collectionId={demo ? '' : collection._id} ownerUsername={demo ? '' : collection.owner.username} demo={demo} sw={screenBreakpoint === 'sm'}/>
        </Box>
        {screenBreakpoint === 'sm' &&
        <SWEditSelection 
            collectionID={demo ? '00000' : collection._id}
            gen={demo ? demoGen : collection.gen}
            demo={demo}
        />
        }
        </>
    )
}