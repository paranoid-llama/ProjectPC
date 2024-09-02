import {Box, Typography, useTheme, Select, MenuItem, Button, Tooltip, Checkbox} from '@mui/material'
import { useState, useContext } from 'react'
import { useRouteLoaderData } from 'react-router'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { AlertsContext } from '../../../alerts/alerts-context'
import ControlledTextInput from '../../../components/functionalcomponents/controlledtextinput'
import DotWaitingText from '../../../components/functionalcomponents/dotwaitingtext'
import sendUserMessageToEmailBackend from '../../../../utils/functions/backendrequests/api/sendusermessagetoemail'
import HelpIcon from '@mui/icons-material/Help';
import hexToRgba from 'hex-to-rgba'

const contactReasons = ['General Question', 'Offer Suggestion', 'Report an Issue/Bug', 'Report a User', 'Other']
const contactReasonValues = ['GQ', 'OS', 'RIB', 'RU', 'Other']

export default function ContactUsDirectlyComponents({containerSx={}}) {
    const userData = useRouteLoaderData('root')
    const theme = useTheme()
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const [stateData, setStateData] = useState({textValue: '', subjectValue: '', reason: '', anonymous: false, sending: false, emailError: false})

    const sendMessage = () => {
        const error = !stateData.textValue
        if (error) {
            setStateData({...stateData, emailError: true})
        } else {
           setStateData({...stateData, sending: true})
            const backendFunc = async() => sendUserMessageToEmailBackend(stateData.reason, stateData.subjectValue, stateData.textValue, (stateData.anonymous || !userData.loggedIn) ? '' : userData.user.username)
            const successFunc = (status) => {
                setStateData({...stateData, sending: false})
                if (status && status.error) {
                    addAlert({severity: 'error', timeout: 4, message: "We weren't able to send the e-mail. Please try again!"})
                } else {
                    addAlert({severity: 'success', timeout: 4, message: 'Sent the e-mail!'})
                } 
            }
            const errorFunc = () => {setStateData({...stateData, sending: false})}
            handleError(backendFunc, false, successFunc, errorFunc) 
        } 
    }


    const colorStyles = {
        '&.MuiInputBase-root': {width: '100%', color: 'white', border: '1px solid white'}
    }

    return (
        <>
        <Box sx={{...theme.components.box.fullCenterCol, gap: 1, ...containerSx}}>
            <Select value={stateData.reason} onChange={(e, newVal) => {setStateData({...stateData, reason: newVal.props.value})}} sx={{...colorStyles, textAlign: 'left', width: '100%'}}>
                <MenuItem value={''} sx={{height: '36px'}}><i>Select a Reason (not required)</i></MenuItem>
                {contactReasons.map((cR, idx) => {
                    return (
                        <MenuItem key={`Contact-reason-${cR}`} value={contactReasonValues[idx]} disabled={!userData.loggedIn && cR === 'General Question'}>
                            {(!userData.loggedIn && cR === 'General Question') ? 'General Question (Requires being logged in)' : cR}
                        </MenuItem>
                    )
                })}
            </Select>
            <ControlledTextInput 
                charLimit={100}
                textFieldProps={{
                    placeholder: 'Message Subject (not required)',
                }}
                textFieldStyles={{
                    '&.MuiTextField-root': {
                        width: '100%',
                        color: 'white',
                        border: '1px solid white',
                        borderRadius: '4px'
                    },
                    '& .MuiInputBase-input': {
                        color: 'white',
                        "&::placeholder": {
                            color: "white"
                        },
                        '&::-webkit-scrollbar': {
                            width: '0.3em'
                        },
                        '&::-webkit-scrollbar-track': {
                            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: hexToRgba(theme.palette.color1.dark, 0.75),
                            borderRadius: '5px'   
                        },
                    }
                }}
                defaultValue={stateData.subjectValue}
                controlInputFunc={(newVal) => setStateData({...stateData, subjectValue: newVal})}
            />
            <Box sx={{position: 'relative', width: '100%'}}>
                <ControlledTextInput
                    charLimit={1000}
                    textFieldProps={{
                        multiline: true,
                        rows: 8,
                        placeholder: 'Message',
                        error: stateData.textError,
                        onFocus: () => {setStateData({...stateData, emailError: false})}
                    }}
                    textFieldStyles={{
                        '&.MuiTextField-root': {
                            width: '100%',
                            color: 'white',
                            border: '1px solid white',
                            borderRadius: '4px'
                        },
                        '& .MuiInputBase-input': {
                            color: 'white',
                            "&::placeholder": {
                                color: "white"
                            },
                            '&::-webkit-scrollbar': {
                                width: '0.3em'
                            },
                            '&::-webkit-scrollbar-track': {
                                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: hexToRgba(theme.palette.color1.dark, 0.75),
                                borderRadius: '5px'   
                            },
                        }
                    }}
                    defaultValue={stateData.textValue}
                    controlInputFunc={(newVal) => setStateData({...stateData, textValue: newVal})}
                />
                <Typography sx={{position: 'absolute', top: '100%', color: 'rgb(230, 230, 230)', fontSize: '12px'}}>{stateData.textValue.length}/1000</Typography>
                {stateData.emailError && 
                    <Typography sx={{position: 'absolute', top: '100%', right: '0%', color: 'red', fontSize: '12px'}}>This cannot be empty!</Typography>
                }
            </Box>
            {userData.loggedIn && 
            <Box sx={{...theme.components.box.fullCenterRow}}>
                <Typography sx={{position: 'relative', mr: 2}}>
                    Send Anonymously:
                    <Tooltip sx={{position: 'absolute', bottom: '75%', left: '95%', ':hover': {cursor: 'pointer'}, fontSize: '12px'}} title={"Choose to omit your username from the message. Check only if you don't care about receiving a response."} arrow>
                        <HelpIcon/>
                    </Tooltip> 
                </Typography>
                <Checkbox value={stateData.anonymous} onChange={() => setStateData({...stateData, anonymous: !stateData.anonymous})}/>
            </Box>
            }
            <Button variant='contained' size='large' disabled={stateData.sending} sx={{'&.Mui-disabled': {color: 'white'}}} onClick={sendMessage}>{stateData.sending ? <>Sending Message<DotWaitingText/></> : 'Send Message'}</Button>
        </Box>
        </>
    )
}