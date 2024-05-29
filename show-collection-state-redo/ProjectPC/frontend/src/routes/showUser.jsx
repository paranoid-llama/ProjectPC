import {Box, useTheme, Typography, Grid, styled} from '@mui/material'
import { useRef, forwardRef } from 'react'
import BodyWithBanner from '../components/partials/routepartials/bodywithbanner'
import { useLoaderData } from 'react-router-dom'
import ImgData from '../components/collectiontable/tabledata/imgdata'
import TextSpaceSingle from '../components/titlecomponents/subcomponents/textspacesingle'
import hexToRgba from 'hex-to-rgba'
import { gamesOrder } from '../infoconstants'
import { Virtuoso } from 'react-virtuoso'
import { getBallProgress } from '../../utils/functions/ballprogresscircle/ballprogressstate'
import SearchCollectionItem from '../components/functionalcomponents/search/searchcollectionitem'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import "./showUser.css"

//user profile page
export default function ShowUser({}) {
    const userData = useLoaderData()
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
    const userTags = ['Aprimon Master', 'Multi-Generational Aprimon Master']
    const userGamesInit = ['sword', 'shield', 'shiningpearl', 'home', 'legendsarceus', 'scarlet', 'violet', 'letsgopikachu', 'letsgoeevee', 'brilliantdiamond']
    // const userGamesInit = ['sword', 'shield', 'shiningpearl']

    const userGames = gamesOrder.filter(game => userGamesInit.includes(game))

    const tagTextStyles = {
        '@media only screen and (min-width: 908px) and (max-width: 1043px)': {
            marginRight: '20px'
        },
        '@media only screen and (min-width: 1044px) and (max-width: 1150px)': {
            marginRight: '40px'
        },
        fontSize: userTags.length >= 3 ? '10.5px' : '12px'
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
        gap: userTags.length >= 3 ? 0.5 : 2
    }

    const horizontalScroll = (e) => {
        if (e.deltaY > 0) {
            gameScrollRef.current.scrollLeft += 50;
        } else {
            gameScrollRef.current.scrollLeft -= 50;
        }
    }

    const bio = 'Small-time aprimon collector in a big pokemon world. reddit /u/paranoid-llama. Looking to trade pokemon of any gen!'

    return (
        <BodyWithBanner bannerSx={{backgroundColor: theme.palette.color1.light, color: theme.palette.color1.contrastTextLight}} bodySx={{mb: 0, mt: 2}} text={`${userData.username}'s profile`}>
            <Box sx={{minHeight: '250px', ...theme.components.box.fullCenterRow}}>
                <Box sx={{opacity: 0.5}}><ImgData type='icons' linkKey='user' size='200px'/></Box>
                <Box sx={{width: '70%', ml: 3, ...theme.components.box.fullCenterCol}}>
                    <TextSpaceSingle 
                        colorStyles={textColor1}
                        otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
                        text={userData.username}
                        label={'Username'}
                        width='100%'
                    />
                    <TextSpaceSingle 
                        colorStyles={textColor2}
                        otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
                        otherTextStyles={tagTextStyles}
                        tagAreaStyles={tagAreaStyles}
                        multipleTexts={userTags}
                        displayingTags={true}
                        width='100%'
                    />
                    <TextSpaceSingle 
                        colorStyles={textColor1}
                        otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
                        largeTextArea={true}
                        largeTextAreaStyles={{height: '50%', minHeight: '80px', display: 'flex', alignItems: 'center'}}
                        largeTextStyles={{textAlign: 'start', color: textColor1.textColor, mx: 2, mr: '10%', fontSize: '12px'}}
                        text={bio}
                        width='100%'
                    />
                </Box>
            </Box>
            <Box sx={{minHeight: '80px', ...theme.components.box.fullCenterCol, mt: -3}}>
                <Box sx={{width: '100%', position: 'relative', display: 'flex', justifyContent: 'center'}}>
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
                    </Box>
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