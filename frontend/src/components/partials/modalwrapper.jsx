import {Box, Typography, Modal, Fade, Slide, Backdrop, useTheme} from '@mui/material'
import modalStyles from '../../../utils/styles/componentstyles/modalstyles'


export default function ModalWrapper({open, handleClose, modalProps, height, width, sx, children, ariaLabel, ariaDescribe, wrapperType='fade', useBackdrop=true}) {
    const backdropProp = useBackdrop ? {slots: {backdrop: Backdrop}} : {}
    return (   
        <Modal 
            aria-labelledby={ariaLabel}
            aria-describedby={ariaDescribe}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            {...backdropProp}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
            {...modalProps}
        >
            {wrapperType === 'fade' ? 
                <Fade in={open}>
                    <Box sx={{...modalStyles.onhand.modalContainer, height, width, display: 'flex', alignItems: 'center', ...sx}}>
                        {children}
                    </Box>
                </Fade> : 
            wrapperType === 'slide' && 
                <Slide in={open}>
                    <Box sx={{...modalStyles.onhand.modalContainer, height, width, display: 'flex', alignItems: 'center', ...sx}}>
                        {children}
                    </Box>
                </Slide>
            }
        </Modal>
    )
}