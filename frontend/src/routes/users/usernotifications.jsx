import {Box, Typography, useTheme} from '@mui/material'
import { useRouteLoaderData, useLoaderData, useNavigate } from 'react-router'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import UserNotificationItem from './usernotificationitem'

export default function UserNotifications({}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const notifications = useLoaderData().notifications
    // console.log(notifications)

    return (
        <BodyWrapper  sx={{...theme.components.box.fullCenterCol}}>
            <Box sx={{...theme.components.box.fullCenterCol, maxWidth: '1200px', width: '100%'}}>
                <Box sx={{maxHeight: '150px', height: '10%', width: '100%', ...theme.components.box.fullCenterRow, justifyContent: 'start', mt: -2, pb: 2, borderBottom: '1px solid rgba(100,100,100, 0.5)'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', ml: 5}}>
                        <Typography sx={{fontSize: '32px', fontWeight: 700}}>Your Notifications</Typography>
                    </Box>
                </Box>
                <Box sx={{height: '650px', width: '90%', ...theme.components.box.fullCenterCol, justifyContent: 'start', flexDirection: 'column-reverse', mt: 1}}>
                    {notifications.map((note, idx) => {
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
            </Box>
        </BodyWrapper>
    )
}