import {Box, useTheme, Typography, Button, Alert} from '@mui/material'
import {useState, useRef, useEffect, useContext} from 'react'
import { ErrorContext } from '../app/contexts/errorcontext'
import { AlertsContext } from '../alerts/alerts-context'
import ControlledTextInput from '../components/functionalcomponents/controlledtextinput'
import BodyWrapper from '../components/partials/routepartials/bodywrapper'
import { Link, useLocation, useNavigate, useRevalidator } from 'react-router-dom'
import userLoginRequest from '../../utils/functions/backendrequests/users/login'
import DotWaitingText from '../components/functionalcomponents/dotwaitingtext'

export default function LoginPage({}) {
    const theme = useTheme()
    const location = useLocation()
    const navigate = useNavigate()
    const revalidator = useRevalidator()
    const {handleError} = useContext(ErrorContext)
    const errorInit = location.state !== null && location.state.error
    const successInit = location.state !== null && location.state.success
    const errorMessageInit = location.state !== null && location.state.message || ''
    const redirectTo = location.state !== null ? location.state.redirectTo : undefined

    const usernameFieldRef = useRef(null)
    const passwordFieldRef = useRef(null)
    const [error, setError] = useState({username: false, password: false, error: errorInit, errorMessage: errorMessageInit, loggingIn: false}) 

    //alerts
    const [alertIds, setAlertIds] = useState([])
    const {addAlert, dismissAlert} = useContext(AlertsContext)

    const clearAlerts = () => {
        alertIds.forEach((id) => {
            dismissAlert(id);
        });
        setAlertIds([]);
    }

    useEffect(() => {
        return () => {
            clearAlerts();
        };
    }, []);

    const loginFieldStyles = {
        '&.MuiTextField-root': {
            width: '50%'
        },
        '& .MuiInputBase-input': {
            padding: 0.5,
            width: '100%'
        }, 
        mx: 5,
        '& .MuiOutlinedInput-root': {
            width: '100%',
            '& fieldset': {

            },
            '&:hover fieldset': {

            },
            '& .Mui-focused': {

            }
        }
    }

    const finalizeLogin = async() => {
        const userData = {username: usernameFieldRef.current.value, password: passwordFieldRef.current.value}
        setError({...error, loggingIn: true})
        if (userData.username.length === 0 || userData.password.length === 0) {
            setError({...error, username: userData.username.length === 0, password: userData.password.length === 0})
            return 
        }
        const backendFunc = async() => await userLoginRequest(userData)
        const successFunc = (loginStatus) => { 
            //this works a bit different from other error handlers. status 401 (unauthorized) is counted as "ok" so we dont have to write login specific
            //logic in the context. see useLoginRequest for how it's done.
            if (loginStatus.successful === false) {
                setError({username: false, password: false, error: true, errorMessage: 'One or more fields are incorrect!', loggingIn: false})
            } else {
                setError({...error, loggingIn: false})
                //spawning alert
                const alertMessage = `Logged in as ${userData.username}!`
                const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                const id = addAlert(alertInfo);
                setAlertIds((prev) => [...prev, id]);
                revalidator.revalidate()
                if (redirectTo !== undefined) {
                    navigate(redirectTo)
                } else {
                    navigate('/')
                }
            }
        }
        handleError(backendFunc, false, successFunc, () => {setError({...error, loggingIn: false})})
    }

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '800px', minHeight: '500px', width: '80%'}}>
                <Typography sx={{fontWeight: 700, mb: (error.error || successInit === true) ? 0 : 3, fontSize: '36px'}}>Login</Typography>
                {(error.error || successInit === true) && 
                <Alert 
                    severity={error.error === true ? 'error' : successInit === true && 'success'} 
                    sx={{
                        marginTop: '5px',
                        pointerEvents: 'all',
                        my: 2
                    }}
                >
                    {error.errorMessage}
                </Alert>}
                <Box sx={{...theme.components.box.fullCenterRow, width: '100%'}}>
                    <Typography sx={{width: '30%', textAlign: 'end'}}>Username/Email:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={loginFieldStyles} 
                        textFieldProps={{
                            inputRef: usernameFieldRef,
                            error: error.username,
                            onFocus: () => setError({...error, username: false})
                        }}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, mt: 3, width: '100%'}}>
                    <Typography sx={{width: '30%', textAlign: 'end'}}>Password:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={loginFieldStyles}
                        textFieldProps={{
                            inputRef: passwordFieldRef,
                            InputProps: {type: 'password'},
                            error: error.password,
                            onFocus: () => setError({...error, password: false})
                        }}
                    />
                </Box>
                <Button variant='contained' size='large' sx={{mt: 3.5, mb: 2}} onClick={finalizeLogin} disabled={error.loggingIn}>{error.loggingIn ? <>Logging in<DotWaitingText/></> : 'Login'}</Button>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%'}}>
                    <Box sx={{...theme.components.box.fullCenterRow}}>
                        <Typography sx={{textTransform: 'none'}}>Don't have an account? {error.loggingIn ? 'Register here' : <Link to='/register' > Register here</Link>}</Typography>
                    </Box>
                    <Button sx={{fontSize: '14px', mt: 1}} onClick={() => navigate('/forgot-password')} disabled={error.loggingIn}>I forgot my password</Button>
                </Box>
            </Box>
        </BodyWrapper>
    )
}