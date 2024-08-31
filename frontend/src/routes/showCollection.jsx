import {useState, useRef, useEffect, useContext} from 'react';
import { AlertsContext } from '../alerts/alerts-context';
import {useLoaderData, Link, useRouteLoaderData, useLocation} from 'react-router-dom'
import * as React from 'react';
import Box from '@mui/material/Box'
import {Tabs, Tab, Button, useTheme} from '@mui/material'
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

export default function ShowCollection({collection, isCollectionOwner, colorStyles}) {
    const theme = useTheme()
    const list = useSelector(state => state.editmode.listType)
    const pathData = useLocation()
    const currentLink = pathData.pathname 
    const currentlyLoggedInUser = useRouteLoaderData("root")
    
    const collectionLoaderData = collection ? collection : useLoaderData()
   
    const userIsLoggedIn = currentlyLoggedInUser.loggedIn && currentlyLoggedInUser.user._id !== collectionLoaderData.owner._id
    const isOwner = (currentlyLoggedInUser.loggedIn && currentlyLoggedInUser.user._id === collectionLoaderData.owner._id)
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

    return (
        <>
        <Box sx={{flex: 1}}>
            <Box sx={{flexGrow: 1, width: '100%', alignItems: 'center'}}>
                <Header additionalStyles={{backgroundColor: '#26BCC9', color: 'black'}}>{!isEditMode ? collectionName : collectionNameState}</Header>
            </Box>
            <BodyWrapper>
                <ShowCollectionTitle collectionInfo={collectionLoaderData} collectionID={collectionId} options={collectionLoaderData.options} isEditMode={isEditMode} isOwner={isOwner} userIsLoggedIn={userIsLoggedIn} userData={currentlyLoggedInUser.user}/>
                <FilterSortArea collection={collectionLoaderData} isEditMode={isEditMode} isOwner={isOwner}/>
                <Box sx={{flexGrow: 1, margin: 0, width: '100%', display: 'flex'}}>
                    <Tabs 
                        textcolor='inherit'
                        value={list}
                        onChange={changeListType}
                        indicatorColor='#FFDF26'
                        sx={{width: '40%', zIndex: 100}}
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
                            <ChangeOnHandView isEditMode={isEditMode} collectionLoaderData={collectionLoaderData}/>
                        }
                        <Box sx={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                        </Box>
                    </Box>
                </Box>
                {list === 'collection' ? 
                <ShowCollectionList
                    collection={collectionLoaderData}
                    isCollectionOwner={isCollectionOwner}
                    styles={listStyles.collection}
                    isEditMode={isEditMode}
                    userData={currentlyLoggedInUser}
                /> :
                <ShowOnHandList
                    onhandList={collectionLoaderData.onHand}
                    collectionID={collectionLoaderData._id}
                    collectingBallsConst={collectionLoaderData.options.collectingBalls}
                    eggMoveInfo={collectionLoaderData.eggMoveInfo}
                    styles={listStyles.onhand}
                    collectionListStyles={listStyles.collection}
                    isEditMode={isEditMode}
                    isHomeCollection={collectionLoaderData.gen === 'home'}
                    userData={currentlyLoggedInUser}
                />
                }
            </BodyWrapper>
        </Box>
        </>
    )
}