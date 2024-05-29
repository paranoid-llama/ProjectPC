import {useState} from 'react'
import {Box, Typography, Button} from '@mui/material'
import OnHandPokemonSelectionForm from '../editsectioncomponents/onhandeditonly/onhandpokemonselectionform'

export default function NothingSelected({listType}) {
    const onhandList = listType === 'onHand'
    const [openModal, setOpenModal] = useState(false)
    const handleOpen = () => setOpenModal(true)
    const handleClose = () => setOpenModal(false)
    
    return (
        <>
        {onhandList && 
        <Box sx={{width: '20%', height: '100%'}}>

        </Box>
        }
        <Box sx={{width: '60%', display: 'flex', justifyContent: 'center'}}>
            <Typography>Nothing is selected. Click on a row to select!</Typography>
        </Box>
        {onhandList && 
        <Box sx={{width: '20%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Button size='small' onClick={handleOpen}>
                New On-hand
            </Button>
            <OnHandPokemonSelectionForm open={openModal} handleClose={handleClose} initialPokemonData={{}}/>
        </Box>}
        </>
    )
}