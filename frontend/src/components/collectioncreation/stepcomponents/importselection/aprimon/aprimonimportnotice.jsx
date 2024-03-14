import {Box, Typography, Tooltip, Button} from '@mui/material'
import {useState} from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ImgData from '../../../../collectiontable/tabledata/imgdata'

export default function AprimonImportNotice({removeNotice, transitionClass}) {
    const exampleTypes = ['checkbox_import', 'picture_function_import', 'inserted_picture_import']
    const [exampleScreen, setExampleScreen] = useState(0)

    const textHeightBreakpoints = {
        '@media only screen and (max-width: 1546px)': {
            height: '20%'
        },
        '@media only screen and (min-width: 1547px)': {
            height: '15%'
        }
    }

    const textFontSizeBreakpoints = {
        '@media only screen and (max-width: 848px)': {
            fontSize: '14px'
        },
        '@media only screen and (min-width: 849px)': {
            fontSize: '16px'
        }
    }

    const moveRight = () => {
        setExampleScreen(exampleScreen + 1)
    }

    const moveLeft = () => {
        setExampleScreen(exampleScreen - 1)
    }

    const explanationText = "Google's API doesn't send data of images put over cells. The values sent back are functions operated in the cell (such as checkboxes or images grabbed by links)"

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}} className={transitionClass}>
            <Box sx={{width: '100%', height: '5%'}}>
                <Typography sx={{fontSize: '20px', fontWeight: 700}}>
                    Before you import..
                </Typography>
            </Box>  
            <Box sx={{width: '90%', mt: 1, ...textHeightBreakpoints}}>
                <Typography sx={{...textFontSizeBreakpoints, position: 'relative', display: 'inline'}}>
                    If you track owned pokemon/ball combinations by inserting images in cell (via Insert &rarr; Images &rarr; Insert image in cell),
                    unfortunately <b>there is no way to retrieve your data.</b>
                    
                </Typography>
                <Tooltip
                        title={explanationText}
                        sx={{display: 'inline'}}
                    >
                    <Typography sx={{color: 'blue', display: 'inline', paddingLeft: 1, fontSize: '10px', ':hover': {cursor: 'pointer'}}}>Why?</Typography>
                </Tooltip>
                <Typography sx={{...textFontSizeBreakpoints, mt: 1}}>
                    A simple way of checking this is to click over an owned cell and see if there is function data.
                </Typography>
                
            </Box> 
            <Box sx={{display: 'flex', height: '65%', width: '100%', justifyContent: 'center'}}>
                
                <Box sx={{width: '10%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center'}}>
                    {exampleScreen !== 0 &&
                    <Button onClick={moveLeft}>
                        <ArrowBackIcon/>
                    </Button> 
                    }
                </Box>
               
                <Box sx={{display: 'flex', height: '100%', width: '528.578px', justifyContent: 'center', gap: 1, position: 'relative', overflowX: 'hidden', overflowY: 'hidden'}}>
                    <Box sx={{width: '100%', height: '100%', position: 'absolute', transform: `translateX(${exampleScreen === 0 ? '-100%' : exampleScreen === 1 ? '0%' : exampleScreen === 2 && '100%'})`}}>
                        {exampleTypes.map((example, idx) => {
                            const right = idx === 0 ? '-100%' : idx === 1 ? '0%' : idx === 2 && '100%'
                            return (
                                <Box sx={{position: 'absolute', right, height: '100%', width: '100%'}} key={`import-notice-example-${idx + 1}`}>
                                    <ImgData linkKey={example} size='100%' imgFolder='misc'/>
                                </Box>
                            )
                        })}
                    </Box>
                </Box> 
                
                <Box sx={{width: '10%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center'}}>
                    {exampleScreen !== 2 &&
                        <Button onClick={moveRight}>
                            <ArrowForwardIcon/>
                        </Button>
                    }
                </Box>
            </Box>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', mt: 0.15}}>
                <Box sx={{width: '50%', display: 'flex', justifyContent: 'center'}}>
                    <Button onClick={removeNotice}>Start Importing</Button>
                </Box>
            </Box>
        </Box>
    )
}