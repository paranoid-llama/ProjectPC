import {Box, Button, Typography} from '@mui/material'
import { useState, useTransition, useRef, useEffect } from 'react'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import Header from '../../../../titlecomponents/subcomponents/header'
import AprimonImportForm from '../aprimon/aprimonimportform'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatApiRequestLink } from '../../../../../../utils/functions/backendrequests/import'
import { importCollection } from '../../../../../../utils/functions/backendrequests/import'
import './importselection.css'

export default function ImportSelection({handleChange, cssClass, goBackStep, collectionType}) {
    const screens = ['select', 'import', 'preview']
    const [importScreen, setImportScreen] = useState(screens[0])
    const [importedCollectionDisplay, setImportedCollectionDisplay] = useState([])
    const screensRef = useRef(importScreen)

    const slideRight1 = screensRef.current === 'select' && importScreen === 'import'
    const slideRight2 = screensRef.current === 'import' && importScreen === 'preview'
    const slideLeft1 = screensRef.current === 'import' && importScreen === 'select'
    const slideLeft2 = screensRef.current === 'preview' && importScreen === 'import' 
    //purposefully cannot slide from import to select screen as button to start from scratch appears

    const slideClass = (slideRight1 || slideRight2 || slideLeft1 || slideLeft2) ? `slide-import-screen-${slideRight1 ? 'right-1' : slideRight2 ? 'right-2' : slideLeft1 ? 'left-1' : slideLeft2 && 'left-2'}` : 'none'
    const fadeClass = {
        screen1: slideRight1 ? 'screen-fade-out' : slideLeft1 ? 'screen-fade-in' : 'none',
        screen2: (slideRight1 || slideLeft2) ? 'screen-fade-in' : (slideRight2 || slideLeft1) ? 'screen-fade-out' : 'none',
        screen3: slideRight2 ? 'screen-fade-in' : slideLeft2 ? 'screen-fade-out' : 'none'
    }

    const changeScreen = (e, idx) => {
        setImportScreen(screens[idx])
    }

    useEffect(() => {
        screensRef.current = importScreen
    })

    // const handleImportDataChange = (e, changedField) => {
    //     const newValue = changedField === 'ballColSpan.order' ? importData[changedField].includes(e.target.value) ? importData[changedField].filter((ball) => ball !== e.target.value) : [...importData[changedField], e.target.value] : e.target.value
    //     setImportData({...importData, [changedField]: newValue})
    // }

    const handleSubmit = (e, formData) => {
        const apiRequestQuery = formatApiRequestLink(formData)
        console.log(apiRequestQuery)
        const importedCollection = importCollection(formData.spreadsheetId, apiRequestQuery)
    }

    const bottomBar = importScreen === 'import' ? {right: '45%'} : {}

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, height: '581px', position: 'relative'}} className={cssClass}>
            <Header additionalStyles={{color: 'black', paddingBottom: '2px', height: '32px'}}>Import Collection</Header>
            <Typography sx={{fontSize: '12px'}}>{collectionType}</Typography>
            <Box sx={{width: '100%', height: '100%', position: 'relative'}}>
                <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row', position: 'absolute', transform: 'translateX(100%)'}} className={slideClass}>
                    <Box sx={{width: '100%', height: '100%', position: 'absolute', right: '100%'}} className={fadeClass.screen1}> 
                        <Box sx={{height: '20%', mt: 5}}>
                            <Button size='large' sx={{fontSize: '20px'}} onClick={(e) => changeScreen(e, 1)}>Import Collection from Google Sheets</Button>
                        </Box>
                        <Box sx={{margin: 5, height: '10%'}}><Typography sx={{fontSize: '16px'}}>or</Typography></Box>
                        <Box sx={{height: '20%'}}><Button size='large' sx={{fontSize: '20px'}}>Start from Scratch</Button></Box> 
                    </Box>
            
                    <Box sx={{width: '100%', height: '90%', mt: 1, position: 'absolute', visibility: 'hidden'}} className={fadeClass.screen2}>
                        {/* change this to show different import forms depending on type (once more collection types are added)*/}
                        <AprimonImportForm handleSubmit={handleSubmit}/>
                    </Box>
                    <Box sx={{width: '100%', height: '100%', position: 'absolute', right: '-100%', visibility: 'hidden'}} className={fadeClass.screen3}>
                        <Typography>DISPLAY SCREEN</Typography>
                    </Box>
                </Box>
            </Box>
            
            <Box sx={{width: importScreen === 'import' ? '50%' : '100%', display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: importScreen === 'import' ? 'start' : 'center', position: 'absolute', top: '95%', zIndex: 1, ...bottomBar}}>
                <Box sx={{display: 'flex', width: '90%'}}>
                    <Box sx={{width: importScreen === 'import' ? '100%' : '50%', display: 'flex', justifyContent: 'start'}}>
                        <Button onClick={importScreen === 'select' ? goBackStep.func : importScreen === 'import' && ((e) => changeScreen(e, 0))}>
                            <ArrowBackIcon/>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{importScreen === 'select' ? goBackStep.stepName : importScreen === 'import' && 'Import Select'}</Typography>
                        </Button>
                    </Box>
                    {/* {(importScreen === 'import') &&
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'end'}}>
                        <Button>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{importScreen === 'import' ? 'Submit and Import' : 'Start from Scratch Instead'}</Typography>
                            <ImgData type='gender' linkKey='arrowright' size='8px'/>
                        </Button>
                    </Box>} */}
                    
                </Box>
            </Box>
        </Box>
    )
}