import {useState, useEffect, useRef} from 'react';
import {useLocation, useLoaderData, Link} from 'react-router-dom'
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
import {deselect, changeList, enterEditMode, leaveEditMode} from './../app/slices/editmode'

export default function ShowCollection({colorStyles, listStyles}) {
    const list = useSelector(state => state.editmode.listType)
    // const isEditMode = useSelector(state => state.editmode.isEditMode)
    const collectionId = useLocation().pathname.replace('/edit' && '/edit', '')
    const collection = useLoaderData()
    // const collectionState = {...collection, ownedPokemon: 
    //     collection.ownedPokemon.map(p => {
    //         return {...p, selected: false}
    //     })
    // , onHand: 
    //     collection.onHand.map(p => {
    //         return {...p, selected: false}
    //     })
    // }
    const gen8Collection = isNaN(parseInt(collection.gen))
    const collectionName = collection.name !== undefined ? collection.name : 
        gen8Collection ? 
        // `${collectionInfo.owner.username}'s ${collectionInfo.gen.toUpperCase()} Aprimon Collection` 
        `SixteenCharacter's ${collection.gen.toUpperCase()} Aprimon Collection`    : 
        // `${collectionInfo.owner.username}'s Gen ${collectionInfo.gen} Aprimon Collection`
        `SixteenCharacter's Gen ${collection.gen} Aprimon Collection`
    const dispatch = useDispatch()
    useEffect(() => {dispatch(setCollectionInitialState(collection.ownedPokemon))}, [])
    useEffect(() => {dispatch(setOnHandInitialState(collection.onHand))}, [])
    useEffect(() => {dispatch(setListInitialState({collection: collection.ownedPokemon, onhand: collection.onHand}))}, [])

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

    // const toggleEditMode = () => {
    //     if (isEditMode === true) {
    //         dispatch(leaveEditMode())
    //     } else if (isEditMode === false) {
    //         dispatch(enterEditMode())
    //     }
    // }

    return (
        <>
        {/* <EditCollection /> */}
        <Box sx={{flex: 1}}>
            <Box sx={{flexGrow: 1, width: '100%', alignItems: 'center'}}>
                <Header additionalStyles={{backgroundColor: '#26BCC9', color: 'black'}}>{collectionName}</Header>
            </Box>
            <BodyWrapper>
                {/* <h1>Collection info</h1>
                <h2>Owner: {collection.owner && collection.owner.username}</h2> */}
                <ShowCollectionTitle collectionID={collectionId} options={collection.options}/>
                <FilterSortArea/>
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
                /> :
                <ShowOnHandList
                    collectionID={collection._id}
                    eggMoveInfo={collection.eggMoveInfo}
                    styles={listStyles.onhand}
                />
                }
            </BodyWrapper>
        </Box>
        </>
    )
}