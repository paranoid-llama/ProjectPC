import {Box, Typography, useTheme, Button, Alert} from '@mui/material'
import { useContext, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { ErrorContext } from '../app/contexts/errorcontext'
import { AlertsContext } from '../alerts/alerts-context'
import ControlledTextInput from '../components/functionalcomponents/controlledtextinput'
import BodyWrapper from '../components/partials/routepartials/bodywrapper'
import TimeoutButton from '../components/functionalcomponents/timeoutbutton'
import hexToRgba from 'hex-to-rgba'
import generateForgotPwTokenForBackend from '../../utils/functions/backendrequests/users/forgotpassword/generateforgotpwtoken'
import DotWaitingText from '../components/functionalcomponents/dotwaitingtext'

export default function ForgotPassword({}) {
    const theme = useTheme()
    const location = useLocation()
    const emailRef = useRef(null)
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const [emailError, setEmailError] = useState(false)
    const [sendingEmail, setSendingEmail] = useState(false)
    
    const stateData = location.state
    const [tokenError, setTokenError] = useState(stateData !== null)

    const textFieldStyles = {
        '&.MuiTextField-root': {
            width: '100%'
        },
        '& .MuiInputBase-input': {
            padding: 0.5,
            width: '100%'
        }, 
        mx: 5,
        '& .MuiOutlinedInput-root': {
            width: '100%',
        }
    }

    const generateToken = () => {
        setSendingEmail(true)
        const backendFunc = async() => await generateForgotPwTokenForBackend(emailRef.current.value)
        const successFunc = (status) => {
            setSendingEmail(false)
            if (status && status.error) {
                setEmailError(true)
            } else {
                addAlert({severity: 'success', timeout: 4, message: 'Sent the e-mail!'})
            } 
        }
        const errorFunc = () => {setSendingEmail(false)}
        handleError(backendFunc, false, successFunc, errorFunc, false, true)
    }

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '800px', minHeight: '700px', width: '80%'}}>
                <Typography sx={{fontWeight: 700, mb: (tokenError) ? 0 : 3, fontSize: '36px'}}>Forgot Password</Typography>
                {(tokenError) && 
                <Alert 
                    severity={'error'} 
                    sx={{
                        mb: '15px',
                        pointerEvents: 'all',
                    }}
                >
                    {stateData.type === 'expired' ? 'Token expired. Please try again!' : 'Invalid Token. Please try again!'}
                </Alert>}
                <Typography sx={{width: '100%', textAlign: 'center', mb: 1}}>Please enter the e-mail address associated with your account:</Typography>
                <Box sx={{...theme.components.box.fullCenterCol, width: '60%', position: 'relative'}}>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles} 
                        textFieldProps={{
                            inputRef: emailRef,
                            error: emailError,
                            onFocus: () => {
                                if (emailError) {setEmailError(false)}
                                if (tokenError) {setTokenError(false)}
                            }
                        }}
                        useExpandedRegex={true}
                    />
                    {emailError && <Typography sx={{position: 'absolute', top: '100%', left: '3px', color: 'red', fontSize: '12px'}}>Something went wrong. Please try again.</Typography>}
                </Box>
                <TimeoutButton 
                    buttonProps={{variant: 'contained'}}
                    buttonSx={{my: 3, '&.Mui-disabled': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.75), color: 'white', opacity: 0.5}}}
                    timeoutInit={60}
                    resetTimeout={true}
                    init0={true}
                    onClickFunc={generateToken}
                >
                    Send E-mail
                </TimeoutButton>
                {sendingEmail && <Typography sx={{fontSize: '11px'}}>Sending E-mail<DotWaitingText/></Typography>}
                <Typography sx={{width: '100%', textAlign: 'center', mt: 1, fontSize: '12px'}}>
                    If the e-mail address exists, it'll receive an e-mail detailing instructions on how to reset your password. Please check your junk box if you appear to have not received it.
                </Typography>
                {/* <Button sx={{mt: 3}} size='small'>I forgot the e-mail</Button> */}
            </Box>
        </BodyWrapper>
    )
}