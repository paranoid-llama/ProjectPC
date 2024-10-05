import {Box, Typography, Button} from '@mui/material'
import { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Header from '../../../../titlecomponents/subcomponents/header'
import RedirectPage from './redirectpage'
import AprimonReviewFinalize from '../aprimon/aprimonreviewfinalize'

export default function ReviewFinalizeBase({collectionType, formData, goBackStep, cssClass, handleChange, redirectLink, demo}) {
    const [createdCollection, setCreatedCollection] = useState(false)

    const createCollection = () => {
        setCreatedCollection(true)
        handleChange()
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, height: '581px', position: 'relative'}} className={cssClass}>
            <Header additionalStyles={{color: 'black', paddingBottom: '2px', height: '32px'}}>Review and Finalize</Header>
            <Typography sx={{fontSize: '12px'}}>{formData.options.collectionName}</Typography>
            <Typography sx={{fontSize: '12px'}}>{collectionType}</Typography>
            <Box sx={{width: '100%', height: '95%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {createdCollection === false && <AprimonReviewFinalize formData={formData}/>}
                {createdCollection === true && <RedirectPage redirectLink={redirectLink} demo={demo}/>}
            </Box>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '95%', zIndex: 1}}>
                <Box sx={{display: 'flex', width: '90%'}}>
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'start'}}>
                        <Button onClick={goBackStep.func}>
                            <ArrowBackIcon/>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{goBackStep.stepName}</Typography>
                        </Button>
                    </Box>
                    {!createdCollection &&
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'end'}}>
                        <Button onClick={createCollection}>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>Create Collection</Typography>
                            <ArrowForward/>
                        </Button>
                    </Box>
                    }
                </Box>
            </Box>
        </Box>
    )
}