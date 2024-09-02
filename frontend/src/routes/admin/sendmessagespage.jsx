import {Box, Typography, useTheme, ToggleButton, ToggleButtonGroup, Button} from '@mui/material'
import { useState, useContext } from 'react'
import { ErrorContext } from '../../app/contexts/errorcontext'
import { AlertsContext } from '../../alerts/alerts-context'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import ControlledTextInput from '../../components/functionalcomponents/controlledtextinput'
import hexToRgba from 'hex-to-rgba'
import DotWaitingText from '../../components/functionalcomponents/dotwaitingtext'
import sendNotifications from '../../../utils/functions/backendrequests/api/sendnotifications'

export default function SendMessagesPage({}) {
    const theme = useTheme()
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const [data, setData] = useState({username: '', title: '', message: '', overrideNotiType: '', sending: false})

    const sendNotificationsFinalize = () => {
        setData({...data, sending: true})
        const backendFunc = async() => sendNotifications(data.title, data.message, data.username, data.overrideNotiType)
        const successFunc = () => {
            setData({...data, sending: false})
            addAlert({severity: 'success', timeout: 4, message: 'Sent notifications!'})
        }
        const errorFunc = () => {setData({...data, sending: false})}
        handleError(backendFunc, false, successFunc, errorFunc)
    }

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, gap: 1}}>
            <Typography sx={{fontSize: '36px', fontWeight: 700, mb: 2}}>Send notifications to users</Typography>
            <Typography sx={{my: 2}}>Leave blank to give notifications to all:</Typography>
            <ControlledTextInput 
                textFieldProps={{
                    placeholder: 'Username'
                }}
                textFieldStyles={{
                    '&.MuiTextField-root': {
                        width: '60%',
                        minWidth: '200px'
                    },
                }}
                defaultValue={data.username}
                controlInputFunc={(newVal) => setData({...data, username: newVal})}
            />
            <ControlledTextInput 
                textFieldProps={{
                    placeholder: 'Title'
                }}
                textFieldStyles={{
                    '&.MuiTextField-root': {
                        width: '60%',
                        minWidth: '200px'
                    },
                }}
                defaultValue={data.title}
                controlInputFunc={(newVal) => setData({...data, title: newVal})}
            />
            <ControlledTextInput
                textFieldProps={{
                    multiline: true,
                    rows: 15,
                    placeholder: 'Message',
                }}
                textFieldStyles={{
                    '&.MuiTextField-root': {
                        width: '60%',
                        minWidth: '200px'
                    },
                    '& .MuiInputBase-input': {
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
                defaultValue={data.message}
                controlInputFunc={(newVal) => setData({...data, message: newVal})}
            />
            <Typography>Override Notification Type:</Typography>
            <ToggleButtonGroup value={data.overrideNotiType} exclusive onChange={(e, newVal) => setData({...data, overrideNotiType: newVal})}>
                <ToggleButton value='system'>System Message</ToggleButton>
                <ToggleButton value='site update'>Site Update</ToggleButton>
            </ToggleButtonGroup>
            <Button variant='contained' size='large' sx={{my: 3}} disabled={data.sending} onClick={sendNotificationsFinalize}>{data.sending ? <>Send Message<DotWaitingText/></> : 'Send Message'}</Button>
        </BodyWrapper>
    )
}