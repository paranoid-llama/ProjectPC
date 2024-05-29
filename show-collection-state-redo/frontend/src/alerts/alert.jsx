import {useEffect} from 'react';
import { Alert, Box, Fade} from '@mui/material';
import ImgData from '../components/collectiontable/tabledata/imgdata';
import './alerts.css'

const CustomAlert = ({
    message = '',
    messageImgs = [],
    severity = 'success',
    timeout = 0,
    fadeoutTime = 1,
    handleDismiss = null
}) => {
    useEffect(() => {
        if (timeout > 0 && handleDismiss) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, timeout * 1000);
            return () => clearTimeout(timer)
        }
    }, []);

    const fadeoutDelay = timeout - fadeoutTime

    // could not get images to work in-line with the alert due to mui alert formatting issues
    // const generateImages = () => {
    //     return messageImgs.map((imgInfo) => {
    //         return <ImgData linkKey={imgInfo.linkKey} type={imgInfo.type} size='20px'/>
    //     })
    // }

    return (
        message?.length && (
            <Fade in={true} timeout={250}>
                <Alert 
                    severity={severity} 
                    onClose={(e) => {
                        e.preventDefault()
                        handleDismiss()
                    }} 
                    sx={{
                        marginTop: '5px',
                        animation: `${timeout}s ${fadeoutDelay}s 1 fade-out`,
                        pointerEvents: 'all'
                    }}
                >
                    {message}
                </Alert>
            </Fade>
        )
    )
}

const AlertsWrapper = ({children}) => {
    return (
        <Box className='alertarea'>
            {children}
        </Box>
    )
}

export {CustomAlert, AlertsWrapper}