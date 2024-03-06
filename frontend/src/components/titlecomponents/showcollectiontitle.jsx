import {Box, AppBar, Button} from '@mui/material'
import { useLoaderData } from 'react-router'
import { Link } from 'react-router-dom'
import Header from './subcomponents/header'
import TextSpaceDouble from './subcomponents/textspacedouble'
import CollectionProgress from './collectionprogress'
import { importCollection } from '../../../utils/functions/backendrequests/import'

export default function ShowCollectionTitle({collectionID}) {
    const collectionInfo = useLoaderData()
    console.log(collectionInfo)
    const gen8Collection = isNaN(parseInt(collectionInfo.gen))
    const collectionType = gen8Collection ? `${collectionInfo.gen.toUpperCase()} Aprimon Collection` : `Gen ${collectionInfo.gen} Aprimon Collection`
    const tradeStatus = 'Accepting trade offers!'
    const tradePreferences = {tradeFrom: 'On-Hand Preferred', tradeSize: 'Large Trades Preferred'}
    const formattedTradePreferences = [tradePreferences.tradeFrom, tradePreferences.tradeSize]
    const colorStyles = {
        bgColor1: 'linear-gradient(90deg, rgba(40,63,87,1) 90%, rgba(60,165,186,0) 100%)',
        isGradient1: true,
        textColor1: 'white', 
        labelBgColor1: '#1e2f41',
        bgColor2: 'linear-gradient(90deg, rgba(181,157,14,1) 90%, rgba(60,165,186,0) 100%)',
        isGradient2: true,
        textColor2: 'black',
        labelBgColor2: '#98830b'
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
    const tradeStatusStyles = {additionalLabel1Styles: tradeStatusLabelStyles, additionalText2Styles: {
        '@media only screen and (min-width: 768px) and (max-width: 930px)': {
            marginRight: '10px'
        },
        '@media only screen and (min-width: 931px)': {
            marginRight: '40px'
        },
        fontSize: '12px'
    }}

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', width: '100%', marginBottom: '1rem'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', width: '45%'}}>
                <TextSpaceDouble label1={'Type'} text1={collectionType} label2={'Owner'} text2={collectionInfo.owner.username} colorStyles={colorStyles} width='100%'/>
                <TextSpaceDouble label1='Trade Status' text1={tradeStatus} text2={formattedTradePreferences} colorStyles={colorStyles} width='100%' isLast={true} otherTextStyles={tradeStatusStyles}/>
                <Button sx={{width: '30%', fontSize: '12px'}}><Link to={`${collectionID}/edit`}>Edit Mode</Link></Button>
                <Button sx={{width: '30%', fontSize: '12px'}} onClick={importCollection}>Import</Button>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', width: '55%'}}>
                <CollectionProgress />
            </Box>
        </Box>
    )
}