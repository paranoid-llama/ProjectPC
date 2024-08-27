import {useEffect} from 'react';
import { Alert, Box, Fade, Typography} from '@mui/material';
import { useSelector } from 'react-redux';
import ImgData from '../components/collectiontable/tabledata/imgdata';
import './alerts.css'

const CustomAlert = ({
    message = '',
    message2 = '',
    errName = '',
    errStatus = '',
    messageImgs = [],
    severity = 'success',
    timeout = 0,
    fadeoutTime = 1,
    isErrorLiteral = false,
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
    const otherStyles = isErrorLiteral ? {display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center'} : messageImgs.length !== 0 ? {display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', gap: 2} : {}

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
                        ...otherStyles,
                        pointerEvents: 'all'
                    }}
                >
                    {isErrorLiteral ? 
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start'}}>
                            <Box>
                                <Typography sx={{fontSize: '16px'}}><b>ERROR:</b> {errName} ({errStatus})</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{fontSize: '14px'}}>{message}</Typography>
                                {message2 !== '' && <Typography sx={{fontSize: '12px'}}>{message2}</Typography>}
                            </Box>
                        </Box> :
                        <Box sx={otherStyles}>
                        {message}
                        {messageImgs !== 0 &&
                        <Box sx={{display: 'flex', flexDirection: 'row', height: '100%', alignItems: 'center'}}>
                        {messageImgs.map((mImg, idx) => {
                            return (
                                <ImgData key={`img-${idx}-${mImg.linkKey}`} type={mImg.type} linkKey={mImg.linkKey} size='32px'/>
                            )
                        })}
                        </Box>}
                        </Box>
                    }
                </Alert>
            </Fade>
        )
    )
}

const AlertsWrapper = ({dismissAlert}) => {
    const alerts = useSelector(state => state.alerts)

    return (
        <Box className='alertarea'>
            {alerts.map((alert) => (
                <CustomAlert key={alert.id} {...alert} handleDismiss={() => {dismissAlert(alert.id)}} />
            ))}
        </Box>
    )
}

export {CustomAlert, AlertsWrapper}