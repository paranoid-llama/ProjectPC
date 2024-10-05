import {useState} from 'react'
import {Box, Typography, Button, useTheme} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import OnHandPokemonSelectionForm from '../editsectioncomponents/onhandeditonly/onhandpokemonselectionform'
import { setDeleteOnHandMode } from '../../../app/slices/editmode'
import BulkDeleteConfirm from '../editsectioncomponents/onhandeditonly/bulkdeleteconfirm'

export default function NothingSelected({listType, onhandViewType, isHomeCollection, collectionID, demo}) {
    const onhandList = listType === 'onHand'
    const theme = useTheme()
    const dispatch = useDispatch()
    const [openModal, setOpenModal] = useState(false)
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const handleOpen = () => setOpenModal(true)
    const handleClose = () => setOpenModal(false)
    const deleteOnHandMode = useSelector((state) => state.editmode.deleteOnHandMode)
    const toggleDeleteModal = () => setConfirmDeleteModal(!confirmDeleteModal)
    
    return (
        <>
        {onhandList && 
        <Box sx={{width: '20%', height: '100%'}}>

        </Box>
        }
        <Box sx={{width: '60%', display: 'flex', justifyContent: 'center'}}>
            <Typography sx={{textAlign: 'center'}}>
                {deleteOnHandMode ? 
                    <span style={{color: 'rgb(220, 50, 70)'}}>Delete Mode is on! Click on an on-hand to flag for deletion!</span> : 
                onhandList && onhandViewType === 'byPokemon' ? 
                    `Viewing On-hands by Pokemon is view only. Switch view mode to edit!` : 
                    'Nothing is selected. Click on a row to select!'
                }
            </Typography>
        </Box>
        {(onhandList && !(onhandViewType === 'byPokemon')) && 
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
        </>
    )
}