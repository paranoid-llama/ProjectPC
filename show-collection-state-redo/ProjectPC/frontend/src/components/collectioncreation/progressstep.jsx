import {Box, Typography} from '@mui/material'
import './progressstep.css'

export default function ProgressStep({percentNum, stepNum, stepText, currentProgress, transitionClass}) {
    const isCurrentStep = percentNum === currentProgress
    const width = isCurrentStep ? 70 : 40
    const containerStyles = transitionClass === 'none' ? {width: `${width}px`, top: `-${(width/4)}px`} : {}
   
    const offset = transitionClass === 'none' ? `${width/2}px` : '0px'
    const positioningStyle = transitionClass === 'none' ? {left: `calc(${percentNum}% - ${offset})`} : 
                             transitionClass === 'grow-step' ? {animationName: `grow-step-${percentNum}`, animationDuration: '0.5s', animationFillMode: 'forwards'} :
                             transitionClass === 'shrink-step' ? {animationName: `shrink-step-${percentNum}`, animationDuration: '0.5s', animationFillMode: 'forwards'} : {}
    
    const textStyles = transitionClass === 'none' ? {fontSize: '8px'} : {}

    return (
        <Box 
            sx={{
                position: 'absolute', 
                backgroundColor: 'green', 
                borderRadius: '40%',
                display: 'flex', 
                flexDirection: 'column',
                ...containerStyles,
                ...positioningStyle
            }}
        >
            <Box 
                sx={{
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: `${width*0.5}px`
                }} 
                className={
                    transitionClass === 'grow-step' ? 'grow-step-text-container' : transitionClass === 'shrink-step' ? 'shrink-step-text-container' : 'none'
                }
            >
                <Typography 
                    sx={{
                        ...textStyles
                    }}
                    className={
                        transitionClass === 'grow-step' ? 'grow-step-text' : transitionClass === 'shrink-step' ? 'shrink-step-text' : 'none'
                    }
                >
                    {stepNum}. {stepText}
                </Typography>
            </Box>
        </Box>
    )
}