import {Box, Typography, useTheme} from '@mui/material'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'
import ImgData from '../../tabledata/imgdata'
import SmallWidthCheckbox from './smallwidthcheckbox'

export default function SmallWidthBallArea({p, rowBalls, isEditMode, handleEditBallInfo, collectionId, isRow2=false, allowedBallsTotal}) {
    const theme = useTheme()

    return (
        <Box sx={{...theme.components.box.fullCenterRow, justifyContent: isRow2 ? 'center' : 'start', width: '100%', height: '100%', padding: 0}}>
            {rowBalls.map((b) => {
                const ballData = p.balls[b]
                const noBallData = ballData === undefined
                const disabled = !noBallData && ballData.disabled
                return (
                    <Box key={`${p.name}-${b}-ball-table-cell`} sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: isRow2 ? `${100/6.75}%` : `${100/rowBalls.length}%`, height: '100%', gap: 0.5}}>
                        <Box sx={{height: '100%', width: '100%'}}>
                            {(noBallData || disabled) ? <Box sx={{backgroundColor: noBallData ? 'black' : 'grey', width: '100%', height: '100%', border: '1px solid black', borderTop: 'none'}}/> : 
                            <SmallWidthCheckbox 
                                ballInfo={ballData}
                                isEditMode={isEditMode}
                                handleEditBallInfo={handleEditBallInfo}
                                pokeName={p.name}
                                ball={b}
                                collectionId={collectionId}
                                isRow2={isRow2}
                                pokeid={p.imgLink}
                                allowedBallsTotal={allowedBallsTotal}
                            />
                            }
                        </Box>
                        
                    </Box>
                )
            })}
        </Box>
    )
}