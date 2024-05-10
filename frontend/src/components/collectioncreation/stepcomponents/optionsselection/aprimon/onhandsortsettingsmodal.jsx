import {Box, Modal, Fade, Backdrop} from '@mui/material'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
import OnHandSortSettingsModalContents from './onhandsortsettingsmodalcontents'

export default function OnHandSortSettingsModal({onhandSortSettings, open, closeModal, handleBallOrderChange, totalBalls, tentativeBallOrder, handleChange}) {

    return (
        <Modal 
            aria-labelledby='on-hand-sort-settings'
            aria-describedby="select the autosort settings for the onhand list"
            open={open}
            onClose={() => closeModal('onhandSortSettings')}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <OnHandSortSettingsModalContents 
                        elementBg={modalStyles.onhand.modalElementBg}
                        onhandSortSettings={onhandSortSettings}
                        totalBalls={totalBalls}
                        tentativeBallOrder={tentativeBallOrder}
                        handleChange={handleChange}
                        handleBallOrderChange={handleBallOrderChange}
                    />
                </Box>
            </Fade>
        </Modal>
    )
}