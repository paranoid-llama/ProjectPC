import {Box, Button, Typography, CircularProgress} from '@mui/material'
import { useState, useTransition, useRef, useEffect, useContext } from 'react'
import { ErrorContext } from '../../../../../app/contexts/errorcontext'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import Header from '../../../../titlecomponents/subcomponents/header'
import AprimonImportForm from '../aprimon/aprimonimportform'
import AprimonImportDisplay from '../aprimon/aprimonimportdisplay'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward'
import { formatApiRequestLink } from '../../../../../../utils/functions/backendrequests/import'
import { importCollection } from '../../../../../../utils/functions/backendrequests/import'
import './importselection.css'

export default function ImportSelection({handleChange, cssClass, goBackStep, collectionType, collectionSubTypeValue}) {
    const screens = ['select', 'import', 'preview']
    const [importScreen, setImportScreen] = useState(screens[0])
    const {handleError} = useContext(ErrorContext)
    // const [isPending, startTransition] = useTransition()
    const [importedCollectionDisplay, setImportedCollectionDisplay] = useState({})
    const screensRef = useRef(importScreen)

    const slideRight1 = screensRef.current === 'select' && importScreen === 'import'
    const slideRight2 = screensRef.current === 'import' && importScreen === 'preview'
    const slideLeft1 = screensRef.current === 'import' && importScreen === 'select'
    const slideLeft2 = screensRef.current === 'preview' && importScreen === 'import' 
    const stayRight = screensRef.current === 'preview' && importScreen === 'preview'

    const slideClass = (slideRight1 || slideRight2 || slideLeft1 || slideLeft2) ? `slide-import-screen-${slideRight1 ? 'right-1' : slideRight2 ? 'right-2' : slideLeft1 ? 'left-1' : slideLeft2 && 'left-2'}` : stayRight ? 'stay-in-display' : 'none'
    const fadeClass = {
        screen1: slideRight1 ? 'screen-fade-out' : slideLeft1 ? 'screen-fade-in' : 'none',
        screen2: (slideRight1 || slideLeft2) ? 'screen-fade-in' : (slideRight2 || slideLeft1) ? 'screen-fade-out' : 'none',
        screen3: slideRight2 ? 'screen-fade-in' : slideLeft2 ? 'screen-fade-out' : stayRight ? 'screen-fade-in' : 'none'
    }

    const changeScreen = (e, idx) => {
        if (idx === 1 && importScreen === 'preview') {
            setImportedCollectionDisplay({})
        }
        setImportScreen(screens[idx])
    }
    // console.log(`screen: ${importScreen} class: ${slideClass} ref: ${screensRef.current} fadeClass3: ${fadeClass.screen3}`)
    useEffect(() => {
        screensRef.current = importScreen
    })

    // const handleImportDataChange = (e, changedField) => {
    //     const newValue = changedField === 'ballColSpan.order' ? importData[changedField].includes(e.target.value) ? importData[changedField].filter((ball) => ball !== e.target.value) : [...importData[changedField], e.target.value] : e.target.value
    //     setImporstData({...importData, [changedField]: newValue})
    // }

    const handleSubmitImportFormData = async(e, formData) => {
        const apiRequestQuery = formatApiRequestLink(formData)

        setImportScreen('preview')
        const successFunc = (importedCollection) => {
            setTimeout(() => {
                setImportedCollectionDisplay({data: importedCollection, numOfBalls: formData.ballColSpan.order.length, ballScope: formData.ballColSpan.order})
            }, 500)
        }
        const errorFunc = (errorData) => {
            setTimeout(() => {
                setImportedCollectionDisplay({data: errorData})
            }, 500)
        }
        const importCollectionFunc = async() => {return await importCollection(formData.spreadsheetId, apiRequestQuery, collectionSubTypeValue)}
        handleError(importCollectionFunc, false, successFunc, errorFunc)
    }

    const bottomBar = importScreen === 'import' ? {right: '45%'} : {}
    // console.log(`screen: ${importScreen} class: ${slideClass} ref: ${screensRef.current}`)

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
                        <Box sx={{height: '20%'}}><Button size='large' sx={{fontSize: '20px'}} onClick={(e) => handleChange(e, {})}>Start from Scratch</Button></Box> 
                    </Box>
            
                    <Box sx={{width: '100%', height: '90%', mt: 1, position: 'absolute', visibility: 'hidden'}} className={fadeClass.screen2}>
                        {/* change this to show different import forms depending on type (once more collection types are added)*/}
                        <AprimonImportForm handleSubmit={handleSubmitImportFormData} isHomeCollection={collectionSubTypeValue === 'home'}/>
                    </Box>
                    <Box sx={{width: '100%', height: '100%', position: 'absolute', right: '-100%', visibility: 'hidden', display: 'flex', alignItems: 'center', flexDirection: 'column'}} className={fadeClass.screen3}>
                        {/* change this to show different display screens depending on type (once more collection types are added)*/}
                        <AprimonImportDisplay data={importedCollectionDisplay.data === undefined ? {} : importedCollectionDisplay.data} numOfBalls={importedCollectionDisplay.numOfBalls}/>
                    </Box>
                </Box>
            </Box>
            
            <Box sx={{width: importScreen === 'import' ? '50%' : '100%', display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: importScreen === 'import' ? 'start' : 'center', position: 'absolute', top: '95%', zIndex: 1, ...bottomBar}}>
                <Box sx={{display: 'flex', width: '90%'}}>
                    <Box sx={{width: importScreen === 'import' ? '100%' : '50%', display: 'flex', justifyContent: 'start'}}>
                        <Button onClick={importScreen === 'select' ? goBackStep.func : importScreen === 'import' ? ((e) => changeScreen(e, 0)) : importScreen === 'preview' && ((e) => changeScreen(e, 1))}>
                            <ArrowBackIcon/>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{importScreen === 'select' ? goBackStep.stepName : importScreen === 'import' ? 'Import Select' : importScreen === 'preview' && 'Import Form'}</Typography>
                        </Button>
                    </Box>
                    {(importScreen === 'preview' && importedCollectionDisplay.data !== undefined) &&
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'end'}}>
                        <Button onClick={(e) => handleChange(e, importedCollectionDisplay.data.collection, importedCollectionDisplay.ballScope)}>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>Scope</Typography>
                            <ArrowForward/>
                        </Button>
                    </Box>}
                    
                </Box>
            </Box>
        </Box>
    )
}