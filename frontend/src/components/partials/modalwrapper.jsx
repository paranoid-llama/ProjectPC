import {Box, Typography, Modal, Fade, Backdrop, useTheme} from '@mui/material'
import modalStyles from '../../../utils/styles/componentstyles/modalstyles'


export default function ModalWrapper({open, handleClose, modalProps, height, width, sx, children, ariaLabel, ariaDescribe}) {

    return (
        <Modal 
            aria-labelledby={ariaLabel}
            aria-describedby={ariaDescribe}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
            {...modalProps}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height, width, display: 'flex', alignItems: 'center', ...sx}}>
                    {children}
                </Box>
            </Fade>
        </Modal>
    )
}