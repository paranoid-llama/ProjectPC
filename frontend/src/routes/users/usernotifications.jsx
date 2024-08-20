import {Box, Typography, useTheme, ToggleButtonGroup, ToggleButton} from '@mui/material'
import {useState, useEffect} from 'react'
import { useRouteLoaderData, useLoaderData, useNavigate } from 'react-router'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import UserNotificationItem from './usernotificationitem'

export default function UserNotifications({}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const [routeState, setRouteState] = useState({pagination: 1, notificationType: null, unreadOnly: true})
    const notifications = useLoaderData().notifications.toReversed().filter(noti => !routeState.notificationType ? true : noti.type.includes(routeState.notificationType)).filter(noti => routeState.unreadOnly ? noti.unread : true)
    const usePagination = notifications.length > 10
    const shownNotifications = usePagination ? notifications.slice((routeState.pagination-1)*10, routeState.pagination*10) : notifications
    // console.log(notifications)

    return (
        <BodyWrapper  sx={{...theme.components.box.fullCenterCol, margin: 2}}>
            <Box sx={{...theme.components.box.fullCenterCol, maxWidth: '1200px', width: '100%'}}>
                <Box sx={{maxHeight: '150px', height: '10%', width: '100%', ...theme.components.box.fullCenterRow, justifyContent: 'start', mt: -2, pb: 0.5, borderBottom: '1px solid rgba(100,100,100, 0.5)'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', ml: 5}}>
                        <Typography sx={{fontSize: '28px', fontWeight: 700}}>Your Notifications</Typography>
                        
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '100%'}}>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '20%', mt: 1}}>
                        <Box sx={{...theme.components.box.fullCenterCol, width: '60%', height: '100%'}}>
                            <Typography>Filter by Notification Type</Typography>
                            <ToggleButtonGroup value={routeState.notificationType} exclusive onChange={(e, newVal) => setRouteState({...routeState, notificationType: newVal, pagination: 1})}>
                                <ToggleButton value='trade' sx={{paddingY: 0}}>Trade</ToggleButton>
                                <ToggleButton value='site' sx={{paddingY: 0}}>System Message</ToggleButton>
                                <ToggleButton value='update' sx={{paddingY: 0}}>Server Update</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        <Box sx={{...theme.components.box.fullCenterCol, width: '40%', height: '100%'}}>
                            <ToggleButton onChange={() => setRouteState({...routeState, unreadOnly: routeState.unreadOnly ? false : true, pagination: 1})} selected={routeState.unreadOnly} value='' sx={{paddingY: 0}}>Show Unread Only</ToggleButton>
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '80%'}}>
                        <Box sx={{height: '580px', width: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start', flexDirection: 'column', mt: 1}}>
                            {shownNotifications.map((note, idx) => {
                                const onClickFunc = (note.type.includes('trade-offer')) ? () => navigate(`/trades/${note.tradeData.tradeId}`) : null
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
                        
                    </Box>
                </Box>
            </Box>
        </BodyWrapper>
    )
}