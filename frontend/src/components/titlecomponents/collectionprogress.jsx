import {Box, Typography, Button, useTheme} from '@mui/material'
import {Carousel} from 'react-responsive-carousel'
import {useState, useEffect} from 'react'
import BallProgress from './subcomponents/ballprogress'
import ImgData from '../collectiontable/tabledata/imgdata'
import { selectScreenBreakpoint } from '../../app/selectors/windowsizeselectors'
import { selectBallProgress } from '../../app/selectors/selectors'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setCirclePositionStyles, setRowXScaling } from '../../../utils/functions/ballprogresscircle/ballprogress'
import { getBallProgress } from '../../../utils/functions/ballprogresscircle/ballprogressstate'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CollectionProgress({ballScopeInit, isEditMode, collectionList, isOwner, userData, demo, sw}) {
    const [selectedBall, setSelectedBall] = useState('')
    const theme = useTheme()
    const link = useLocation().pathname
    const breakpoint = useSelector((state) => selectScreenBreakpoint(state, 'ballprogress'))
    const collectionListState = useSelector((state) => state.collectionState.collection)
    const listToCompareFrom = (isEditMode || demo) ? collectionListState.filter((mon) => mon.disabled === undefined) : collectionList.filter((mon) => mon.disabled === undefined)
    const totalProgress = getBallProgress(listToCompareFrom, 'total')

    const totalBallsState = useSelector((state) => state.collectionState.options.collectingBalls)
    const setBallOrder = (totalBalls) => userData ? userData.settings.display.ballOrder.filter(b => totalBalls.includes(b)) : totalBalls
    //refer to showcollectionlist for why we do below
    // const totalBalls = (totalBallsState === undefined || !isEditMode) ? JSON.parse(JSON.stringify(ballScopeInit)) : JSON.parse(JSON.stringify(totalBallsState)) //need new reference as we mutate this variable
    const totalBalls = JSON.parse(JSON.stringify(setBallOrder((totalBallsState === undefined || (!isEditMode && !demo)) ? ballScopeInit : totalBallsState)))
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

    const topRowSwTotalProgLen = sw && totalBalls.slice(0, Math.ceil(totalBalls.length/2)).length
    const bottomRowSwTotalProgLen = sw && totalBalls.slice(Math.ceil(totalBalls.length/2), totalBalls.length).length
    const totalProgSwTopRowGap = sw && (topRowSwTotalProgLen <= 4 ? 5 : topRowSwTotalProgLen === 5 ? 3 : 2)
    const totalProgSwBottomRowGap = sw && (bottomRowSwTotalProgLen <= 4 ? 5 : bottomRowSwTotalProgLen === 5 ? 3 : 2)

    const smSm = breakpoint === 'smSm'
    const mdSm = breakpoint === 'mdSm'
    const regSm = breakpoint === 'sm'

    return (
        <Box sx={{position: 'relative', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {sw ? 
            <Carousel
                infiniteLoop
                showThumbs={false}
                showIndicators={true}
                showArrows={true}
                showStatus={false}
                width={smSm ? 320 : mdSm ? 400 : 550}
                renderArrowNext={(clickHandler) => (
                    <Button onClick={clickHandler} sx={{position: 'absolute', top: '0px', left: '50%', width: '50%', height: '100%', zIndex: 100, ...theme.components.box.fullCenterRow, justifyContent: 'end'}}><ArrowForwardIcon sx={{fontSize: smSm ? '32px' : mdSm ? '40px' : '50px', color: 'white', opacity: 0.75}}/></Button>
                )}
                renderArrowPrev={(clickHandler) => (
                    <Button onClick={clickHandler} sx={{position: 'absolute', left: '0%', width: '50%', height: '100%', zIndex: 100, ...theme.components.box.fullCenterRow, justifyContent: 'start'}}><ArrowBackIcon sx={{fontSize: smSm ? '32px' : mdSm ? '40px' : '50px', color: 'white', opacity: 0.75}}/></Button>
                )}
            >
                <Box sx={{height: '100%', ...theme.components.box.fullCenterCol, gap: 2}}>
                    <Box sx={{height: '20%', ...theme.components.box.fullCenterRow, gap: regSm ? totalProgSwTopRowGap +2 : mdSm ? totalProgSwTopRowGap +1 : totalProgSwTopRowGap}}>
                        {totalBalls.slice(0, Math.ceil(totalBalls.length/2)).map((ball) => {
                            return (
                                <Box key={`sw-total-progress-display-${ball}-ball`} sx={{width: regSm ? '48px' : mdSm ? '40px' : '32px', height: '45px'}}>
                                    <BallProgress 
                                        ball={ball}
                                        size={regSm ? '48px' : mdSm ? '40px' : '32px'}
                                        progress={getBallProgress(listToCompareFrom, ball)}
                                        addProgLabel={false}
                                        customProgColor={theme.palette.color3.dark}
                                        sw={true}
                                    />
                                </Box>
                            )
                        })}
                    </Box>
                    <Box sx={{height: '30%', ...theme.components.box.fullCenterCol, gap: 1}}>
                    <Typography sx={{fontSize: mdSm ? '32px' : '30px', fontWeight: 700}} variant='h4'>Total Progress</Typography>
                    <Typography sx={{fontSize: mdSm ? '26px' : '24px', fontWeight: 700}} variant='h5'>{totalProgress.display} ({Math.floor(totalProgress.percent*100)/100}%)</Typography>
                    </Box>
                    <Box sx={{height: '20%', ...theme.components.box.fullCenterRow, gap: regSm ? totalProgSwBottomRowGap +2 : mdSm ? totalProgSwBottomRowGap+1 : totalProgSwBottomRowGap, mb: 2}}>
                    {totalBalls.slice(Math.ceil(totalBalls.length/2), totalBalls.length).map((ball) => {
                        return (
                            <Box key={`sw-total-progress-display-${ball}-ball`} sx={{width: regSm ? '48px' : mdSm ? '40px' : '32px', height: '45px'}}>
                                <BallProgress 
                                    ball={ball}
                                    size={regSm ? '48px' : mdSm ? '40px' : '32px'}
                                    progress={getBallProgress(listToCompareFrom, ball)}
                                    addProgLabel={false}
                                    customProgColor={theme.palette.color3.dark}
                                    sw={true}
                                />
                            </Box>
                        )
                    })}
                    </Box>
                </Box>
                {totalBalls.map((ball, idx) => {
                    return (
                        <Box  key={`sw-individual-progress-display-${ball}-ball`} sx={{height: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
                            <Box sx={{width: '150px', height: '250px', mt: -3, mb: 1}}>
                            <BallProgress 
                                ball={ball}
                                progress={getBallProgress(listToCompareFrom, ball)}
                                sw={sw}
                                customProgColor={theme.palette.color3.dark}
                                size={158}
                                addLabel={true}
                                addProgLabel={true}
                            />
                            </Box>
                        </Box>
                    )
                })}
            </Carousel> : 
            <>
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
            }</>
            }
        </Box>
    )
}