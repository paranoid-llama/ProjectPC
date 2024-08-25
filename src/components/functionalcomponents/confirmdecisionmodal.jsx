import {Box, Typography, useTheme, Button, Modal, Backdrop, Fade, CircularProgress} from '@mui/material'
import {useState, useEffect} from 'react'
import modalStyles from '../../../utils/styles/componentstyles/modalstyles'

export default function ConfirmDecisionModal({text, subText, startingSecond=5, confirmDecisionFunc, toggleModal, open, state2=undefined, pendingText, pendingTimeout=500, noPendingPage=false}) {
    const theme = useTheme()
    const [cdButtonState, setCdButtonState] = useState({canConfirm: false, second: startingSecond, isCounting: false, pending: false})

    const timeoutConfirmFunc = () => {
        setCdButtonState({...cdButtonState, pending: true})
        setTimeout(() => {
            confirmDecisionFunc()
        }, pendingTimeout)
    }

    useEffect(() => {
        if (open === false) {
            setCdButtonState({...cdButtonState, canConfirm: false, second: startingSecond, pending: false})
        } else {
            if (cdButtonState.second !== 0 && !state2) {
               setTimeout(() => {
                    const canConfirm = cdButtonState.second - 1 === 0
                    if (canConfirm) {
                        setCdButtonState({...cdButtonState, second: 0, canConfirm: true})
                    } else {
                        setCdButtonState({...cdButtonState, second: cdButtonState.second-1}) 
                    }  
                }, 1000) 
            }
            
        }
    }, [open, cdButtonState.second, state2])

    return (
        <Modal
            aria-labelledby='confirm-decision'
            aria-describedby='confirm the decision you made'
            open={open}
            onClose={!cdButtonState.pending || state2 ? toggleModal : null}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '400px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, height: '95%', width: '95%', ...theme.components.box.fullCenterCol}}>
                        {cdButtonState.pending && !noPendingPage ? 
                        <>
                            <Typography sx={{fontSize: '24px', mb: 5}}>{pendingText}</Typography>
                            <CircularProgress/>
                        </> : 
                        state2 ? state2() : 
                            <>
                            <Typography sx={{fontSize: '24px', textAlign: 'center'}}>{text}</Typography>
                            <Typography sx={{mt: 1, textAlign: 'center'}}>
                                {subText}
                            </Typography>
                            <Box sx={{...theme.components.box.fullCenterRow, gap: 5, mt: 5}}>
                                <Button variant='contained' size='large' onClick={toggleModal} sx={{'&.Mui-disabled': {color: 'rgba(255, 255, 255, 0.5)'}}} disabled={cdButtonState.pending}>No</Button>
                                <Button 
                                    variant='contained' 
                                    size='large' 
                                    onClick={timeoutConfirmFunc} 
                                    sx={{'&.Mui-disabled': {color: 'rgba(255, 255, 255, 0.5)'}}} 
                                    disabled={!cdButtonState.canConfirm || cdButtonState.pending}
                                >
                                    {cdButtonState.pending && noPendingPage ? 
                                        <CircularProgress
                                            size='26.25px'
                                            sx={{color: 'white'}}
                                        /> : 
                                    cdButtonState.second === 0 ? 'Yes' : `Yes (${cdButtonState.second})`}
                                </Button>
                                {/* <CountDownButton 
                                    buttonProps={{
                                        variant: 'contained',
                                        size: 'large',
                                        sx: {
                                            '&.Mui-disabled': {
                                                color: 'rgba(255, 255, 255, 0.5)'
                                            }
                                        }
                                    }}
                                    buttonLabel='Yes'
                                    handleChange={confirmDecisionFunc}
                                    handleChangeSecond={changeSecond}
                                    handleCanConfirmChange={changeCanConfirm}
                                    second={detailsModal.second}
                                    isCounting={detailsModal.countDown}
                                    canConfirm={detailsModal.canConfirm}
                                /> */}
                            </Box>
                            </>
                        }
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}