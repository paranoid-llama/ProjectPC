import "./navbar.css"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {Tooltip} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useTheme, Button } from "@mui/material";
import ControlledTextInput from "../functionalcomponents/controlledtextinput";
import { Fragment, useState, useRef, useEffect, useContext } from "react";
import { ErrorContext } from "../../app/contexts/errorcontext";
import { AlertsContext } from "../../alerts/alerts-context";
import { useNavigate, useRouteLoaderData, useLoaderData, useRevalidator, useLocation } from "react-router-dom";
import userLoginRequest from "../../../utils/functions/backendrequests/users/login";
import userLogoutRequest from "../../../utils/functions/backendrequests/users/logout";
import hexToRgba from "hex-to-rgba";

export default function NavBar() {
    const theme = useTheme()
    const navigate = useNavigate()
    const {handleError} = useContext(ErrorContext)
    const revalidator = useRevalidator()
    const userData = useRouteLoaderData('root')
    const location = useLocation().pathname
    const usernameFieldRef = useRef(null)
    const passwordFieldRef = useRef(null)
    const collectionAreaRef = useRef(null)
    const [loginArea, setLoginArea] = useState({open: false, usernameError: false, passwordError: false}) 
    //we only check for errors if one field is left empty. if it's wrong, we transfer over to the login route
    const [userArea, setUserArea] = useState({open: false})
    const toggleLoginArea = () => {
        setLoginArea({...loginArea, open: !loginArea.open})
        if (loginArea.open === false) {
            setTimeout(() => {
                usernameFieldRef.current.focus()
            }, 1)
        }
    }

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

    useEffect(() => {
        if (userData.loggedIn) {
            revalidator.revalidate()
        }
    }, [location])

    const toggleUserArea = () => {
        setUserArea({...userArea, open: !userArea.open})
    }

    const toggleCollectionArea = (entering) => {
        if (entering) {
            collectionAreaRef.current.style.visibility = 'visible'
        } else {
            collectionAreaRef.current.style.visibility = 'hidden'
        }
    }

    const navigateUserOption = async(isLogout, link) => {
        if (!isLogout) {
            setUserArea({open: false})
            navigate(link)
        } else {
            const backendFunc = async() => await userLogoutRequest()
            const successFunc = () => {
                //spawning alert
                const alertMessage = `Logged out successfully!`
                const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                const id = addAlert(alertInfo);
                setAlertIds((prev) => [...prev, id]);
                navigate(link)
                setUserArea({open: false})
                revalidator.revalidate()
            }
            handleError(backendFunc, false, successFunc, () => {})   
        }
    }

    const finalizeLogin = async() => {
        const userData = {username: usernameFieldRef.current.value, password: passwordFieldRef.current.value}
        if (userData.username.length === 0 || userData.password.length === 0) {
            setLoginArea({...loginArea, usernameError: userData.username.length === 0, passwordError: userData.password.length === 0})
            return 
        }
        const backendFunc = async() => await userLoginRequest(userData)
        const successFunc = (loginStatus) => {
            if (loginStatus.successful === false) {
                navigate('/login', {state: {error: true, message: 'One or more fields are incorrect!'}})
                setLoginArea({open: false, usernameError: false, passwordError: false})
            } else {
                // navigate(0)
                //spawning alert
                const alertMessage = `Logged in as ${userData.username}!`
                const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                const id = addAlert(alertInfo);
                setAlertIds((prev) => [...prev, id]);
                setLoginArea({open: false})
                revalidator.revalidate()

                if (location.includes('forgot-password')) {
                    navigate('/')
                }
            }
        }
        handleError(backendFunc, false, successFunc, () => {})
    }

    const icons = userData.loggedIn ? ['homeicon', 'search', 'createcollection', 'user'] : ['homeicon', 'search', 'createcollection', 'login']
    const iconLinks = userData.loggedIn ? ['/', '/search', '/collections/new', `/users/${userData.username}`] : ['/', '/search', '/collections/new', '/login']
    const userProfileOptions = ['Notifications', 'Profile', 'Collections', 'Trades', 'Settings', 'Logout']
    const unreadNotificationsAmount = userData.loggedIn && userData.user.notifications.map((noti) => noti.unread ? 1 : 0).reduce((accumulator, currValue) => accumulator+currValue, 0)

    const loginFieldStyles = {
        '& .MuiInputBase-input': {
            padding: 0.5,
            color: 'white'
        }, 
        mx: 2,
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white'
            },
            '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.75)'
            },
            '& .Mui-focused': {
                borderColor: 'white'
            }
        },
        '& .MuiInputLabel-root': {
            color: 'white'
        },
        '& .MuiInputBase-inputSizeSmall': {
            color: 'white'
        },
    }

    const dontHaveAccount = () => {
        setLoginArea({...loginArea, open: false})
        navigate('/register')
    }

    return (
        <>
        {/* below box covers the page when someone tries logging in, but it needs to be outside the navbar so the navbar can still be clickable */}
        {loginArea.open && <Box onClick={toggleLoginArea} sx={{width: '100vw', height: '100vh', position: 'fixed', opacity: 0.5, backgroundColor: 'black', zIndex: 250}}></Box> }
        <Box sx={{width: '100%', height: '61px', zIndex: 300}}>
            <AppBar position="relative">
                <div className="NavBar">
                    <Typography
                        variant="h4"
                        noWrap
                        sx={{flexGrow: 1, display: {sm: 'flex'}, mx: 5}}
                        className="NavTypography"
                    >
                        <Link href="/" sx={{color: '#FFF'}} underline="none">Pokellections</Link>
                    </Typography>
                    
                    {loginArea.open && 
                    <Box sx={{position: 'absolute', width: '50%', minWidth: '360px', maxWidth: '500px', height: '175px', top: '100%', right: '0.01%', zIndex: 1, ...theme.components.box.fullCenterCol}}>
                        <Box sx={{...theme.components.box.fullCenterCol, zIndex: 1, backgroundColor: theme.palette.color1.dark, width: '100%', height: '100%', borderBottom: '1px solid black', borderLeft: '1px solid black', borderBottomLeftRadius: '10px'}}>
                            <Typography sx={{fontWeight: 700, mb: 0.75}}>Login</Typography>
                            <Box sx={{...theme.components.box.fullCenterRow, width: '100%'}}>
                                <Typography sx={{width: '40%', textAlign: 'end'}}>Username/Email:</Typography>
                                <ControlledTextInput 
                                    textFieldStyles={loginFieldStyles} 
                                    textFieldProps={{
                                        inputRef: usernameFieldRef,
                                        error: loginArea.usernameError
                                    }}
                                />
                            </Box>
                            <Box sx={{...theme.components.box.fullCenterRow, mt: 1, width: '100%'}}>
                                <Typography sx={{width: '40%', textAlign: 'end'}}>Password:</Typography>
                                <ControlledTextInput 
                                    textFieldStyles={loginFieldStyles}
                                    textFieldProps={{
                                        inputRef: passwordFieldRef,
                                        InputProps: {type: 'password'},
                                        error: loginArea.passwordError
                                    }}
                                />
                            </Box>
                            <Button variant='contained' size='small' sx={{mt: 1.5, py: 0.5}} onClick={finalizeLogin}>Login</Button>
                            <Box sx={{...theme.components.box.fullCenterCol, width: '100%'}}>
                                <Button sx={{fontSize: '8px', padding: 0.25}} onClick={() => navigate('/forgot-password')}>I forgot my password</Button>
                                <Button sx={{fontSize: '8px', padding: 0.25}} onClick={dontHaveAccount}>I don't have an account</Button>
                            </Box>
                        </Box>
                    </Box>}
                    {userArea.open &&
                    <Box sx={{position: 'absolute', width: '50%', minWidth: '200px', maxWidth: '300px', height: '315px', top: '100%', right: '0.01%', zIndex: 1, ...theme.components.box.fullCenterCol}}>
                        <Box sx={{...theme.components.box.fullCenterCol, zIndex: 1, backgroundColor: theme.palette.color1.dark, width: '100%', height: '100%', borderBottom: '1px solid black', borderLeft: '1px solid black', borderBottomLeftRadius: '10px'}}>
                            <Box sx={{width: '90%', height: '40%', ...theme.components.box.fullCenterCol}}>
                                <Box sx={{width: '50%', height: '100%', ...theme.components.box.fullCenterCol}}>
                                    <IconButton><img src={`https://res.cloudinary.com/duaf1qylo/image/upload/icons/user.png`} height='40px' width= '40px'/></IconButton>
                                </Box>
                                <Typography sx={{fontSize: '16px', mb: 1.5, textAlign: 'center'}}>Welcome, {userData.user.username}</Typography>
                            </Box>
                            {userProfileOptions.map((o, idx) => {
                                const evenOption = idx % 2 === 0
                                const isCollectionOption = o === 'Collections'
                                const isNotifications = o === 'Notifications'
                                const linkTo = o === 'Notifications' ? `/users/${userData.user.username}/notifications` : o === 'Profile' ? `/users/${userData.user.username}` : o === 'Settings' ? `/users/${userData.user.username}/settings` : o === 'Logout' ? `/` : o === 'Trades' ? `/users/${userData.user.username}/trades` : null
                                const backgroundColorStyle = evenOption ? {backgroundColor: theme.palette.color1.main} : {backgroundColor: theme.palette.color1.darker}
                                const hoverStyle = evenOption ? {'&:hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.5), cursor: 'pointer'}} : {'&:hover': {backgroundColor: hexToRgba(theme.palette.color1.darker, 0.3), cursor: 'pointer'}}
                                return (
                                    <Box 
                                        sx={{
                                            height: '35px', 
                                            width: '100%', 
                                            borderTop: '1px solid white', 
                                            position: 'relative',
                                            ...theme.components.box.fullCenterCol, 
                                            ...backgroundColorStyle, 
                                            ...hoverStyle
                                        }} 
                                        key={`user-${o}-option`}
                                        onMouseEnter={isCollectionOption ? () => toggleCollectionArea(true) : null}
                                        onMouseLeave={isCollectionOption ? () => toggleCollectionArea(false) : null}
                                        onClick={isCollectionOption ? null : () => navigateUserOption(o === 'Logout', linkTo)}
                                    >
                                        <Typography sx={{width: '100%', textAlign: 'center', position: 'relative'}}>
                                            {isCollectionOption && 
                                                <ArrowBack sx={{position: 'absolute', left: '0%', width: '16px'}}/>
                                            }
                                            {o}
                                            
                                        </Typography>
                                        {(isNotifications && unreadNotificationsAmount > 0) && 
                                            <Box sx={{width: '20px', height: '20px', borderRadius: '50%', position: 'absolute', bottom: '20%', right: '75px', backgroundColor: 'rgb(250, 53, 69)'}}>
                                                <Typography sx={{fontSize: '14px', width: '19px', fontWeight: 700, color: 'white', position: 'absolute', left: '0px', top: '0px', textAlign: 'center'}}>{unreadNotificationsAmount}</Typography>
                                            </Box>
                                        }
                                        {isCollectionOption && 
                                            <Box 
                                                ref={collectionAreaRef} 
                                                sx={{
                                                    position: 'absolute', 
                                                    width: '300px', 
                                                    height: `${32*userData.user.collections.length}px`, 
                                                    right: '100%',
                                                    top: '0%', 
                                                    backgroundColor: theme.palette.color1.dark, 
                                                    visibility: 'hidden',
                                                    borderRadius: '10px',
                                                    borderTopRightRadius: '0px'
                                                }}
                                            >
                                                {userData.user.collections.map((col, idx) => {
                                                    const isFirst = idx === 0
                                                    const hoverBorderRadiusKeep = idx === 0 ? {borderTopLeftRadius: '10px'} : idx === userData.user.collections.length-1 ? {borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'} : {}
                                                    const collectionHoverStyle = {'&:hover': {backgroundColor: theme.palette.color1.main, ...hoverBorderRadiusKeep}}
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
                                                            onClick={() => {
                                                                navigate(`/collections/${col._id}`)
                                                                setUserArea({open: false})
                                                            }}
                                                        > 
                                                            <Typography>{collectionType}</Typography>
                                                        </Box>
                                                    )
                                                })}
                                            </Box>
                                        }
                                    </Box>
                                )
                            })}
                            
                        </Box>
                    </Box>
                    }
                    {icons.map((i, idx) => {
                        const isLogin = i === 'login'
                        const isUserProfile = i === 'user'
                        const doubleWord = i === 'homeicon' || i === 'createcollection'
                        const display = !doubleWord ? i[0].toUpperCase() + i.slice(1, i.length) : i === 'homeicon' ? 'Home' : 'New Collection'
                        return (
                            <Fragment key={i}>
                                {(!isLogin && !isUserProfile) ?
                                <Tooltip title={display} arrow>
                                <Link 
                                    href={iconLinks[idx]} 
                                    sx={{mr: 2, display: {sm:'flex'}, justifyContent: {xs: 'center'}, width: '50px'}}
                                >
                                    <IconButton
                                        size="small"
                                        edge="end"
                                        aria-label={i === 'createcollection' ? `${i.slice(0, 5)} ${i.slice(6, 15)}` : i}
                                        className="NavIcons"
                                    >
                                        <img src={`https://res.cloudinary.com/duaf1qylo/image/upload/icons/${i}white.png`} height='20px' width='20px'/>
                                    </IconButton>
                                </Link></Tooltip> : 
                                isUserProfile ? 
                                <IconButton
                                    size="small"
                                    sx={{mr: 2, display: {sm:'flex'}, justifyContent: {xs: 'center'}, width: '50px', position: 'relative'}}
                                    edge="end"
                                    aria-label={i}
                                    className="NavIcons"
                                    onClick={toggleUserArea}
                                >
                                    <img src={`https://res.cloudinary.com/duaf1qylo/image/upload/icons/${i}.png`} height='32px' width= '32px'/>
                                    {unreadNotificationsAmount > 0 && 
                                    <Box sx={{width: '15px', height: '15px', borderRadius: '50%', position: 'absolute', bottom: '0px', right: '5px', backgroundColor: 'rgb(250, 53, 69)'}}>
                                        <Typography sx={{fontSize: '11px', fontWeight: 700, color: 'white'}}>{unreadNotificationsAmount}</Typography>
                                    </Box>}
                                </IconButton> : 
                                <Tooltip title={display} arrow>
                                <IconButton
                                    size="small"
                                    sx={{mr: 2, display: {sm:'flex'}, justifyContent: {xs: 'center'}, width: '50px',}}
                                    edge="end"
                                    aria-label={i}
                                    className="NavIcons"
                                    onClick={toggleLoginArea}
                                >
                                    <img src={`https://res.cloudinary.com/duaf1qylo/image/upload/icons/${i}white.png`} height='20px' width= '20px'/>
                                </IconButton></Tooltip>
                                }
                            </Fragment>
                        )
                    })}
                </div>
            </AppBar>
        </Box>
        </>
    )
}