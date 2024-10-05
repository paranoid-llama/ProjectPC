import {Box, Typography} from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RedirectPage({redirectLink, demo}) {
    const [second, setSecond] = useState(5)
    const navigate = useNavigate()
    useEffect(() => {
        if ((second !== 0 && redirectLink !== undefined && second !== 'redirect')) {
            setTimeout(() => {
                setSecond(second-1)
            }, 1000)
        } else if ((second === 0 && redirectLink !== undefined)) {
            //note: if demo is true, redirectLink becomes full collection data.
            const stateData = demo ? {state: {collection: redirectLink}} : {}
            setTimeout(() => {
                navigate(demo ? '/demo-collection' : `/collections/${redirectLink}`, stateData)
            }, 1000)
        }
    })

    const stateProp = demo ? {state: {collection: redirectLink}} : {}

    if (second === 'redirect') {
    }
    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2}}>
            <Typography sx={{fontSize: redirectLink !== undefined ? '36px' : '32px', fontWeight: 700}}>
                {redirectLink !== undefined ? 'Collection Created!' : 'Creating Collection...'}
            </Typography>
            {redirectLink === undefined && 
                <LinearProgress sx={{width: '60%'}} variant='indeterminate'/>
            }
            {redirectLink !== undefined && 
                <>
                <Typography sx={{fontSize: '14px'}}>
                    You will be re-directed to your collection page in <b>{second}</b>...
                </Typography>
                <Typography sx={{fontSize: '14px'}}>
                    Alternatively, you can <Link to={demo ? '/demo-collection' : `/collections/${redirectLink}`} {...stateProp}>click here</Link> to redirect immediately!
                </Typography>
                </>
            }
            <Box sx={{height: '40%'}}></Box>
        </Box>
    )
}