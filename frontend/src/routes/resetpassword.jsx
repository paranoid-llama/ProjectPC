import {Box, Typography, useTheme, Button} from '@mui/material'
import { useContext, useRef, useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ErrorContext } from '../app/contexts/errorcontext'
import BodyWrapper from '../components/partials/routepartials/bodywrapper'
import ControlledTextInput from '../components/functionalcomponents/controlledtextinput'
import verifyForgotPwTokenForBackend from '../../utils/functions/backendrequests/users/forgotpassword/verifyforgotpwtoken'
import resetPasswordRequest from '../../utils/functions/backendrequests/users/forgotpassword/resetpassword'
import DotWaitingText from '../components/functionalcomponents/dotwaitingtext'

export default function ResetPassword({}) {
    const search = useLocation().search
    const navigate = useNavigate()
    const {handleError} = useContext(ErrorContext)
    const theme = useTheme()
    const passwordRef = useRef(null)
    const confirmPasswordFieldRef = useRef(null)
    const [password, setPassword] = useState({value: '', error: false, passwordFocused: false, confirmPassword: false, passwordsMatch: 'none', eightChars: false, oneUpper: false, oneLower: false, oneNumber: false})
    const [submitting, setSubmitting] = useState(false)

    const passwordSpecificationsTextColor = (state) => {
        return {color: (password.passwordFocused || state) ? state ? 'green' : 'red' : 'grey'}
    }

    const checkIfPasswordsMatch = () => {
        if (passwordRef.current.value !== confirmPasswordFieldRef.current.value) {
            setPassword({...password, confirmPassword: true, passwordsMatch: false})
        } else {
            setPassword({...password, passwordsMatch: true})
        }
    }

    const handlePasswordChange = (newValue) => {
        const oneLower = /[a-z]/.test(newValue)
        const oneUpper = /[A-Z]/.test(newValue)
        const oneNumber = /[0-9]/.test(newValue)
        setPassword({value: newValue, eightChars: newValue.length >= 8, oneUpper, oneLower, oneNumber})
    }

    const textFieldStyles = {
        '&.MuiTextField-root': {
            width: '70%'
        },
        '& .MuiInputBase-input': {
            padding: 0.5,
            width: '100%'
        }, 
        mx: 5,
        '& .MuiOutlinedInput-root': {
            width: '100%'
        }
    }

    const finalizeReset = async() => {
        const passwordFitsRequirements = password.eightChars && password.oneLower && password.oneUpper && password.oneNumber
        const passwordsMatch = password.value === confirmPasswordFieldRef.current.value
        const errorInRegister =  !passwordFitsRequirements || !passwordsMatch 
        setSubmitting(true)
        if (errorInRegister) {
            const errorKeys = {
                error: !passwordFitsRequirements,
                confirmPassword: !passwordsMatch
            }
            setPassword({...password, ...errorKeys})
            return
        } else {
            const backendFunc = async() => await resetPasswordRequest(search, password.value)
            const successFunc = () => {
                setSubmitting(false)
                navigate('/login', {state: {success: true, message: 'Password Reset!'}})
            }
            const errorFunc = () => {
                setSubmitting(false)
                navigate('/forgot-password', {state: {error: true, type: 'expired'}})
            }
            handleError(backendFunc, false, successFunc, errorFunc, false, true)
        }
    }

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '800px', minHeight: '700px', width: '80%'}}>
                <Typography sx={{fontWeight: 700, mb: 3, fontSize: '36px'}}>Reset Password</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, mt: 3, width: '100%'}}>
                    <Typography sx={{width: '30%', textAlign: 'end'}}>New Password:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles}
                        textFieldProps={{
                            inputRef: passwordRef,
                            InputProps: {type: 'password'},
                            error: password.password,
                            onFocus: () => setPassword({...password, password: false, passwordFocused: true}),
                            onBlur: () => setPassword({...password, passwordFocused: false})
                        }}
                        charLimit={60}
                        useExpandedRegex={true}
                        controlInputFunc={handlePasswordChange}
                        defaultValue={password.value}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 0.5, width: '100%', height: '30%'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '70%', height: '100%', color: 'grey'}}>
                        <Typography sx={{fontSize: '12px', ml: 2}}>Password must: </Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, ...passwordSpecificationsTextColor(password.eightChars)}}>-  Be minimum 8 characters long</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, ...passwordSpecificationsTextColor(password.oneUpper)}}>-  Contain one upper-case letter</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, ...passwordSpecificationsTextColor(password.oneLower)}}>-  Contain one lower-case letter</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, ...passwordSpecificationsTextColor(password.oneNumber)}}>-  Contain one number</Typography>
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, mt: 3, width: '100%'}}>
                    <Typography sx={{width: '30%', textAlign: 'end', fontSize: '0.95rem'}}>Confirm New Password:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles}
                        textFieldProps={{
                            inputRef: confirmPasswordFieldRef,
                            InputProps: {type: 'password'},
                            error: password.confirmPassword,
                            onFocus: () => setPassword({...password, confirmPassword: false, passwordsMatch: 'none'}),
                            onBlur: checkIfPasswordsMatch
                        }}
                        charLimit={60}
                        useExpandedRegex={true}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 0.5, width: '100%', height: '10%', position: 'relative'}}>
                    {(password.passwordsMatch === false) && 
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '70%', height: '100%', position: 'absolute', top: '5px'}}>
                        <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>Field does not match password!</Typography> 
                    </Box>}
                </Box>
                <Button variant='contained' sx={{mt: 5}} onClick={finalizeReset} disabled={submitting}>{submitting ? <>Submitting<DotWaitingText/></>  : 'Submit'}</Button>
            </Box>
        </BodyWrapper>
    )
}