import {Box, AppBar, Button} from '@mui/material'
import { useLoaderData } from 'react-router'
import { Link } from 'react-router-dom'
import Header from './subcomponents/header'
import TextSpaceDouble from './subcomponents/textspacedouble'
import TextSpaceSingle from './subcomponents/textspacesingle'
import CollectionProgress from './collectionprogress'
import { tradePreferenceDisplay } from '../../infoconstants'

export default function ShowCollectionTitle({collectionID, options}) {
    const collectionInfo = useLoaderData()
    console.log(options)
    const gen8Collection = isNaN(parseInt(collectionInfo.gen))
    const collectionType = gen8Collection ? `${collectionInfo.gen.toUpperCase()} Aprimon Collection` : `Gen ${collectionInfo.gen} Aprimon Collection`
    const formattedTradePreferences = [tradePreferenceDisplay.onhandOnly[options.tradePreferences.onhandOnly], tradePreferenceDisplay.size[options.tradePreferences.size], tradePreferenceDisplay.items[options.tradePreferences.items]].filter(display => display !== undefined)
    const colorStyles1 = {
        bgColor: 'linear-gradient(90deg, rgba(40,63,87,1) 90%, rgba(60,165,186,0) 100%)',
        isGradient: true,
        textColor: 'white', 
        labelBgColor: '#1e2f41'
    }
    const colorStyles2 = {
        bgColor: 'linear-gradient(90deg, rgba(181,157,14,1) 90%, rgba(60,165,186,0) 100%)',
        isGradient: true,
        textColor: 'black',
        labelBgColor: '#98830b'
    }
   
    //breakpoints when the label wraps
    const tradeStatusLabelStyles = {
        '@media only screen and (min-width: 1051px)': {
            fontSize: '16px'
        },
        '@media only screen and (min-width: 929px) and (max-width: 1050px)': {
            fontSize: '14px'
        },
        '@media only screen and (min-width: 821px) and (max-width: 928px)': {
            fontSize: '12px'
        },
        '@media only screen and (min-width: 768px) and (max-width: 820px)': {
            fontSize: '11px'
        }
    }
    const tradeTagTextStyles = {
        '@media only screen and (min-width: 908px) and (max-width: 1043px)': {
            marginRight: '20px'
        },
        '@media only screen and (min-width: 1044px) and (max-width: 1150px)': {
            marginRight: '40px'
        },
        fontSize: formattedTradePreferences.length === 3 ? '10.5px' : '12px'
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
        gap: formattedTradePreferences.length === 3 ? 0.5 : 2
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', width: '100%', marginBottom: '1rem'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', width: '45%'}}>
                {/* <TextSpaceDouble label1={'Type'} text1={collectionType} label2={'Owner'} text2={collectionInfo.owner.username} colorStyles={colorStyles} width='100%'/>
                <TextSpaceDouble label1='Trade Status' text1={tradeStatus} text2={formattedTradePreferences} colorStyles={colorStyles} width='100%' isLast={true} otherTextStyles={tradeStatusStyles}/> */}
                <TextSpaceSingle 
                    colorStyles={colorStyles1}
                    otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
                    text={collectionType}
                    label={'Type'}
                    width='100%'
                />
                <TextSpaceSingle 
                    colorStyles={colorStyles2}
                    otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
                    text={collectionInfo.owner.username}
                    label={'Owner'}
                    width='100%'
                />
                <TextSpaceSingle 
                    colorStyles={colorStyles1}
                    otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
                    otherLabelStyles={tradeStatusLabelStyles}
                    text={tradePreferenceDisplay.status[options.tradePreferences.status]}
                    label={'Trade Status'}
                    width='100%'
                />
                <TextSpaceSingle 
                    colorStyles={colorStyles2}
                    otherTextStyles={tradeTagTextStyles}
                    tagAreaStyles={tagAreaStyles}
                    multipleTexts={formattedTradePreferences}
                    displayingTags={true}
                    width='100%'
                />
                <Button sx={{width: '30%', fontSize: '12px'}}><Link to={`${collectionID}/edit`}>Edit Mode</Link></Button>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', width: '55%'}}>
                <CollectionProgress />
            </Box>
        </Box>
    )
}