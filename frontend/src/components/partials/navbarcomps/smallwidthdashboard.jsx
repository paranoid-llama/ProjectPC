import {Box, Typography, useTheme, IconButton, Button, Grid} from '@mui/material'
import { useNavigate, useLocation } from 'react-router'
import DotWaitingText from '../../functionalcomponents/dotwaitingtext'
import hexToRgba from 'hex-to-rgba'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectScreenBreakpoint } from '../../../app/selectors/windowsizeselectors';

const userProfileOptions = ['Notifications', 'Trades', 'Settings', 'Logout']

export default function SmallWidthDashboard({toggleDashboard, userData, unreadNotificationsAmount, navigateUserOption, loggingInOrOut, goToCollectionFunc}) {
    const theme = useTheme()
    const locationData = useLocation()
    const navigate = useNavigate()
    const breakpoint = useSelector(state => selectScreenBreakpoint(state, 'dashboard'))
    const tinyDashboard = breakpoint === 'sm'

    const collectionAreaRef = useRef(null)
    const showCollectionButtonRef = useRef(null)
    const arrow1 = useRef(null)
    const arrow2 = useRef(null)
    const location = locationData.pathname
    const collectionData = userData.collections
    const nameScaling = tinyDashboard ? '16px' : userData.username.length > 16 ? '12px' : '14px'
    // const tinyDashboardCollectionsHeight = collectionData.length === 0 ? '95px' : 
    

    const toggleCollectionArea = () => {
        if (collectionAreaRef.current.style.visibility === 'visible') {
            collectionAreaRef.current.style.visibility = 'hidden'
            showCollectionButtonRef.current.textContent = 'See Collections'
            arrow1.current.style.transform = 'rotate(0deg)'
            arrow2.current.style.transform = 'rotate(0deg)'
        } else {
            collectionAreaRef.current.style.visibility = 'visible'
            showCollectionButtonRef.current.textContent = 'Hide Collections'
            arrow1.current.style.transform = 'rotate(180deg)'
            arrow2.current.style.transform = 'rotate(180deg)'
        }
    }

    return (
        <Box sx={{position: 'absolute', width: '100%', height: tinyDashboard ? '300px' : '123px', top: '100%', right: '0.01%', zIndex: 1, ...theme.components.box.fullCenterCol}}>
            <Box sx={{...theme.components.box.fullCenterRow, flexDirection: tinyDashboard ? 'column' : 'row', zIndex: 1, backgroundColor: theme.palette.color1.dark, width: '100%', height: '100%'}}>
                <Box sx={{...theme.components.box.fullCenterCol, width: tinyDashboard ? '100%' : '25%', mr: tinyDashboard ? 0 : '5px'}}>
                    <Box sx={{width: '50%', height: '100%', ...theme.components.box.fullCenterCol}}>
                        <IconButton><img src={`https://res.cloudinary.com/duaf1qylo/image/upload/icons/user.png`} height='40px' width= '40px'/></IconButton>
                    </Box>
                    <Typography sx={{fontSize: nameScaling, mb: 0.5, textAlign: 'center'}}>Welcome, {userData.username}</Typography>
                    <Button variant='contained' size='small' sx={{borderRadius: '10px', py: 0}} onClick={() => navigate(`/users/${userData.username}`)}>Profile</Button>
                </Box>
                <Box sx={{...theme.components.box.fullCenterCol, width: tinyDashboard ? '100%' : '70%', height: tinyDashboard ? '65%' : '100%'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '100%',  mt: 2}}>
                        <Grid container sx={{width: '100%', height: '100%', border: '1px solid white'}}>
                            {userProfileOptions.map((o, idx) => {
                                const evenOption = idx % 2 === 0
                                const isCollectionOption = o === 'Collections'
                                const isNotifications = o === 'Notifications'
                                const disabledNotifications = isNotifications && location === `/users/${userData.username}/notifications`
                                const linkTo = o === 'Notifications' ? `/users/${userData.username}/notifications` : o === 'Profile' ? `/users/${userData.username}` : o === 'Settings' ? `/users/${userData.username}/settings` : o === 'Logout' ? `/` : o === 'Trades' ? `/users/${userData.username}/trades` : null
                                const backgroundColorStyle = evenOption ? {backgroundColor: theme.palette.color1.main} : {backgroundColor: theme.palette.color1.darker}
                                const hoverStyle = disabledNotifications ? {} : evenOption ? {'&:hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.5), cursor: 'pointer'}} : {'&:hover': {backgroundColor: hexToRgba(theme.palette.color1.darker, 0.3), cursor: 'pointer'}}
                                const textWidth = isNotifications ? {} : {width: '100%'}
                                return (
                                    <Grid item xs={tinyDashboard ? 12 : 6} key={`user-${o}-option`}>
                                    <Box 
                                        sx={{
                                            height: '30px', 
                                            width: '100%', 
                                            borderTop: (tinyDashboard && idx !== 0) ? '1px solid white' : (idx === 0 || idx === 1) ? 'none' : '1px solid white', 
                                            borderLeft: tinyDashboard ? 'none' : !evenOption ? '1px solid white' : 'none',
                                            position: 'relative',
                                            ...theme.components.box.fullCenterCol, 
                                            ...backgroundColorStyle, 
                                            ...hoverStyle
                                        }} 
                                        onMouseEnter={isCollectionOption ? () => toggleCollectionArea(true) : null}
                                        onMouseLeave={isCollectionOption ? () => toggleCollectionArea(false) : null}
                                        onClick={(isCollectionOption || (o === 'Logout' && loggingInOrOut)) || (o === 'Notifications' && location === `/users/${userData.username}/notifications`) ? null : () => navigateUserOption(o === 'Logout', linkTo)}
                                    >
                                        {isNotifications ? 
                                        <Box sx={{position: 'relative', opacity: location === `/users/${userData.username}/notifications` ? 0.5 : 1}}>
                                            <Typography sx={{textAlign: 'center'}}>Notifications</Typography>
                                            {(unreadNotificationsAmount > 0) && 
                                                <Box sx={{width: '20px', height: '20px', borderRadius: '50%', position: 'absolute', bottom: '3px', left: '108%', backgroundColor: 'rgb(250, 53, 69)', opacity: location === `/users/${userData.username}/notifications` ? 0.5 : 1}}>
                                                    <Typography sx={{fontSize: '14px', width: '19px', fontWeight: 700, color: 'white', position: 'absolute', left: '0px', top: '0px', textAlign: 'center'}}>{unreadNotificationsAmount}</Typography>
                                                </Box>
                                            }
                                        </Box> : 
                                        <Typography sx={{...textWidth , textAlign: 'center', position: 'relative', opacity: location === `/users/${userData.username}/notifications` && o === 'Notifications' ? 0.5 : 1}}>
                                            {isCollectionOption && 
                                                <ArrowBack sx={{position: 'absolute', left: '0%', width: '16px'}}/>
                                            }
                                            {(o === 'Logout' && loggingInOrOut) ? <>Logging out<DotWaitingText/></>  : o}
                                        </Typography>
                                        }
                                    </Box>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: tinyDashboard ? '100px' : '100%', position: 'relative', mt: tinyDashboard ? '5px' : '15px'}}>
                        {collectionData.length === 0 ? 
                        <Typography sx={{color: 'grey'}}><i>No Collections</i></Typography> : 
                        <>
                        <Box 
                            sx={{
                                ...theme.components.box.fullCenterRow, 
                                backgroundColor: theme.palette.color1.dark,
                                width: '100%', 
                                position: 'absolute', 
                                top: '0px', 
                                height: '100%', 
                                gap: '3px', 
                                ':hover': {
                                    cursor: 'pointer',
                                    backgroundColor: hexToRgba(theme.palette.color1.main, 0.5)
                                }
                            }}
                            onClick={() => toggleCollectionArea()}
                        >
                            <KeyboardDoubleArrowDownIcon ref={arrow1}/>
                            <Typography ref={showCollectionButtonRef} sx={{fontWeight: 700}}>See Collections</Typography>
                            <KeyboardDoubleArrowDownIcon ref={arrow2}/>
                            
                        </Box>
                        <Box 
                            ref={collectionAreaRef} 
                            sx={{
                                position: 'absolute', 
                                width: '300px', 
                                height: `${32*collectionData.length}px`, 
                                top: '99%', 
                                backgroundColor: theme.palette.color1.main, 
                                visibility: 'hidden',
                            }}
                        >
                            {collectionData.map((col, idx) => {
                                const isFirst = idx === 0
                                const disabled = location === `/collections/${col._id}` || location === `/collections/${col._id}/edit`
                                const hoverBorderRadiusKeep = idx === 0 ? {borderTopLeftRadius: '10px'} : idx === collectionData.length-1 ? {borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'} : {}
                                const collectionHoverStyle = disabled ? {opacity: 0.75} : {'&:hover': {backgroundColor: hexToRgba(theme.palette.color1.dark, 0.5), ...hoverBorderRadiusKeep, cursor: 'pointer'}}
                                const collectionType = isNaN(parseInt(col.gen)) ? `${col.gen.toUpperCase()} Aprimon Collection` : `Gen ${col.gen} Aprimon Collection`
                                return (
                                    <Box 
                                        sx={{
                                            height: `32px`, 
                                            width: '100%', 
                                            borderTop: isFirst ? 'none' : '1px solid white', 
                                            position: 'relative',
                                            ...theme.components.box.fullCenterCol, 
                                            ...collectionHoverStyle
                                        }}
                                        key={`user-collection-${idx+1}-option-${collectionType}`}
                                        onClick={disabled ? null : () => goToCollectionFunc(`/collections/${col._id}`)}
                                    > 
                                        <Typography>{collectionType}</Typography>
                                    </Box>
                                )
                            })}
                        </Box>
                        </>
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}