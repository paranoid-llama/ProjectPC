import {Box, Typography, useTheme} from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { renderBallListDragVer } from '../../../../../../utils/functions/renderballselection'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import SWBallRender from './swballrender'

export default function SWRenderedBalls({allowedBalls}) {
    const theme = useTheme()
    const selectedBall = useSelector((state) => state.editmode.selectedBall)
    const renderedBallsInit = renderBallListDragVer(allowedBalls, selectedBall)
    const [renderedBalls, setRenderedBalls] = useState(renderedBallsInit)

    return (
        <>
            {renderedBalls.map(idx => {
                const ball = allowedBalls[idx]
                const isSelected = selectedBall === ball
                return (
                    // <ToggleButton sx={{zIndex: 602, padding: 0, borderRadius: '50%', pointerEvents: 'none'}}>
                    <Box sx={{margin: 0, position: 'relative'}}>
                        <ImgData type='ball' linkKey={ball} size='40px'/>
                        {isSelected &&
                        <Box sx={{position: 'absolute', width: '38px', height: '38px', top: '0px', border: '1px solid rgb(25, 118, 210)', borderRadius: '5px'}}>
                        </Box>
                        }
                    </Box>
                    // </ToggleButton>
                )
            })}
        </>
    )
}