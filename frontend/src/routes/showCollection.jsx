import {useState, useRef, useEffect, useContext} from 'react';
import { AlertsContext } from '../alerts/alerts-context';
import {useLoaderData, Link, useRouteLoaderData, useLocation, useNavigate} from 'react-router-dom'
import * as React from 'react';
import Box from '@mui/material/Box'
import {Tabs, Tab, Button, useTheme, Typography} from '@mui/material'
import ShowCollectionList from '../components/collectiontable/collectionlist/showcollectionlist'
import ShowOnHandList from '../components/collectiontable/onhandlist/showonhandlist'
import ShowCollectionTitle from '../components/titlecomponents/showcollectiontitle';
import Header from '../components/titlecomponents/subcomponents/header';
import EditCollection from './editcollection'
import FilterSortArea from '../components/collectiontable/filtersortcomponents/filtersortarea';
import FilterSortButton from '../components/collectiontable/filtersortcomponents/filtersortbutton';
import BodyWrapper from '../components/partials/routepartials/bodywrapper'
import {useSelector, useDispatch} from 'react-redux'
import {setCollectionInitialState} from './../app/slices/collection'
import {setOnHandInitialState} from './../app/slices/onhand'
import {setListInitialState} from './../app/slices/listdisplay'
import { setNameState, setOptionsInitialState } from '../app/slices/options';
import store from '../app/store';
import {deselect, changeList} from './../app/slices/editmode'
import listStyles from '../../utils/styles/componentstyles/liststyles';
import ChangeOnHandView from '../components/collectiontable/changeonhandviewbutton';
import SmallWidthColList from '../components/collectiontable/collectionlist/smallwidth/smallwidthcol';
import { selectScreenBreakpoint } from '../app/selectors/windowsizeselectors';
import collectionState from '../app/slices/collectionstate';
import SmallWidthOnHand from '../components/collectiontable/onhandlist/smallwidth/smallwidthonhand';
import SWFilterSort from '../components/collectiontable/filtersortcomponents/swfiltersort';

export default function ShowCollection({collection, isCollectionOwner, colorStyles, demo=false}) {
    const theme = useTheme()
    const list = useSelector(state => state.editmode.listType)
    const pathData = useLocation()
    const navigate = useNavigate()
    const stateColData = pathData.state !== null && pathData.state.collection
    const currentLink = pathData.pathname 
    const currentlyLoggedInUser = useRouteLoaderData("root")
    const collectionLoaderData = demo ? stateColData : collection ? collection : useLoaderData()

    const screenBreakpoint = useSelector((state) => selectScreenBreakpoint(state, 'default'))
    const smallScreen = screenBreakpoint === 'sm'

    if (demo && !stateColData) {
        return (
            <BodyWrapper>
                <Box sx={{height: '750px', width: '100%', borderRadius: '10px', ...theme.components.box.fullCenterCol, justifyContent: 'start', color: 'black'}}>
                    <Typography sx={{fontSize: '32px', fontWeight: 700, my: 2}}>No data was sent to load a demo collection!</Typography>
                    <Typography sx={{fontSize: '24px', my: 1}}>If you think this is an error, contact us to resolve it!</Typography>
                </Box>
            </BodyWrapper>
        )
    }
   
    const userIsLoggedIn = currentlyLoggedInUser.loggedIn && currentlyLoggedInUser.user._id !== collectionLoaderData.owner._id
    const isOwner = demo || (currentlyLoggedInUser.loggedIn && currentlyLoggedInUser.user._id === collectionLoaderData.owner._id)
    const isEditMode = currentLink.includes('edit') && isOwner

    const collectionId = collectionLoaderData._id
    // console.log(store.getState().collectionState)

    const gen8Collection = isNaN(parseInt(collectionLoaderData.gen))
    const collectionName = collectionLoaderData.name
    const dispatch = useDispatch()
    // useEffect(() => {dispatch(setListInitialState({collection: collection.ownedPokemon, onhand: collection.onHand, updatedEggMoveInfo: collection.eggMoveInfo, resetCollectionFilters: true, resetOnHandFilters: true}))}, [currentLink])
    useEffect(() => {dispatch(deselect())})

    const changeListType = (e, newList) => {
        dispatch(deselect())
        dispatch(changeList(newList))
    } 

    const tabStyles = (isSelected) => {
        return {
            paddingBottom: 0,
            paddingTop: 0,
            backgroundColor: '#26BCC9',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            border: '1px solid #343434',
            borderBottom: 'none',
            fontWeight: 700,
            width: '50%',
            opacity: isSelected ? 1 : 0.5
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
    
    const collectionNameState = useSelector((state) => state.collectionState.options.collectionName)
    const changeOnhandViewMQuery = list === 'onHand' ? {'@media only screen and (min-width: 1101px)': {visibility: 'hidden'}} : {}

    const passDemoCollectionForward = (betweenPages) => {
        const collectionDataInState = store.getState().collectionState
        const topLevelVirtuals = betweenPages ? {
            eggMoveInfo: collectionDataInState.eggMoveInfo,
            availableGamesInfo: collectionDataInState.availableGamesInfo
        } : {}
        const collectionDatabaseFormat = {
            type: 'aprimon',
            name: collectionDataInState.options.collectionName,
            gen: collectionLoaderData.gen,
            options: {...collectionDataInState.options},
            ownedPokemon: betweenPages ? collectionDataInState.collection : collectionDataInState.collection.map(p => {return {...p, imgLink: undefined, possibleGender: undefined}}),
            onHand: betweenPages ? collectionDataInState.onhand : collectionDataInState.onhand.map(p => {return {...p, imgLink: undefined}}),
            ...topLevelVirtuals
        }
        return collectionDatabaseFormat
    }

    return (
        <>
        <Box sx={{flex: 1}}>
            <Box sx={{alignItems: 'center'}}>
                <Header additionalStyles={{backgroundColor: '#26BCC9', color: 'black', fontSize: '18px', wordBreak: 'break-all'}} noWrap={false}>{(!isEditMode) ? collectionName : collectionNameState}</Header>
            </Box>
            {demo && 
            <Box sx={{width: '100%', height: screenBreakpoint === 'sm' ? '120px' : '50px', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: screenBreakpoint === 'sm' ? 'column' : 'row', backgroundColor: theme.palette.color3.main, gap: screenBreakpoint === 'sm' ? 0 : 2}}>
                <Typography sx={{color: theme.palette.color1.main, fontWeight: 700, textAlign: 'center', fontSize: screenBreakpoint === 'sm' ? '15px' : '16px'}}>This is a demo collection. It will be lost once you leave the page. To permanently save the collection, register here:</Typography>
                <Button size='large' onClick={() => navigate('/register', {state: {collection: passDemoCollectionForward()}})} sx={{'&.MuiButtonBase-root': {color: theme.palette.color1.contrastText, backgroundColor: theme.palette.color2.main}}}>Register</Button>
            </Box>
            }
            <BodyWrapper sx={{margin: smallScreen ? 0 : 5}}>
                <ShowCollectionTitle collectionInfo={collectionLoaderData} collectionID={collectionId} options={collectionLoaderData.options} isEditMode={isEditMode} demo={demo} isOwner={isOwner} userIsLoggedIn={userIsLoggedIn} userData={currentlyLoggedInUser.user} passDemoCollectionForward={passDemoCollectionForward} smallScreen={smallScreen}/>
                {!smallScreen && <FilterSortArea collection={collectionLoaderData} isEditMode={isEditMode} demo={demo} isOwner={isOwner}/>}
                {smallScreen && <SWFilterSort collection={collectionLoaderData} isEditMode={isEditMode} demo={demo} isOwner={isOwner}/>}
                <Box sx={{flexGrow: 1, margin: 0, width: '100%', display: 'flex'}}>
                    <Tabs 
                        textcolor='inherit'
                        value={list}
                        onChange={changeListType}
                        indicatorColor='#FFDF26'
                        sx={{width: smallScreen ? '100%' : '40%', zIndex: 100}}
                    >
                        <Tab 
                            sx={list === 'collection' ? tabStyles(true) : tabStyles(false)} 
                            style={{color: '#283f57'}}
                            label='Collection List' 
                            value='collection'
                        />
                        <Tab 
                            sx={list === 'onHand' ? tabStyles(true) : tabStyles(false)} 
                            style={{color: '#283f57'}}
                            label='On-Hand List' 
                            value='onHand'
                        />
                        
                    </Tabs>
                    <Box sx={{width: '60%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {list === 'onHand' && 
                            <ChangeOnHandView isEditMode={isEditMode} demo={demo} collectionLoaderData={collectionLoaderData}/>
                        }
                        <Box sx={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                        </Box>
                    </Box>
                </Box>
                {list === 'collection' ? 
                smallScreen ? 
                <SmallWidthColList 
                    collection={collectionLoaderData}
                    demo={demo}
                    isCollectionOwner={isCollectionOwner}
                    styles={listStyles.collection}
                    isEditMode={isEditMode}
                    userData={currentlyLoggedInUser}
                    height='680px'
                /> : 
                <ShowCollectionList
                    collection={collectionLoaderData}
                    isCollectionOwner={isCollectionOwner}
                    styles={listStyles.collection}
                    isEditMode={isEditMode}
                    demo={demo}
                    userData={currentlyLoggedInUser}
                /> :
                smallScreen ? 
                <SmallWidthOnHand 
                    onhandList={collectionLoaderData.onHand}
                    collectionID={collectionLoaderData._id}
                    collectingBallsConst={collectionLoaderData.options.collectingBalls}
                    eggMoveInfo={collectionLoaderData.eggMoveInfo}
                    styles={listStyles.onhand}
                    collectionListStyles={listStyles.collection}
                    isEditMode={isEditMode}
                    demo={demo}
                    isHomeCollection={collectionLoaderData.gen === 'home'}
                    userData={currentlyLoggedInUser}
                    height='680px'
                /> : 
                <ShowOnHandList
                    onhandList={collectionLoaderData.onHand}
                    collectionID={collectionLoaderData._id}
                    collectingBallsConst={collectionLoaderData.options.collectingBalls}
                    eggMoveInfo={collectionLoaderData.eggMoveInfo}
                    styles={listStyles.onhand}
                    collectionListStyles={listStyles.collection}
                    isEditMode={isEditMode}
                    demo={demo}
                    isHomeCollection={collectionLoaderData.gen === 'home'}
                    userData={currentlyLoggedInUser}
                />
                }
            </BodyWrapper>
        </Box>
        </>
    )
}