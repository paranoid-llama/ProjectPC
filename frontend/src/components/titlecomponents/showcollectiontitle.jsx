import {Box, AppBar, Button, ToggleButton, ToggleButtonGroup} from '@mui/material'
import { useState, useEffect } from 'react'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Header from './subcomponents/header'
import TextSpaceDouble from './subcomponents/textspacedouble'
import TextSpaceSingle from './subcomponents/textspacesingle'
import CollectionProgress from './collectionprogress'
import RateDisplay from './ratedisplay'
import ItemDisplay from './itemdisplay'
import ComparisonMain from '../functionalcomponents/comparecollections/comparisonmain'
import { tradePreferenceDisplay } from '../../../../common/infoconstants/miscconstants'
import { useDispatch, useSelector } from 'react-redux'
import { changeModalState } from '../../app/slices/editmode'
import { homeCompatibleGames } from '../../../../common/infoconstants/miscconstants.mjs'
import { checkIfCanTrade } from '../../../utils/functions/comparecollections/checkifcantrade'
import { setCollectionInitialState } from '../../app/slices/collection'
import { setOnHandInitialState } from '../../app/slices/onhand'
import { setOptionsInitialState } from '../../app/slices/options'

export default function ShowCollectionTitle({collectionID, options, isEditMode, isOwner, userIsLoggedIn, userData}) {
    const collectionInfo = useLoaderData()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const link = useLocation().pathname
    const [displayScreen, setDisplayScreen] = useState('ballProgress')
    const [comparisonModal, setComparisonModal] = useState(false)
    const gen8Collection = isNaN(parseInt(collectionInfo.gen))
    const tradePreferencesState = useSelector((state) => state.options.tradePreferences)
    const tradePreferences = isEditMode ? tradePreferencesState : options.tradePreferences
    const itemsState = tradePreferences.items
    const collectionType = gen8Collection ? `${collectionInfo.gen.toUpperCase()} Aprimon Collection` : `Gen ${collectionInfo.gen} Aprimon Collection`
    const formattedTradePreferences = [tradePreferenceDisplay.onhandOnly[tradePreferences.onhandOnly], tradePreferenceDisplay.size[tradePreferences.size], tradePreferenceDisplay.items[tradePreferences.items]].filter(display => display !== undefined)
    
    const tradeableCollections = (userData !== undefined && collectionInfo.owner._id !== userData._id) && userData.collections.filter(col => checkIfCanTrade(collectionInfo, col))
    const canInitiateTrade = (userData !== undefined && collectionInfo.owner._id !== userData._id) && tradeableCollections.length !== 0

    useEffect(() => {
        if (itemsState === 'none' && displayScreen === 'items') {
            setDisplayScreen('rates')
        }
    }, [itemsState, link])

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

    const changeDisplayScreen = (newVal) => {setDisplayScreen(newVal)}
    const toggleComparisonModal = () => {setComparisonModal(!comparisonModal)}
   
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

    const toggleButtonSelectedStyles = {
        '&.Mui-selected': {backgroundColor: 'rgba(40,63,87,1)', color: 'white'},
        '&.Mui-selected:hover': {backgroundColor: 'rgba(40,63,87,0.9)'},
        ':hover': {backgroundColor: 'rgba(39, 38, 37, 0.9)'}
    }

    const initializeEditMode = () => {
        navigate(`/collections/${collectionID}/edit`)
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', width: '100%', marginBottom: '1rem', height: '200px'}}>
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
                    text={tradePreferenceDisplay.status[tradePreferences.status]}
                    label={'Trade Status'}
                    width='100%'
                />
                <TextSpaceSingle 
                    colorStyles={colorStyles2}
                    otherTextStyles={tradeTagTextStyles}
                    tagAreaStyles={tradePreferences.status === 'closed' ? {...tagAreaStyles, opacity: 0.5} : tagAreaStyles}
                    multipleTexts={formattedTradePreferences}
                    displayingTags={true}
                    width='100%'
                />
                <Box sx={{width: '100%', height: '20%', display: 'flex', justifyContent: 'center'}}>
                    <ToggleButtonGroup exclusive sx={{mt: 0.5, mb: 0.5, width: '95%', '& .MuiToggleButton-root': {border: '1px solid rgba(40,63,87,1)', color: 'white', backgroundColor: '#272625'}}} size='small' value={displayScreen} onChange={(e, newVal) => changeDisplayScreen(newVal)}>
                        <ToggleButton value='ballProgress' sx={{width: '40%', fontSize: '12px', padding: 0, ...toggleButtonSelectedStyles}}>Progress</ToggleButton>
                        <ToggleButton value='rates' sx={{width: '30%', fontSize: '12px', ...toggleButtonSelectedStyles}}>Rates</ToggleButton>
                        <ToggleButton value='items' sx={{width: '30%', fontSize: '12px', ...toggleButtonSelectedStyles, '&.Mui-disabled': {color: 'white', opacity: 0.7}}} disabled={tradePreferences.items === 'none'}>Items</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{width: '100%', height: '15%', display: 'flex', justifyContent: 'center'}}>
                    {canInitiateTrade && <Button sx={{width: '60%', fontSize: '11px'}} onClick={toggleComparisonModal}>Compare Collections</Button>}
                    {canInitiateTrade && <Button sx={{width: '40%', fontSize: '11px'}} onClick={() => navigate(`/collections/${collectionID}/trade`)}>Offer Trade</Button>}
                    {isOwner && <Button sx={{width: '40%', fontSize: '12px'}} onClick={initializeEditMode}>Edit Mode</Button>}
                    {isEditMode && <Button sx={{fontSize: '12px'}} onClick={() => dispatch(changeModalState({open: true, screen: 'main'}))}>Collection Options</Button>}
                </Box>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '55%'}}>
                {displayScreen === 'ballProgress' && <CollectionProgress ballScopeInit={options.collectingBalls} isEditMode={isEditMode} collectionList={collectionInfo.ownedPokemon}/>}
                {displayScreen === 'rates' && <RateDisplay rates={tradePreferences.rates} owner={collectionInfo.owner.username} collectionGen={collectionInfo.gen}/>}
                {displayScreen === 'items' && <ItemDisplay collectionGen={collectionInfo.gen} itemTradeStatus={tradePreferences.items} lfItems={tradePreferences.lfItems} ftItems={tradePreferences.ftItems}/>}
            </Box>
            {canInitiateTrade && <ComparisonMain open={comparisonModal} toggleModal={toggleComparisonModal} tradeableCollections={tradeableCollections} collectionData={collectionInfo}/>}
        </Box>
    )
}