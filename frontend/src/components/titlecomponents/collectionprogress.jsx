import {Box, Typography, Button} from '@mui/material'
import {useState, useEffect} from 'react'
import BallProgress from './subcomponents/ballprogress'
import { selectScreenBreakpoint } from '../../app/selectors/windowsizeselectors'
import { selectBallProgress } from '../../app/selectors/selectors'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setCirclePositionStyles, setRowXScaling } from '../../../utils/functions/ballprogresscircle/ballprogress'
import { getBallProgress } from '../../../utils/functions/ballprogresscircle/ballprogressstate'

export default function CollectionProgress({ballScopeInit, isEditMode, collectionList, isOwner, userData}) {
    const [selectedBall, setSelectedBall] = useState('')
    const link = useLocation().pathname
    const breakpoint = useSelector((state) => selectScreenBreakpoint(state, 'ballprogress'))
    const collectionListState = useSelector((state) => state.collectionState.collection)
    const listToCompareFrom = (isEditMode) ? collectionListState.filter((mon) => mon.disabled === undefined) : collectionList.filter((mon) => mon.disabled === undefined)
    const totalProgress = getBallProgress(listToCompareFrom, 'total')

    const totalBallsState = useSelector((state) => state.collectionState.options.collectingBalls)
    const setBallOrder = (totalBalls) => userData ? userData.settings.display.ballOrder.filter(b => totalBalls.includes(b)) : totalBalls
    //refer to showcollectionlist for why we do below
    // const totalBalls = (totalBallsState === undefined || !isEditMode) ? JSON.parse(JSON.stringify(ballScopeInit)) : JSON.parse(JSON.stringify(totalBallsState)) //need new reference as we mutate this variable
    const totalBalls = JSON.parse(JSON.stringify(setBallOrder((totalBallsState === undefined || (!isEditMode)) ? ballScopeInit : totalBallsState)))
    // const apriballs = balls.slice(0, 11)
    const setCircleLayout = totalBalls.length > 6 && breakpoint !== 'lg'
    const setRowLayout = (totalBalls.length <= 6 && breakpoint === 'md') || breakpoint === 'lg'
    
    if (totalBalls.length % 2 === 1 && selectedBall !== '') {
        totalBalls.splice(totalBalls.indexOf(selectedBall), 1) 
    }

    const handleBallSelect = (e) => {
        if (selectedBall === e.target.value && totalBalls.length % 2 === 0) {
            setSelectedBall('') 
            return
        }
        setSelectedBall(e.target.value)
    }

    const seeTotalProgress = () => {
        setSelectedBall('')
    }

    const totalProgressStyles = {
        label: {
            '@media only screen and (min-width: 1000px)': {
                right: '50%',
                fontSize: '30px'
            },
            '@media only screen and (min-width: 900px) and (max-width: 999px)': {
                right: '48%',
                fontSize: '30px'
            },
            '@media only screen and (max-width: 899px)': {
                right: '48%',
                fontSize: '24px'
            }
        },
        text: {
            '@media only screen and (min-width: 1000px)': {
                right: '20%',
                fontSize: '20px'
            },
            '@media only screen and (min-width: 900px) and (max-width: 999px)': {
                right: '18%',
                fontSize: '20px'
            },
            '@media only screen and (max-width: 899px)': {
                right: '18%',
                fontSize: '14px'
            }
        }
    }

    useEffect(() => {
        setSelectedBall('')
    }, [link])

    return (
        <Box sx={{position: 'relative', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {setRowLayout && <Typography sx={{position: 'absolute', top: '-25px', ...totalProgressStyles.label, fontWeight: 700}} variant='h4'>Total Progress</Typography> }
            {setRowLayout && <Typography sx={{position: 'absolute', top: '-20px', ...totalProgressStyles.text, fontWeight: 700}} variant='h5'>{totalProgress.display}</Typography> }
            {setRowLayout &&
            totalBalls.map((ball, idx) => {
                const scalingStyles = setRowXScaling(idx, totalBalls.length)
                const topRowBall = ((idx+1) % 2 === 0) && (totalBalls.length >= 6)
                const topPosition = topRowBall ? '30%' : totalBalls.length >= 6 ? '70%' : '50%'
                const position = {top: topPosition, left: scalingStyles.left}
                const progress = getBallProgress(listToCompareFrom, ball)
                return <BallProgress key={`progress-bar-${ball}-ball`} ball={ball} position={position} size={scalingStyles.size} lgScreen={true} addLabel={totalBalls.length < 6} smallerSizeLabel={totalBalls.length < 6 && totalBalls.length === 5} progress={progress}/>
            })
            }
            {setCircleLayout && 
            totalBalls.map((ball, idx) => {
                const positioning = setCirclePositionStyles(idx, totalBalls.length)
                const selected = ball === selectedBall
                const ballProgress = getBallProgress(listToCompareFrom, ball)
                return <BallProgress
                            key={`progress-bar-${ball}-ball`} 
                            ball={ball} 
                            className={positioning.className} 
                            position={positioning.position} 
                            circleOrientation={true}
                            selected={selected}
                            handleBallChange={handleBallSelect}
                            progress={ballProgress}
                        />
            })
            }
            {setCircleLayout && selectedBall === '' && <Typography sx={{position: 'absolute', top: '60px', fontWeight: 700, fontSize: '32px'}} variant='h4'>Total Progress</Typography>}
            {setCircleLayout && selectedBall === '' && <Typography sx={{position: 'absolute', top: '100px', fontWeight: 700}} variant='h5'>{totalProgress.display}</Typography>}
            {(setCircleLayout && selectedBall !== '') && 
                <BallProgress 
                  ball={selectedBall}
                  position={{right: '50%', top: '50%'}}
                  circleCenterBall={true}
                  progress={getBallProgress(listToCompareFrom, selectedBall)}
                />
            }
            {(setCircleLayout && totalBalls.length % 2 === 0 && selectedBall !== '') && 
                <Button sx={{position: 'absolute', top: '-30px'}} size='small' onClick={seeTotalProgress}>
                    Total Progress
                </Button>
            }
        </Box>
    )
}