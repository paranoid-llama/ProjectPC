import {useRef, useEffect, useState, useTransition} from 'react'
import {CSSTransition} from 'react-transition-group'
import {Box, ToggleButtonGroup, ToggleButton} from '@mui/material'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import {renderedBallList} from '../../../../../utils/functions/renderballselection'

export default function BallSelection({relativeHeight, relativeWidth, allowedBalls, handleChange, value, customBallStyles={}, customBallSize='32px'}) {
    const selectionBoxRef = useRef()
    const finalPositioning = customBallStyles.padding !== undefined ? (parseInt(customBallStyles.padding)*2+parseInt(customBallSize))/2 : (parseInt(customBallSize)+10)/2
    const renderedBalls = renderedBallList(allowedBalls, value, finalPositioning)

    const handleAllChange = (event, newBall) => {
        // code to make transition. WIP.
        // const renderedBallsIdx = (ball) => renderedBalls.indexOf(allowedBalls.indexOf(ball))
        // if (renderedBallsIdx(value) > renderedBallsIdx(newBall)) {
        // }
        if (newBall !== null && handleChange !== undefined) {
            handleChange(event, newBall)
        }
    }

    const renderBall = (ball, style, twoToFourAllowedBalls) => {
        const unselectedBall = ball !== value 
        const unselectedBallStyles = unselectedBall && {opacity: 0.5}
        const additionalStyles = twoToFourAllowedBalls && style
        return (
            <ToggleButton key={ball} sx={{border: 'none', ...unselectedBallStyles, padding: '5px', ...additionalStyles, ...customBallStyles}} value={ball}><ImgData size={customBallSize} type='ball' linkKey={ball}/></ToggleButton>
        )
    }

    const renderBallSelection = () => {
        const render = []
        const twoToFour = 2 <= allowedBalls.length && allowedBalls.length <= 4
        const renderSpecs = twoToFour ? renderedBalls.render : renderedBalls
        for (let ball of renderSpecs) {
            render.push(twoToFour ? renderBall(allowedBalls[ball], renderedBalls.style, twoToFour) : renderBall(allowedBalls[ball]))
        }
        return render
    }

    return (
        <Box sx={{height: relativeHeight, width: relativeWidth, position: 'relative', overflowX: 'hidden', overflowY: 'hidden'}}>
            <Box sx={{height: '100%', width: '100%', position: 'absolute'}} ref={selectionBoxRef}>
                <ToggleButtonGroup aria-label='ball-selection' sx={{height: '100%', width: '100%', justifyContent: 'center'}} value={value} onChange={handleAllChange}  exclusive>
                    {renderBallSelection().map(element => element)}
                </ToggleButtonGroup>
            </Box>
        </Box>
    )
}