import {Modal, Box, Slide, useTheme, Button} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';



export default function SmallWidthModalWrapper({ariaLabel, ariaDescribe, handleClose, open, modalProps={}, modalSx={}, sx={}, children, hideCloseButton=false, smallClose=false, buttonSx={}}) {
    const theme = useTheme()

    return (
        <Modal 
            aria-labelledby={ariaLabel}
            aria-describedby={ariaDescribe}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            // slots={{
            //     backdrop: Backdrop
            // }}
            // slotProps={{
            //     backdrop: {
            //         timeout: 500
            //     }
            // }}
            sx={{...theme.components.box.fullCenterCol, ...modalSx}}
            {...modalProps}
        >
            <Slide in={open} direction='left'>
                <Box sx={{width: '100%', height: '100%', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color1.main, position: 'relative', ...sx}}>
                    {!hideCloseButton && 
                        <Button sx={{position: 'absolute', top: '0%', right: '0%', width: smallClose ? '40px' : '50px', height: smallClose ? '40px' : '50px', ...buttonSx}} onClick={handleClose}>
                            <CloseIcon sx={{color: theme.palette.color1.contrastText, fontSize: smallClose ? '30px' : '40px'}}/>
                        </Button>
                    }
                    {children}
                </Box>
            </Slide>
        </Modal>
    )
}