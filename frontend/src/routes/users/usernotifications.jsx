import {Box, Typography, useTheme, ToggleButtonGroup, ToggleButton, Button} from '@mui/material'
import { ErrorContext } from '../../app/contexts/errorcontext'
import {useState, useEffect, useContext} from 'react'
import { useRouteLoaderData, useLoaderData, useNavigate, useRevalidator } from 'react-router'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import UserNotificationItem from './usernotificationitem'
import readNotification from '../../../utils/functions/backendrequests/users/readnotification'
import hexToRgba from 'hex-to-rgba'

export default function UserNotifications({userData}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const {handleError} = useContext(ErrorContext)
    const [routeState, setRouteState] = useState({pagination: 1, notificationType: null, unreadOnly: true, viewNotification: ''})
    // const userData = useLoaderData()
    const revalidator = useRevalidator()
    const notifications = userData.notifications.toReversed().filter(noti => !routeState.notificationType ? true : noti.type.includes(routeState.notificationType)).filter(noti => routeState.unreadOnly ? noti.unread : true)
    const usePagination = notifications.length > 10
    const shownNotifications = usePagination ? notifications.slice((routeState.pagination-1)*10, routeState.pagination*10) : notifications
    // console.log(notifications)

    const viewNotificationDetails = routeState.viewNotification && notifications.filter(noti => noti._id === routeState.viewNotification)[0]
    useEffect(() => {
        if (routeState.viewNotification && viewNotificationDetails.unread) {
            const backendFunc = async() => await readNotification(userData.username, viewNotificationDetails._id, false)
            handleError(backendFunc, false, () => {}, () => {}, false, true)
        }
    }, [routeState.viewNotification])

    return (
        <BodyWrapper  sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, maxWidth: '1200px', width: '100%'}}>
                <Box sx={{maxHeight: '150px', height: '10%', width: '100%', ...theme.components.box.fullCenterRow, justifyContent: 'start', mt: -2, pb: 0.5, borderBottom: '1px solid rgba(100,100,100, 0.5)'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', ml: 5}}>
                        <Typography sx={{fontSize: '32px', fontWeight: 700}}>Your Notifications</Typography>
                        
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '100%'}}>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '20%', mt: 1}}>
                        <Box sx={{...theme.components.box.fullCenterCol, width: '60%', height: '100%'}}>
                            <Typography>Filter by Notification Type</Typography>
                            <ToggleButtonGroup value={routeState.notificationType} exclusive onChange={(e, newVal) => setRouteState({...routeState, notificationType: newVal, pagination: 1, viewNotification: ''})}>
                                <ToggleButton value='trade' sx={{paddingY: 0}}>Trade</ToggleButton>
                                <ToggleButton value='system' sx={{paddingY: 0}}>System Message</ToggleButton>
                                <ToggleButton value='site update' sx={{paddingY: 0}}>Site Update</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        <Box sx={{...theme.components.box.fullCenterCol, width: '40%', height: '100%'}}>
                            <ToggleButton onChange={() => setRouteState({...routeState, unreadOnly: routeState.unreadOnly ? false : true, pagination: 1, viewNotification: ''})} selected={routeState.unreadOnly} value='' sx={{paddingY: 0}}>Show Unread Only</ToggleButton>
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '80%', position: 'relative'}}>
                        {!routeState.viewNotification ? 
                        <>
                        <Box sx={{height: '580px', width: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start', flexDirection: 'column', mt: 1}}>
                            {shownNotifications.map((note, idx) => {
                                const onClickFunc = (note.type.includes('trade-offer')) ? () => navigate(`/trades/${note.tradeData.tradeId}`) : () => setRouteState({...routeState, viewNotification: note._id})
                                return (
                                    <UserNotificationItem 
                                        key={`notification-${idx+1}`}
                                        notiType={note.type}
                                        notiTradeData={note.tradeData}
                                        notiTitle={note.title}
                                        notiMessage={note.message}
                                        unread={note.unread}
                                        onClickFunc={onClickFunc}
                                    />
                                )
                            })}
                        </Box>
                        
                        <Box sx={{...theme.components.box.fullCenterRow, width: '100%', mt: 1.5, position: 'relative', height: '40px'}}>
                            {usePagination && 
                            <Box sx={{...theme.components.box.fullCenterRow, width: '100%', position: 'absolute', top: '0px'}}>
                            {Array.from({length: notifications.length < 21 ? 2 : notifications.length < 31 ? 3 : 4}, (_, i) => i+1).map(pageNum => {
                                return (
                                    <ToggleButton 
                                        key={`notifications-page-${pageNum}`} 
                                        onClick={(e, newVal) => setRouteState({...routeState, pagination: newVal})}
                                        value={pageNum}
                                        selected={pageNum === routeState.pagination}
                                        sx={{
                                            borderRadius: '50%',
                                            border: 'none', 
                                            mx: 1, 
                                            px: 2, 
                                            my: 1, 
                                            py: 0.5
                                        }}
                                    >
                                        {pageNum}
                                    </ToggleButton>
                                )
                            })
                            }
                            </Box>
                            }
                        </Box>
                        </> : 
                        <>
                        <Box sx={{height: '580px', width: '80%', ...theme.components.box.fullCenterCol, justifyContent: 'start', flexDirection: 'column', mt: 1}}>
                            <Box sx={{...theme.components.box.fullCenterCol, height: '85%', width: '100%', justifyContent: 'start', padding: 1, paddingX: 2, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), color: 'white', borderRadius: '15px', border: `2px solid ${theme.palette.color1.main}`}}>
                                <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', height: '10%', width: '100%', position: 'relative', borderBottom: `4px solid ${theme.palette.color1.main}`}}>
                                    <Typography sx={{fontWeight: 700, fontSize: '24px'}}>{viewNotificationDetails.title}</Typography>
                                    <Typography sx={{fontSize: '14px', position: 'absolute', right: '0px', top: '0px'}}>{viewNotificationDetails.type === 'system' ? '[SYSTEM]' : '[UPDATE]'}</Typography>
                                </Box>
                                <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', height: '90%', width: '80%', position: 'relative', mt: 1}}>
                                    <Typography sx={{fontSize: '14px'}}>{viewNotificationDetails.message}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{...theme.components.box.fullCenterCol, height: '10%', width: '20%', position: 'absolute', left: '0px', bottom: '0px'}}>
                                <Button sx={{fontSize: '12px'}} onClick={() => {setRouteState({...routeState, viewNotification: ''})}}>See all notifications</Button>
                            </Box>
                            {viewNotificationDetails.type === 'site update' &&
                            <Box sx={{...theme.components.box.fullCenterCol, height: '10%', width: '20%', position: 'absolute', bottom: '0px', right: '0px'}}>
                                <Button sx={{fontSize: '12px'}} onClick={() => {navigate('/announcements')}}>See announcements</Button>
                            </Box>
                            }
                        </Box>
                        </>
                        }
                    </Box>
                </Box>
            </Box>
        </BodyWrapper>
    )
}