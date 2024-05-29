import {AppBar, Box, Button, Alert} from '@mui/material'
import {useLocation, useLoaderData, Link, useNavigate, useRevalidator} from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { setCollectionInitialState } from '../app/slices/collection.jsx'
import { setOnHandInitialState } from '../app/slices/onhand.jsx'
import { setListInitialState } from '../app/slices/listdisplay.jsx'
import { setOptionsInitialState } from '../app/slices/options.jsx'
import {useSelector, useDispatch} from 'react-redux'
import {configureStore, createSlice, current} from '@reduxjs/toolkit'
import store from './../app/store'
import NothingSelected from '../components/editbar/selection/nothingselected.jsx'
import FlexAppBarContainer from '../components/editbar/selection/components/flexappbarcontainer.jsx'
import DisplaySelection from '../components/editbar/selection/displayselection.jsx'
import { changeModalState } from '../app/slices/editmode.jsx'
import CollectionOptionsModal from '../components/editbar/collectionoptions/collectionoptionsmodal.jsx'

export default function EditCollection() {
    const dispatch = useDispatch()
    const collection = useLoaderData()
    const navigate = useNavigate()
    const revalidator = useRevalidator()
    
    const linkBack = useLocation().pathname.slice(0, -5)


    const leaveEditMode = () => { 
        navigate(linkBack)
        revalidator.revalidate()
        //do not switch the order of these or it ends up revalidating the edit route before it changes which means every other unnecessary state 
        //(col onhand options) gets revalidated too. at least, i THINK thats what happens since it re-renders a LOT when leaving edit mode
    }

    return (
        <>
        <Box sx={{flexGrow: 1, width: '100%', height: '0px'}}>
            <AppBar
                position='fixed'
                className='keepZidx'
                sx={{backgroundColor: '#e3e5e6', height: '64.547px', display: 'flex', alignItems: 'center', flexDirection: 'row', zIndex: 700}}
            >
                <FlexAppBarContainer
                    widthPercent='10%'
                    additionalStyles={{paddingLeft: '8px'}}
                >   
                    <Button
                        sx={{color: '#73661e'}}
                        onClick={leaveEditMode}
                    >
                        Leave Edit Mode
                    </Button>
                </FlexAppBarContainer>
                <DisplaySelection collection={collection}/>
            </AppBar>
            <CollectionOptionsModal collectionGen={collection.gen} collectionId={collection._id}/>
        </Box>
        </>
    )
}