import {Box, LinearProgress} from '@mui/material'
import { useRef, useEffect } from 'react'
import ProgressStep from './progressstep'

export default function CreationProgress({progress}) {
    const progressRef = useRef(progress)
    const stepNum = [1, 2, 3, 4, 5]
    const stepPos = [0, 25, 50, 75, 100]
    const growStepIdx = stepPos.indexOf(progress)
    const shrinkStepIdx = stepPos.indexOf(progressRef.current)

    useEffect(() => {
        progressRef.current = progress
    })

    const stepText = ['Type', 'Import', 'Scope', 'Options', 'Finalize']
    
    return (
        <Box sx={{width: '80%', maxWidth: '800px', margin: 'auto', position: 'relative'}}>
            <LinearProgress variant='determinate' value={progress}/>
            {stepNum.map((num, idx) => {
                const growTransition = idx === growStepIdx 
                const shrinkTransition = idx === shrinkStepIdx
                return (
                    <ProgressStep key={`collection-creation-step-${num}`} percentNum={stepPos[idx]} stepNum={num} stepText={stepText[idx]} currentProgress={progress} transitionClass={growTransition ? 'grow-step' : shrinkTransition ? 'shrink-step' : 'none'}/>
                )
            })}
        </Box>
    )
}   
