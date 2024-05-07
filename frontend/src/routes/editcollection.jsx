import {AppBar, Box, Button, Alert} from '@mui/material'
import {useLocation, useLoaderData, Link} from 'react-router-dom'
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
    const isEditMode = useSelector(state => state.editmode.isEditMode)
    const collection = useLoaderData()
    
    const linkBack = useLocation().pathname.slice(0, -5)
    // const collection = useSelector((state) => state.collection)
    // const onhand = useSelector((state) => state.onhand)
    // const select = useSelector((state) => state.editmode)

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
                    <Link to={linkBack}> 
                        <Button
                            sx={{color: '#73661e'}}
                        >
                            Leave Edit Mode
                        </Button>
                    </Link>
                </FlexAppBarContainer>
                <DisplaySelection collection={collection}/>
            </AppBar>
            <CollectionOptionsModal collectionGen={collection.gen} collectionId={collection._id}/>
        </Box>
        </>
    )
}