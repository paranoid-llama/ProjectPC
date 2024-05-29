import {Box, Modal, Typography, Backdrop, Fade, Button} from '@mui/material'
import modalStyles from './../../../../../../utils/styles/componentstyles/modalstyles'
import Header from './../modalcomponents/header'
import RenderEggMoves from './../../shared/rendereggmoves'
import RenderPossibleEggMoves from '../../eggmovecomponents/renderpossibleeggmoves'

export default function EditEggMovesModal({open, handleClose, eggMoveInfo}) {
    const {emCount, EMs, maxEMs, idxOfSelectedEM, handleEMChange, possibleEggMoves} = eggMoveInfo
    const scalingWidth = {
        width: '614.391px',
        "@media only screen and (max-width: 768px)": {
            width: '80%'
        }
    }
    return (
        <Modal
            aria-labelledby='change-new-onhand-egg-moves'
            aria-describedby='change-the-egg-moves-of-a-new-onhand-pokemon'
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, ...scalingWidth, height: '60%', display: 'flex', alignItems: 'center'}}>
                    <Header label='Change Egg Moves'/>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '30%', width: '90%', marginTop: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Box sx={{height: '70%', width: '92%'}}>
                            <RenderEggMoves emCount={emCount} EMs={EMs} maxEms={maxEMs} idxOfSelectedEM={idxOfSelectedEM} changeEMScreen={true} handleEMChange={handleEMChange} displayType='onHandEditEMs'/>
                        </Box>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '50%', width: '90%', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Box sx={{height: '90%', width: '90%'}}>
                            <RenderPossibleEggMoves possibleEggMoves={possibleEggMoves} handleEMChange={handleEMChange} EMs={EMs} maxEMs={maxEMs} isOnHandEdit={true}/>
                        </Box>
                    </Box>
                    <Box sx={{height: '10%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <Box sx={{width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button size='large' variant='contained' onClick={handleClose}>Back</Button>
                        </Box>
                        <Box sx={{width: '33%'}}></Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}