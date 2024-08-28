import {Box, useTheme, Typography, Grid, styled, Button, Tooltip} from '@mui/material'
import { useRef, useContext, forwardRef } from 'react'
import { AlertsContext } from '../alerts/alerts-context'
import { ErrorContext } from '../app/contexts/errorcontext'
import BodyWithBanner from '../components/partials/routepartials/bodywithbanner'
import { useNavigate, useLoaderData, useRouteLoaderData, useRevalidator } from 'react-router-dom'
import ImgData from '../components/collectiontable/tabledata/imgdata'
import TextSpaceSingle from '../components/titlecomponents/subcomponents/textspacesingle'
import hexToRgba from 'hex-to-rgba'
import { gamesOrder } from '../../common/infoconstants/miscconstants'
import { Virtuoso } from 'react-virtuoso'
import { getBallProgress } from '../../utils/functions/ballprogresscircle/ballprogressstate'
import SearchCollectionItem from '../components/functionalcomponents/search/searchcollectionitem'
import SimpleBar from 'simplebar-react'
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import BlockIcon from '@mui/icons-material/Block';
import userSettingsBackendRequest from '../../utils/functions/backendrequests/users/settings'
import 'simplebar-react/dist/simplebar.min.css'
import "./showUser.css"

const badgeData = {
    'apri-novice' : {display: 'Aprimon Novice', tooltip: 'Start an aprimon collection'},
    'apri-amateur' : {display: 'Aprimon Amateur', tooltip: 'Complete 25% or more of an aprimon collection'},
    'apri-enthusiast' : {display: 'Aprimon Enthusiast', tooltip: 'Complete 50% or more of an aprimon collection'},
    'apri-expert' : {display: 'Aprimon Expert', tooltip: 'Complete 75% or more of an aprimon collection'},
    'apri-master' : {display: 'Aprimon Master', tooltip: 'Complete an aprimon collection'},
    'apri-multigen' : {display: 'Multi-Generational Master', tooltip: 'Complete multiple aprimon collections'},
    'trader-new' : {display: 'New Trader', tooltip: 'Complete a trade'},
    'trader-aspiring' : {display: 'Aspiring Trader', tooltip: 'Complete 5 trades'},
    'trader-avid' : {display: 'Avid Trader', tooltip: 'Complete 10 trades'},
    'trader-experienced' : {display: 'Experienced Trader', tooltip: 'Complete 25 trades'},
    'trader-veteran' : {display: 'Veteran Trader', tooltip: 'Complete 50 trades'},
    'trader-breeder' : {display: 'Pokémon Breeder', tooltip: 'Complete 100 or more trades'},
}

//user profile page
export default function ShowUser({userData}) {
    const navigate = useNavigate()
    // const userData = useLoaderData()
    const revalidator = useRevalidator()
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const loggedInUserData = useRouteLoaderData("root")
    const isUser = loggedInUserData.loggedIn === true && (loggedInUserData.user._id === userData._id)
    const userIsBlocked = !isUser && loggedInUserData.loggedIn && loggedInUserData.user.settings.privacy.blockedUsers.includes(userData.username)
    
    const theme = useTheme()
    const gameScrollRef = useRef()

    const textColor1 = {
        bgColor: `linear-gradient(90deg, ${hexToRgba(theme.palette.color1.main)} 90%, rgba(60,165,186,0) 100%)`,
        isGradient: true,
        textColor: theme.palette.color1.contrastText,
        labelBgColor: theme.palette.color1.dark
    }

    const textColor2 = {
        bgColor: `linear-gradient(90deg, ${hexToRgba(theme.palette.color3.main)} 90%, rgba(60,165,186,0) 100%)`,
        isGradient: true,
        textColor: theme.palette.color3.contrastText,
        labelBgColor: theme.palette.color3.dark
    }
    const userBadges = userData.settings.profile.badges.map(b => badgeData[b])
    const userGames = userData.settings.profile.games

    const tagTextStyles = {
        '@media only screen and (min-width: 908px) and (max-width: 1043px)': {
            marginRight: '20px'
        },
        '@media only screen and (min-width: 1044px) and (max-width: 1150px)': {
            marginRight: '40px'
        },
        fontSize: '14px',
        // fontStyle: userBadges.length === 0 ? 'italic' : 'normal',
        // color: userBadges.length === 0 ? 'grey' : 'inherit',
        // width: '100%', 
        // textAlign: userBadges.length === 0 ? 'center' : 'start'
    }

    const noBadgeTextStyle = {
        color: 'rgb(50, 50, 50)',
        fontStyle: 'italic',
        width: '100%',
        textAlign: 'center'
    }
    const bio = userData.settings.profile.bio

    const noBioStyles = bio !== '' ? {} : {
        color: 'rgb(200, 200, 200)',
        fontSize: '16px',
        fontStyle: 'italic',
        width: '100%', 
        textAlign: 'center'
    }

    const tagAreaStyles = {
        '@media only screen and (max-width: 768px)': {
            marginLeft: 0
        },
        '@media only screen and (min-width: 772px) and (max-width: 1150px)': {
            marginLeft: '2%'
        },
        '@media only screen and (min-width: 1151px)': {
            marginLeft: '10%'
        },
        gap: userBadges.length >= 3 ? 0.5 : 2
    }

    const horizontalScroll = (e) => {
        if (e.deltaY > 0) {
            gameScrollRef.current.scrollLeft += 50;
        } else {
            gameScrollRef.current.scrollLeft -= 50;
        }
    }

    const blockUserRequest = () => {
        const backendFunc = async() => await userSettingsBackendRequest('blockUser', userData.username, loggedInUserData.user.username)
        const successFunc = () => {
            revalidator.revalidate()
            addAlert({severity: 'success', timeout: 3, message: `${userIsBlocked ? 'Unb' : 'B'}locked this user!`})
        }
        handleError(backendFunc, false, successFunc, () => {})
    }
    
    const generateEditBioButton = () => {
        return (
            <Button sx={{borderRadius: '50%'}} onClick={() => navigate(`/users/${userData.username}/settings`, {state: {catInit: 'profile'}})}>
                <EditIcon/>
            </Button>
        )
    }

    const generateSettingsButton = () => {
        return (
            <Button sx={{borderRadius: '50%', padding: 0, height: '100%', color: 'grey'}} onClick={() => navigate(`/users/${userData.username}/settings`)}>
                <SettingsIcon color='grey'/>
            </Button>
        )
    }

    const generateBlockButton = () => {
        const bgStyle = userIsBlocked ? {':hover': {backgroundColor: 'rgba(200, 100, 100, 0.5)'}, width: '32px', backgroundColor: 'rgba(200, 100, 100, 0.5)', boxShadow: '0px 5px 4px -4px rgba(200,100,100,0.4), 0px 5px 5px 0px rgba(200,100,100,0.14), 0px 5px 7px 0px rgba(200,100,100,0.12)'} : {}
        return (
            <Tooltip title={`${userIsBlocked ? 'Unb' : 'B'}lock User`}>
                <Button size='small' sx={{borderRadius: '50%', padding: 0, width: '100%', height: '100%', color: 'red', ...bgStyle}} onClick={blockUserRequest}>
                    <BlockIcon color='red'/>
                </Button>
            </Tooltip>
        )
    }

    return (
        <BodyWithBanner bannerSx={{backgroundColor: theme.palette.color1.light, color: theme.palette.color1.contrastTextLight}} bodySx={{mb: 0, mt: 2}} text={`${userData.username}'s profile`}>
            <Box sx={{minHeight: '250px', ...theme.components.box.fullCenterRow}}>
                <Box sx={{opacity: 0.5}}><ImgData type='icons' linkKey='user' size='200px'/></Box>
                <Box sx={{width: '70%', ml: 3, ...theme.components.box.fullCenterCol}}>
                    <TextSpaceSingle 
                        colorStyles={textColor1}
                        otherStyles={{borderBottom: '1px solid white', marginBottom: 0, position: 'relative'}} 
                        text={userData.username}
                        label={'Username'}
                        width='100%'
                        buttonAdornmentFunc={isUser ? generateSettingsButton : loggedInUserData.loggedIn ? generateBlockButton : undefined}
                        textTag={userData.accountType !== 'regular' ? `${userData.accountType[0].toUpperCase()}${userData.accountType.slice(1, userData.accountType.length)}` : undefined}
                        textTagStyle={{backgroundColor: theme.palette.color3.main}}
                    />
                    <TextSpaceSingle 
                        colorStyles={textColor2}
                        otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
                        otherTextStyles={userBadges.length === 0 ? noBadgeTextStyle : tagTextStyles}
                        tagAreaStyles={tagAreaStyles}
                        multipleTexts={userBadges}
                        multipleTextTooltips={true}
                        text={userBadges.length === 0 ? 'No Badges' : undefined}
                        displayingTags={userBadges.length !== 0}
                        width='100%'
                    />
                    <TextSpaceSingle 
                        colorStyles={textColor1}
                        otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
                        largeTextArea={true}
                        largeTextAreaStyles={{height: '50%', minHeight: '80px', display: 'flex', alignItems: 'center', position: 'relative'}}
                        largeTextStyles={{textAlign: 'start', color: textColor1.textColor, mx: 2, mr: '10%', fontSize: '12px', ...noBioStyles}}
                        text={bio === '' ? 'No Bio' : bio}
                        width='100%'
                        buttonAdornmentFunc={isUser ? generateEditBioButton : undefined}
                    />
                </Box>
            </Box>
            <Box sx={{minHeight: '80px', ...theme.components.box.fullCenterCol, mt: -3}}>
                <Box sx={{width: '100%', position: 'relative', display: 'flex', justifyContent: 'center'}}>
                    {userGames.length !== 0 ? 
                    <Box 
                        ref={gameScrollRef}
                        sx={{
                            position: 'relative', 
                            display: 'flex', 
                            overflowX: 'scroll',
                            '&::-webkit-scrollbar': {
                                height: '0.3em'
                            },
                            '&::-webkit-scrollbar-track': {
                                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: hexToRgba(theme.palette.color1.dark, 0.75),
                                borderRadius: '5px'   
                            },
                            touchAction: 'none'
                        }}
                        onWheel={(e) => horizontalScroll(e)}
                    >
                    {userGames.map((game) => {
                        return (
                            <Box sx={{mx: 2}} key={`pokemon-${game}-icon`}>
                                <ImgData type='icons' linkKey={game} imgFolder={`h_60,c_scale/icons`} size='inherit'/>
                            </Box>
                        )
                    })}
                    </Box> : 
                    <Typography sx={{fontSize: '18px', color: 'grey'}}><i>This user has not listed any games</i></Typography>
                    }
                </Box>
            </Box>
            <Box sx={{...theme.components.box.fullCenterCol, mt: 3}}>
                {userData.collections.length !== 0 ?
                <>
                <Typography sx={{fontSize: '24px', fontWeight: 700}}>
                    Collections
                </Typography>
                <SimpleBar 
                    style={{
                        height: '100%', 
                        width: '100%', 
                        maxHeight: '300px', 
                        maxWidth: '1200px',
                        border: '1px solid black',
                        borderRadius: '10px'
                    }}
                >
                    <Virtuoso 
                        style={{
                            height: `${userData.collections.length*50}px`, 
                            width: '100%',
                        }}
                        totalCount={userData.collections.length}
                        itemContent={index => {
                            const collection = userData.collections[index]
                            const progress = getBallProgress(collection.ownedPokemon, 'total')
                            return (
                                <SearchCollectionItem 
                                    query=''
                                    name={collection.name}
                                    type={collection.type}
                                    subType={collection.gen}
                                    owner={userData.username}
                                    progress={progress.display}
                                    percentProgress={progress.percent}
                                    collectionId={collection._id}
                                    showOwner={false}
                                />
                            )
                        }}
                    />
                </SimpleBar>
                </> : 
                <Typography sx={{fontSize: '18px', color: 'grey', mt: 10}}><i>This user has no collections</i></Typography>
                }
            </Box>
        </BodyWithBanner>
    )
}