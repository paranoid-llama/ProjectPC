import {Box, Typography, useTheme} from '@mui/material'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import BodyWrapper from '../components/partials/routepartials/bodywrapper'

export default function Error({}) {
    const navigate = useNavigate()
    const errorData = useLocation().state
    const noErrorData = errorData === null

    useEffect(() => {
        if (noErrorData) {
            navigate('/')
        }
    }, [])

    return (
        <BodyWrapper>
            {!noErrorData &&
            <Box sx={{height: '750px', width: '100%', borderRadius: '10px', ...theme.components.box.fullCenterCol, justifyContent: 'start', backgroundColor: 'rgba(220, 53, 69, 0.25)', color: 'white'}}>
                <Typography sx={{fontSize: '32px', fontWeight: 700, my: 2}}>ERROR: {errorData.name}</Typography>
                <Typography sx={{fontSize: '24px', my: 1}}>{errorData.message}</Typography>
                <Typography sx={{fontSize: '12px'}}>Status Code: {errorData.status}</Typography>
            </Box>
            }
        </BodyWrapper>
    )
}