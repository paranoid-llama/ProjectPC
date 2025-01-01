//drag ver of ball selection
import {Box, Typography, useTheme, Button} from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import {Carousel} from 'react-responsive-carousel'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getCenterOffset, getConstantBallBoundaries, renderBallListDragVer } from '../../../../../../utils/functions/renderballselection'
import { setSelectedBall, setPos, setPosRenderSelectedData, setPosRenderOHBallData, setAllData } from '../../../../../app/slices/editmode'
import { useDispatch, useSelector } from 'react-redux'
import SWRenderedBalls from './swrenderedballs'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'
import SWCollectionEditor from './swcollectioneditor'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

//important note regarding this component!!
// the onDrag event runs super slowly on development due to development specific features, but runs fine on production.
// supposedly the setPosition call on drag is too much despite it working super fine on dev beforehand. it started being slow
// after modifying this component to work for onhand lists.
// might be worth checking out a better solution if it ends up too slow on prod builds. 

export default function SWBallSelection({allowedBalls, ohBall=undefined, isCollectionList, baseImgWidth, baseGapWidth, pokemonId, pokemonIdx, useSetAllData=false, selectNextPrevBallsStyles={}}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const lessThan7ABalls = allowedBalls.length <= 8 //this should be renamed 8ABalls but too much work.
    const draggableRef = useRef(null)
    // const renderedBallsInit = lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, allowedBalls[0])

    const selectedBallState = useSelector((state) => state.editmode.selectedBall)
    const selectedBall = isCollectionList ? (!allowedBalls.includes(selectedBallState) ? allowedBalls[0] : selectedBallState) : ohBall

    const rendered = useSelector((state) => state.editmode.swCollection.rendered)
    const position = useSelector((state) => state.editmode.swCollection.position)
    // const [renderedBalls, setRenderedBalls] = useState({
    //     rendered: renderedBallsInit, 
    //     position: lessThan7ABalls ? getCenterOffset(parseInt(baseImgWidth), parseInt(baseGapWidth), allowedBalls, allowedBalls[0]) : 0, 
    //     selectedBall: lessThan7ABalls ? allowedBalls[0] : allowedBalls[renderedBallsInit[(renderedBallsInit.length-1)/2]]
    // })
    const selectedBallRef = useRef(selectedBall)
    const previousAllowedBalls = useRef([])
    const prevSelectedBallRef = useRef('')
    
    const baseImgAndGapWidth = `${parseInt(baseImgWidth)+parseInt(baseGapWidth)}px`
    const ballThreshholds = lessThan7ABalls ? getConstantBallBoundaries(parseInt(baseImgWidth), parseInt(baseGapWidth), allowedBalls, selectedBall) : {
        //17 rendered balls at a time (7 shown). (loops)
        //if less than 7, no infinite scroll.
        // as dragged to the left -> position increases. as dragged to the right => position decreases (negative x pos)
    }
    const maxXDisplacement = lessThan7ABalls ? (parseInt(baseImgWidth)*allowedBalls.length + parseInt(baseGapWidth)*(allowedBalls.length-1)) : 
        parseInt(baseImgAndGapWidth)*8 + 20

    const updateState = useSetAllData ? (newPosition, newBall) => {
        dispatch(setAllData({position: newPosition, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, newBall), pokemonIdx, newBall}))
    } : 
    isCollectionList ? (newPosition, newBall) => {
        dispatch(setPosRenderSelectedData({position: newPosition, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, newBall), selectedBall: newBall}))
    } : (newPosition, newBall) => {
        dispatch(setPosRenderOHBallData({position: newPosition, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, newBall), onhandId: pokemonId, newBall}))
    }
    
    if (!lessThan7ABalls) {
        rendered.forEach((b, idx) => {
            const positionModifier = (rendered.length-1)/2 > idx ? 1 : -1
            const middlePos = ((rendered.length-1)/2)+1
            const firstHalf = ((rendered.length-1)/2)+1 > idx+1
            const secondHalf = ((rendered.length-1)/2)+1 < idx+1
            const baseOffset = parseInt(baseImgWidth)/2
            // const minPosMultiplicationFactor = Math.abs(nineRenderedBalls ? 5-(idx+1) : 4-(idx+1))
            // const maxPosMultiplicationFactor = Math.abs(nineRenderedBalls ? 6-(idx+1) : 5-(idx+1))
            const posMultiplicationFactor = Math.abs(9-(idx+1))
            const finalMin = (idx === (rendered.length-1)/2) ? baseOffset :
                (firstHalf) ? positionModifier*posMultiplicationFactor*parseInt(baseImgAndGapWidth) + positionModifier*baseOffset : 
                positionModifier*posMultiplicationFactor*parseInt(baseImgAndGapWidth) + positionModifier*baseOffset + parseInt(baseImgWidth)
            // const finalMax = (idx === (renderedBalls.length-1)/2) ? -1*parseInt(baseImgAndGapWidth) : 
            //     (idx === 0 || idx === renderedBalls.length-1) ? maxPosMultiplicationFactor*positionModifier*parseInt(baseImgAndGapWidth) + -1*positionModifier*parseInt(baseGapWidth) : 
            //     positionModifier*maxPosMultiplicationFactor*parseInt(baseImgAndGapWidth)
            const finalMax = (idx === (rendered.length-1)/2) ? -1*baseOffset :
                (firstHalf) ? positionModifier*posMultiplicationFactor*parseInt(baseImgAndGapWidth) + positionModifier*baseOffset - parseInt(baseImgWidth) : 
                positionModifier*posMultiplicationFactor*parseInt(baseImgAndGapWidth) + positionModifier*baseOffset
            if (ballThreshholds[allowedBalls[b]] !== undefined) {
                ballThreshholds[allowedBalls[b]] = [...ballThreshholds[allowedBalls[b]], {min: finalMin, max: finalMax}]
            } else {
                ballThreshholds[allowedBalls[b]] = [{min: finalMin, max: finalMax}]
            }
        })
    } 


    const dragHandler = (e, data) => {
        
        const withinThreshhold = {hit: ''}
        Object.keys(ballThreshholds).forEach(bT => {
            const bTMinMaxes = ballThreshholds[bT]
            const exactMiddlePoints = bTMinMaxes.map(btMm => (btMm.min+btMm.max)/2)
            const withinAMiddlePoint = exactMiddlePoints.map(mP => data.x === mP || (mP >= data.x-1 && mP <= data.x+1)).includes(true)
            if (withinAMiddlePoint) {
                withinThreshhold.hit = bT
            }
        })
        if (withinThreshhold.hit !== selectedBall && withinThreshhold.hit !== '') {
            if (position < 0) {
                const newBall = lessThan7ABalls ? withinThreshhold.hit : allowedBalls[rendered[rendered.indexOf(allowedBalls.indexOf(selectedBall))+1]]
                const newPosition = lessThan7ABalls ? (ballThreshholds[newBall][0].min + ballThreshholds[newBall][0].max)/2 : 0
                // dispatch(setSelectedBall(newBall))
                // dispatch(setPosRenderSelectedData({position: newPosition, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, newBall), selectedBall: newBall}))
                updateState(newPosition, newBall)
                // setRenderedBalls({...renderedBalls, position: newPosition, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, newBall), selectedBall: newBall})
            } else {
                //frankly cant remember why i get the new ball this way, but im gonna keep it anyway. it caused problems for lessthan7aballs
                const newBall = lessThan7ABalls ? withinThreshhold.hit : allowedBalls[rendered[rendered.indexOf(allowedBalls.indexOf(selectedBall))-1]]
                const newPosition = lessThan7ABalls ? (ballThreshholds[newBall][0].min + ballThreshholds[newBall][0].max)/2 : 0
                // dispatch(setSelectedBall(newBall))
                // dispatch(setPosRenderSelectedData({position: newPosition, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, newBall), selectedBall: newBall}))
                updateState(newPosition, newBall)
                // setRenderedBalls({...renderedBalls, position: newPosition, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, newBall), selectedBall: newBall})
            }
        } else {
            dispatch(setPos(data.x))
        }
    }

    const snapHandler = (e, data) => {
        const boundBallData = Object.keys(ballThreshholds).map((ballT) => {
            const possibleBoundaries = ballThreshholds[ballT]
            const isInBoundary = possibleBoundaries.map(pB => data.x <= pB.min && data.x >= pB.max).includes(true)
            return isInBoundary
        })
        const hitGap = !boundBallData.includes(true)
        if (hitGap) {
            const closestBallData = Object.keys(ballThreshholds).map((ballT) => {
                const possibleBoundaries = ballThreshholds[ballT]
                const maxDisplacementAdjusted = lessThan7ABalls ? 
                    {
                        leftMaxDisplacement: (rendered.indexOf(allowedBalls.indexOf(selectedBall))+1)*parseInt(baseImgAndGapWidth)+20, 
                        rightMaxDisplacement: (rendered.length - rendered.indexOf(allowedBalls.indexOf(selectedBall))+1)*parseInt(baseImgAndGapWidth)+20
                    } : {}
                const maxRightDisplacement = lessThan7ABalls ? -1*maxDisplacementAdjusted.rightMaxDisplacement : -1*maxXDisplacement
                const maxLeftDisplacement = lessThan7ABalls ? maxDisplacementAdjusted.leftMaxDisplacement : maxXDisplacement
                const isClosestBall = (data.x <= maxRightDisplacement || data.x >= maxLeftDisplacement) ? 
                    (data.x <= maxRightDisplacement) ? allowedBalls[rendered[rendered.length-1]] === ballT : 
                    (data.x >= maxLeftDisplacement) && allowedBalls[rendered[0]] === ballT : 
                    possibleBoundaries.map(pB => {
                        return Math.abs(data.x-pB.min)<=8 || Math.abs(pB.max-data.x)<=8
                    }).includes(true)
                return isClosestBall
            })
            const closestBall = Object.keys(ballThreshholds)[closestBallData.indexOf(true)]
            //i keep line below since despite trying to account for it in closest ball data, sometimes with lessthan7aballs, if you drag too fast it still ends
            //up undefined when going past the maxXdisplacement.
            const trueClosestBall = closestBall === undefined ? 
                data.x < 0 ? allowedBalls[-1] : allowedBalls[0] : closestBall
            const position = lessThan7ABalls ? getCenterOffset(parseInt(baseImgWidth), parseInt(baseGapWidth), allowedBalls, trueClosestBall) : 0
            // dispatch(setSelectedBall(trueClosestBall))
            // dispatch(setPosRenderSelectedData({position, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, trueClosestBall), selectedBall: trueClosestBall}))
            updateState(position, trueClosestBall)
            // setRenderedBalls({...renderedBalls, position, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, trueClosestBall), selectedBall: trueClosestBall})
        } else {
            const hitBall = Object.keys(ballThreshholds)[boundBallData.indexOf(true)]
            const position = lessThan7ABalls ? getCenterOffset(parseInt(baseImgWidth), parseInt(baseGapWidth), allowedBalls, hitBall) : 0
            // dispatch(setPosRenderSelectedData({position, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, hitBall), selectedBall: hitBall}))
            updateState(position, hitBall)
            // setRenderedBalls({...renderedBalls, position, rendered: lessThan7ABalls ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, hitBall), selectedBall: hitBall})
        }
    }
    useEffect(() => {
        // console.log(previousAllowedBalls.current)
        // console.log(allowedBalls)
        // console.log(selectedBallRef.current)
        // console.log(selectedBall)
        const sameAllowedBallsList = !previousAllowedBalls.current.map(b => allowedBalls.includes(b)).includes(false) && previousAllowedBalls.current.length === allowedBalls.length
        const sameBall = !isCollectionList && (selectedBallRef.current && selectedBallRef.current === selectedBall)
        if (!sameAllowedBallsList || (!isCollectionList && !sameBall)) {
            const rendered = allowedBalls.length <= 8 ? allowedBalls.map((b, idx) => idx) : renderBallListDragVer(allowedBalls, (isCollectionList && !useSetAllData) ? allowedBalls[0] : selectedBall)
            const position = allowedBalls.length <= 8 ? getCenterOffset(parseInt(baseImgWidth), parseInt(baseGapWidth), allowedBalls, (isCollectionList && !useSetAllData) ? allowedBalls[0] : selectedBall) : 0
            const ballInit = allowedBalls.length <= 8 ? allowedBalls[0] : allowedBalls[rendered[(rendered.length-1)/2]]
            if (useSetAllData) {
                if (previousAllowedBalls.current.length === 0) {
                    dispatch(setPosRenderOHBallData({rendered, position, noOhUpdate: true}))
                } else {
                    dispatch(setAllData({rendered, position, noOhUpdate: true}))
                }
            }
            else if (isCollectionList) {dispatch(setPosRenderSelectedData({rendered, position, selectedBall: ballInit}))}
            else {dispatch(setPosRenderOHBallData({rendered, position, noOhUpdate: true}))}
        }
    }, [pokemonId])

    useEffect(() => {
        previousAllowedBalls.current = allowedBalls
    }, [allowedBalls])
    useEffect(() => {
        if (selectedBallRef && selectedBallRef.current !== selectedBall) {
            draggableRef.current.focus()
        }
        if (!isCollectionList) {
            selectedBallRef.current = selectedBall
        }

    }, [isCollectionList, selectedBall])

    const boundsProp = lessThan7ABalls ? {bounds: {left: -1*maxXDisplacement/2, right: (maxXDisplacement/2)}} : {}

    return (
        <Box sx={{position: 'relative', width: '100%', height: '55px', ...theme.components.box.fullCenterCol, justifyContent: 'start', my: 1}}>
            <style>
                {
                `
                @keyframes grow-ball {
                    from {
                        width: 20px;
                        height: 20px;
                    }
                    to {
                        width: 40px;
                        height: 40px
                    }
                }
                
                @keyframes shrink-ball {
                    from {
                        width: 40px;
                        height: 40px;
                    }
                    to {
                        width: 20px;
                        height: 20px
                    }
                }
                .grow-ball {
                    animation: 0.5s ease-out 0s 1 grow-ball;
                }
                .shrink-ball {
                    animation: 0.5s ease-out 0s 1 shrink-ball;
                }
                `
                }
            </style>
            <Box sx={{position: 'absolute', bottom: '98%'}}>
                <Typography>{capitalizeFirstLetter(selectedBall)} Ball</Typography>
            </Box>
            {/* <Button sx={{position: 'absolute', bottom: '98%', height: '30px', left: '0px', }}>

            </Button>
            <Button>
                
            </Button> */}
            <Box sx={{position: 'relative', width: '100%', margin: 0, paddingY: 0, maxWidth: '376px', height: '55px', overflowX: 'hidden', ...theme.components.box.fullCenterCol, justifyContent: 'start'}} >
                <Draggable
                    position={{x: position, y: 0}}
                    {...boundsProp}
                    axis='x'
                    onDrag={dragHandler}
                    onStop={snapHandler}
                    nodeRef={draggableRef}
                >
                    <Box ref={draggableRef} sx={{position: 'absolute', ...theme.components.box.fullCenterRow, gap: 2, width: '150%', paddingY: '5px'}}>
                        {rendered.map((idx, i) => {
                            const ball = allowedBalls[idx]
                            const isSelected = ball === selectedBall
                            return (
                                <Box sx={{margin: 0, position: 'relative'}} key={`sw-${ball}-ball-${i}-selection`}>
                                    <Box sx={{width: '40px', height: '40px', ...theme.components.box.fullCenterCol, zIndex: 1, pointerEvents: 'none'}}>
                                        {ball !== undefined && 
                                        //for a split second (im guessing) when switching to a mon with a more restrictive allowed balls list,
                                        //it tries rendering that restricted ball which is undefined and it shows in the log
                                        //this ternary operator just ensures that doesnt happen

                                        //if you include the button below, it makes the drag SUPER slow for larger allowed balls list. i just opted to have a prev/next button
                                        // !isSelected ? 
                                        // <Button sx={{padding: 0, height: '100%', width: '100%', borderRadius: '50%', minWidth: '0px'}} onClick={() => {
                                        //     const newPosition = lessThan7ABalls ? getCenterOffset(parseInt(baseImgWidth), parseInt(baseGapWidth), allowedBalls, ball) : 0
                                        //     updateState(newPosition, ball)
                                        // }}>
                                        //     <ImgData 
                                        //         type='ball' 
                                        //         linkKey={ball}
                                        //         size={!isSelected ? '20px' : '40px'} 
                                        //         additionalClasses={
                                        //             !isSelected && prevSelectedBallRef.current === ball ? 'shrink-ball' : 
                                        //             isSelected && (prevSelectedBallRef.current !== ball) ? 'grow-ball' : 
                                        //             ''
                                        //         }
                                        //     />
                                        // </Button> : 
                                        <ImgData 
                                            type='ball' 
                                            linkKey={ball}
                                            size={!isSelected ? '20px' : '40px'} 
                                            additionalClasses={
                                                !isSelected && prevSelectedBallRef.current === ball ? 'shrink-ball' : 
                                                isSelected && (prevSelectedBallRef.current !== ball) ? 'grow-ball' : 
                                                ''
                                            }
                                        />
                                        }
                                    </Box>
                                    {isSelected &&
                                    <Box sx={{position: 'absolute', width: '38px', height: '38px', top: '0px', border: '1px solid rgb(25, 118, 210)', borderRadius: '5px'}}>
                                    </Box>
                                    }
                                </Box>
                            )
                        })}
                    </Box>
                </Draggable>
            </Box>
        </Box>
    )
}