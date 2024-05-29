import {Box, useTheme, Typography, Button, Alert} from '@mui/material'
import {useState, useRef} from 'react'
import ControlledTextInput from '../components/functionalcomponents/controlledtextinput'
import BodyWrapper from '../components/partials/routepartials/bodywrapper'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import userLoginRequest from '../../utils/functions/backendrequests/users/login'

export default function LoginPage({}) {
    const theme = useTheme()
    const location = useLocation()
    const navigate = useNavigate()
    const errorInit = location.state !== null && location.state.error
    const errorMessageInit = location.state !== null && location.state.message || ''

    const usernameFieldRef = useRef(null)
    const passwordFieldRef = useRef(null)
    const [error, setError] = useState({username: false, password: false, error: errorInit, errorMessage: errorMessageInit}) 

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
        if (userData.username.length === 0 || userData.password.length === 0) {
            setError({...error, username: userData.username.length === 0, password: userData.password.length === 0})
            return 
        }
        const loginStatus = await userLoginRequest(userData)
        if (loginStatus.successful === false) {
            setError({username: false, password: false, error: true, errorMessage: 'One or more fields are incorrect!'})
        } else {
            navigate(0)
        }
    }

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, maxWidth: '800px', minHeight: '500px', width: '80%'}}>
                <Typography sx={{fontWeight: 700, mb: error.error ? 0 : 3, fontSize: '36px'}}>Login</Typography>
                {error.error && 
                <Alert 
                    severity='error' 
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
                <Button variant='contained' size='large' sx={{mt: 3.5, mb: 2}} onClick={finalizeLogin}>Login</Button>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%'}}>
                    <Box sx={{...theme.components.box.fullCenterRow}}>
                        <Typography sx={{textTransform: 'none'}}>Don't have an account? <Link to='/register'> Register here</Link></Typography>
                    </Box>
                    <Button sx={{fontSize: '14px', mt: 1}}>I forgot my password</Button>
                </Box>
            </Box>
        </BodyWrapper>
    )
}