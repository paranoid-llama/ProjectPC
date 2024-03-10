import {Box, Button, Typography} from '@mui/material'
import { useState, useTransition, useRef, useEffect } from 'react'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import Header from '../../../titlecomponents/subcomponents/header'
import ImportForm from './importform'
import './importselection.css'

export default function ImportSelection({handleChange, cssClass, goBackStep, collectionType}) {
    const screens = ['select', 'import', 'preview']
    const [importScreen, setImportScreen] = useState(screens[0])
    const screensRef = useRef(importScreen)

    const slideRight1 = screensRef.current === 'select' && importScreen === 'import'
    const slideRight2 = screensRef.current === 'import' && importScreen === 'preview'
    const slideLeft = screensRef.current === 'preview' && importScreen === 'import' 
    //purposefully cannot slide from import to select screen as button to start from scratch appears

    const slideClass = (slideRight1 || slideRight2 || slideLeft) ? `slide-import-screen-${slideRight1 ? 'right-1' : slideRight2 ? 'right-2' : slideLeft && 'left'}` : 'none'
    const fadeClass = {
        screen1: slideRight1 ? 'screen-fade-out' : 'none',
        screen2: (slideRight1 || slideLeft) ? 'screen-fade-in' : slideRight2 ? 'screen-fade-out' : 'none',
        screen3: slideRight2 ? 'screen-fade-in' : slideLeft ? 'screen-fade-out' : 'none'
    }

    const changeScreen = (e, idx) => {
        setImportScreen(screens[idx])
    }

    useEffect(() => {
        screensRef.current = importScreen
    })

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2, height: '550px'}} className={cssClass}>
            <Header additionalStyles={{color: 'black', height: '10%', paddingBottom: '2px', height: '32px'}}>Import Collection</Header>
            <Typography sx={{fontSize: '12px'}}>{collectionType}</Typography>
            <Box sx={{width: '100%', height: '100%', position: 'relative'}}>
                <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row', position: 'absolute', transform: 'translateX(100%)'}} className={slideClass}>
                    <Box sx={{mt: 5, width: '100%', height: '100%', position: 'absolute', right: '100%'}} className={fadeClass.screen1}> 
                        <Box sx={{height: '20%'}}>
                            <Button size='large' sx={{fontSize: '20px'}} onClick={(e) => changeScreen(e, 1)}>Import Collection from Google Sheets</Button>
                        </Box>
                        <Box sx={{margin: 5, height: '10%'}}><Typography sx={{fontSize: '16px'}}>or</Typography></Box>
                        <Box sx={{height: '20%'}}><Button size='large' sx={{fontSize: '20px'}}>Start from Scratch</Button></Box> 
                    </Box>
            
                    <Box sx={{width: '100%', height: '100%', mt: 5, position: 'absolute', visibility: 'hidden'}} className={fadeClass.screen2}>
                        <Typography>NEXT SCREEN</Typography>
                    </Box>
                    <Box sx={{width: '100%', height: '100%', mt: 5, position: 'absolute', right: '-100%', visibility: 'hidden'}} className={fadeClass.screen3}>
                        <Typography>DISPLAY SCREEN</Typography>
                    </Box>
                </Box>
            </Box>
            
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'end', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{display: 'flex', width: '90%'}}>
                    <Box sx={{width: '50%'}}>
                        <Button onClick={goBackStep.func}>
                            <ImgData type='gender' linkKey='arrowleft' size='8px'/>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{goBackStep.stepName}</Typography>
                        </Button>
                    </Box>
                    
                </Box>
            </Box>
        </Box>
    )
}