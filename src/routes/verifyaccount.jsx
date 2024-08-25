import {Box, useTheme, Typography, Button, CircularProgress} from '@mui/material'
import BodyWrapper from '../components/partials/routepartials/bodywrapper'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import { useEffect, useRef, useState, useTransition } from 'react'
import ControlledTextInput from '../components/functionalcomponents/controlledtextinput'

//i was going to work on this route but i decided against implementing account verification, as it doesn't really make sense for the app as it is.
//we can continue later if it's needed.

export default function VerifyAccount({}) {
    const locationData = useLocation()
    const theme = useTheme()
    const navigate = useNavigate()
    const user = useRouteLoaderData("root")
    const [sentVerEmail, setSentVerEmail] = useState(false)
    const [isPending, startTransition] = useTransition()
    const cameFromRegisterPage = locationData.state !== null && locationData.state.newUserId !== undefined
    const email = locationData.state !== null ? (locationData.state.email === undefined ? 'omar_born@hotmail.com' : locationData.state.email) : 'omar_born@hotmail.com'
    useEffect(() => {
        if (!cameFromRegisterPage) {
            if (user.loggedIn === false) {
                navigate('/login')
            } else {
                navigate('/') 
            }
        }
    }, [])

    const sendVerificationEmail = () => {

    }

    const tokenRef = useRef(null)
    const textFieldStyles = {
        '&.MuiTextField-root': {
            width: '80%'
        },
        '& .MuiInputBase-input': {
            width: '100%'
        }
    }

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            {!cameFromRegisterPage ? <></> : 
            <Box sx={{...theme.components.box.fullCenterCol, maxWidth: '800px', width: '80%'}}>
                <Typography sx={{fontWeight: 700, mb: 3, fontSize: '36px'}}>Verify Account</Typography>
                <Typography sx={{fontSize: '14px', textAlign: 'center', mb: 1}}>
                    Verify your account to access everything the website has to offer. 
                    You can still create new collections, but you won't be able to initiate trades with other users. 
                    You can verify now or later.
                </Typography>
                <Button variant='contained' size='large' sx={{mt: 1, mb: 2}} onClick={null}>{isPending ? <CircularProgress/> : 'Send Verification E-mail'}</Button>
                <Box sx={{...theme.components.box.fullCenterCol, height: '30%', width: '100%'}}>
                    {sentVerEmail === true && 
                    <><Typography sx={{fontSize: '14px', textAlign: 'center', mb: 3}}>
                        We've sent a verification token to <b>{email}</b>. You can click the link in the e-mail to verify your account,
                        or alternatively copy-paste the token here:  
                    </Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles}
                        textFieldProps={{
                            inputRef: tokenRef,
                            label: 'Verification Token'
                        }}
                    />
                    <Button variant='contained' size='large' sx={{mt: 3.5, mb: 2}} onClick={null}>Verify Account</Button></>}
                </Box>
                <Button variant='contained' size='medium' sx={{mt: 3.5, mb: 2}} onClick={null}>Verify my account later</Button>
            </Box>
            }
        </BodyWrapper>
        
    )
}