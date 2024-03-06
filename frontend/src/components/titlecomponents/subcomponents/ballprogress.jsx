import {Box, CircularProgress, Typography, ToggleButton} from '@mui/material'
import { useSelector } from 'react-redux'
import { selectBallProgress } from '../../../app/selectors/selectors'
import ImgData from '../../collectiontable/tabledata/imgdata'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import './../../../../utils/styles/componentstyles/ballprogress.css'

export default function BallProgress({ball, position, className, size, lgScreen, circleOrientation, selected, handleBallChange, circleCenterBall, addLabel}) {

    const ballProgress = useSelector((state) => selectBallProgress(state, ball))
    const iconSize = size !== undefined ? size : circleCenterBall ? 100 : 40

    const labelStyles = lgScreen ? {fontSize: '14px', top: `${size/2}px`} : circleCenterBall ? {fontSize: '20px', top: '50px'} : {}

    return (
        <Box className={className} sx={{position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', ...position}}>
            {circleOrientation === true && 
                <ToggleButton 
                    sx={{position: 'absolute', opacity: 1, zIndex: 100, width: '40px', height: '40px', borderRadius: '50%', border: 'none'}} 
                    size='large'
                    value={ball}
                    selected={selected}
                    onChange={(e) => handleBallChange(e)}
                />
            }
            {(circleCenterBall || addLabel) && <Typography sx={{position: 'absolute', fontSize: addLabel ? '15px':'20px', top: addLabel ? '-65px':'-80px', width: '120px', height: '25px', fontWeight: 700}}>{`${capitalizeFirstLetter(ball)} Ball`}</Typography>}
            <CircularProgress sx={{position: 'absolute', opacity: 0.2}} variant='determinate' value={100} size={iconSize}/>
            <CircularProgress sx={{position: 'absolute'}} variant='determinate' value={ballProgress.percent} size={iconSize}/>
            <ImgData type='ball' linkKey={ball} setAbsolutePosition={true} size={`${iconSize-8}px`}/>
            {(lgScreen || circleCenterBall) && <Typography sx={{position: 'absolute', ...labelStyles, fontWeight: 700}}>{ballProgress.display}</Typography>}
        </Box>
    )
}