import {useState, useEffect, useContext} from 'react';
import { AlertsContext } from '../alerts/alerts-context';
import {useLoaderData, Link, useRouteLoaderData, useLocation} from 'react-router-dom'
import * as React from 'react';
import Box from '@mui/material/Box'
import {Tabs, Tab, Button} from '@mui/material'
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
import {deselect, changeList} from './../app/slices/editmode'
import listStyles from '../../utils/styles/componentstyles/liststyles';

export default function ShowCollection({colorStyles}) {
    const list = useSelector(state => state.editmode.listType)
    const pathData = useLocation()
    const currentLink = pathData.pathname
    const collection = useLoaderData()
    const currentlyLoggedInUser = useRouteLoaderData("root")
    const userIsLoggedIn = currentlyLoggedInUser.loggedIn && currentlyLoggedInUser.user._id !== collection.owner._id
    const isOwner = (currentlyLoggedInUser.loggedIn && currentlyLoggedInUser.user._id === collection.owner._id)
    const isEditMode = currentLink.includes('edit') && isOwner

    const collectionId = collection._id

    const gen8Collection = isNaN(parseInt(collection.gen))
    const collectionName = collection.name
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
    
    const collectionNameState = useSelector((state) => state.options.collectionName)

    return (
        <>
        <Box sx={{flex: 1}}>
            <Box sx={{flexGrow: 1, width: '100%', alignItems: 'center'}}>
                <Header additionalStyles={{backgroundColor: '#26BCC9', color: 'black'}}>{!isEditMode ? collectionName : collectionNameState}</Header>
            </Box>
            <BodyWrapper>
                <ShowCollectionTitle collectionID={collectionId} options={collection.options} isEditMode={isEditMode} isOwner={isOwner} userIsLoggedIn={userIsLoggedIn} userData={currentlyLoggedInUser.user}/>
                <FilterSortArea collection={collection} isEditMode={isEditMode}/>
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
                    <Box sx={{width: '60%', display: 'flex', flexDirection: 'row-reverse', alignItems: 'center'}}>
                        <Box sx={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                        </Box>
                    </Box>
                </Box>
                {list === 'collection' ? 
                <ShowCollectionList
                    collection={collection}
                    styles={listStyles.collection}
                    isEditMode={isEditMode}
                    userData={currentlyLoggedInUser}
                /> :
                <ShowOnHandList
                    onhandList={collection.onHand}
                    collectionID={collection._id}
                    eggMoveInfo={collection.eggMoveInfo}
                    styles={listStyles.onhand}
                    isEditMode={isEditMode}
                    isHomeCollection={collection.gen === 'home'}
                    userData={currentlyLoggedInUser}
                />
                }
            </BodyWrapper>
        </Box>
        </>
    )
}