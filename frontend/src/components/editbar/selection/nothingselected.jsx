import {useState} from 'react'
import {Box, Typography, Button, useTheme} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import OnHandPokemonSelectionForm from '../editsectioncomponents/onhandeditonly/onhandpokemonselectionform'
import { setDeleteOnHandMode } from '../../../app/slices/editmode'
import BulkDeleteConfirm from '../editsectioncomponents/onhandeditonly/bulkdeleteconfirm'
import SWOnHandPokemonSelectionForm from './smallwidth/editors/swonhandpokemonselectionform'
import SmallWidthModalWrapper from '../../partials/wrappers/smallwidthmodalwrapper'

export default function NothingSelected({listType, onhandViewType, isHomeCollection, collectionID, demo, smScreen}) {
    const onhandList = listType === 'onHand'
    const theme = useTheme()
    const dispatch = useDispatch()
    const [openModal, setOpenModal] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const handleOpen = () => setOpenModal(true)
    const handleClose = () => setOpenModal(false)
    const deleteOnHandMode = useSelector((state) => state.editmode.deleteOnHandMode)
    const toggleDeleteModal = () => setConfirmDeleteModal(!confirmDeleteModal)

    const mediaQuery = (smScreen && onhandViewType === 'byPokemon') ? {'@media only screen and (max-width: 500px)': {fontSize: '12px'}} : {}
    
    return (
        <>
        {(onhandList && !smScreen) &&
        <Box sx={{width: '20%', height: '100%'}}>

        </Box>
        }
        <Box sx={{width: '60%', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Typography sx={{textAlign: 'center', ...mediaQuery}}>
                {deleteOnHandMode ? 
                    <span style={{color: 'rgb(220, 50, 70)'}}>Delete Mode is on! Click on {onhandViewType === 'byPokemon' ? 'an onhand/ball combo' : 'an onhand'} to flag for deletion!</span> : 
                onhandList && onhandViewType === 'byPokemon' ? 
                    `Nothing is selected.` : 
                    'Nothing is selected. Click on a row to select!'
                }
            </Typography>
            {(onhandList && onhandViewType === 'byPokemon' && !deleteOnHandMode) &&
                <Typography sx={{textAlign: 'center', ...mediaQuery, fontSize: '12px'}}>
                    Click on a row to select, or increment/decrement a ball qty.
                </Typography>
            }
        </Box>
        {(onhandList && !smScreen) && 
        <Box sx={{width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{...theme.components.box.fullCenterCol}}>
                {deleteOnHandMode ? 
                <>
                <Button size='small' onClick={toggleDeleteModal} sx={{fontSize: '12px', padding: 0, mb: 0.5}}>
                    Confirm Deletion
                </Button>
                <Button size='small' onClick={() => dispatch(setDeleteOnHandMode(false))} sx={{fontSize: '12px', padding: 0, mt: 0.5}}>
                    Cancel
                </Button>
                </> : 
                <>
                <Button size='small' onClick={handleOpen} sx={{fontSize: '12px', padding: 0, mb: 0.5}}>
                    New On-hand
                </Button>
                <Button size='small' onClick={() => dispatch(setDeleteOnHandMode(true))} sx={{fontSize: '12px', padding: 0, mt: 0.5}}>
                    Delete On-hand
                </Button>
                </>}
            </Box>
            <OnHandPokemonSelectionForm collectionID={collectionID} open={openModal} handleClose={handleClose} initialPokemonData={{}} isHomeCollection={isHomeCollection} demo={demo}/>
            {deleteOnHandMode &&
                <BulkDeleteConfirm 
                    open={confirmDeleteModal}
                    toggleModal={toggleDeleteModal}
                    collectionID={collectionID}
                    demo={demo}
                />
            }
        </Box>}
        {/* {(onhandList && onhandViewType === 'byPokemon' && !smScreen) &&
            <Box sx={{width: '20%', height: '100%'}}>

            </Box>
        } */}

        {(smScreen && onhandList) && 
            <>
            <Box sx={{...theme.components.box.fullCenterCol, height: '80px', position: 'absolute', top: '100%', width: '100%'}}>
                {!deleteOnHandMode ? 
                <>
                <Button variant='contained' sx={{width: '100%', height: '40px', borderRadius: '0px'}} onClick={handleOpen}>New On-hand</Button>
                <Button variant='contained' sx={{width: '100%', height: '40px', borderRadius: '0px', backgroundColor: 'rgb(220, 50, 70)', ':hover': {backgroundColor: 'rgb(190, 20, 40)'}}} onClick={() => dispatch(setDeleteOnHandMode(true))}>Delete On-hand</Button>
                </> : 
                <>
                <Button variant='contained' sx={{width: '100%', height: '40px', borderRadius: '0px'}} onClick={() => dispatch(setDeleteOnHandMode(false))}>Cancel</Button>
                <Button variant='contained' sx={{width: '100%', height: '40px', borderRadius: '0px', backgroundColor: 'rgb(220, 50, 70)', ':hover': {backgroundColor: 'rgb(190, 20, 40)'}}} onClick={toggleDeleteModal}>Confirm Deletion</Button>
                </> 
                }

            </Box>
            {deleteOnHandMode &&
                <BulkDeleteConfirm 
                    open={confirmDeleteModal}
                    toggleModal={toggleDeleteModal}
                    collectionID={collectionID}
                    demo={demo}
                    sw={true}
                />
            }
            </>
        }
        {(onhandList && smScreen) &&
            <SmallWidthModalWrapper
                ariaLabel='add new on-hand'
                ariaDescribe='add new on-hand pokemon to the on-hand list'
                open={openModal}
                handleClose={handleClose}
                sx={{justifyContent: 'start'}}
                smallClose={true}
            >
                <SWOnHandPokemonSelectionForm 
                    collectionID={collectionID}
                    open={openModal}
                    handleClose={handleClose}
                    initialPokemonData={{}}
                    isHomeCollection={isHomeCollection}
                    demo={demo}
                />
            </SmallWidthModalWrapper>
        }
        </>
    )
}