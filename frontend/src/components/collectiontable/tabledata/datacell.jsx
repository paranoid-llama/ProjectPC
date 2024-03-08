import {Box, TableCell, Typography} from '@mui/material'
import ImgData from './imgdata'
import {useSelector, useDispatch} from 'react-redux'
import {setSelected, deselect} from './../../../app/slices/editmode'
import store from './../../../app/store'
import Selection from './../selection'

export default function DataCell({label, styles, alignment='none', isEditMode, imgParams={isImg: false}, leftMostCell=false, isSelected=false, onClickFunc, onhandCells=false, specialStyles={}, blackSquare=false}) {
    const {isImg, imgLinkKey, imgSize='32px', imgType='poke'} = imgParams
    const blackSquareStyles = blackSquare ? {backgroundColor: 'black'} : {}
    const noInfo = label === '(No Info)'
    const otherTextStyles = noInfo ? {opacity: 0.5} : {}
    return (
        <TableCell 
            padding='none' 
            sx={!(blackSquare) ? styles.tableCell : blackSquareStyles}
            onClick={isEditMode ? onClickFunc : null}
        >
            {(leftMostCell === true && isSelected === true) && <Selection height={onhandCells ? '71.016px' : '76px'} onhandSelection={onhandCells}/>}
            <Box sx={!(blackSquare) ? {...alignment, ...styles.bodyColor} : {}}>
                {isImg ? 
                <ImgData type={imgType} size={imgSize} linkKey={imgLinkKey}/> :
                !(blackSquare) && <Typography sx={{...otherTextStyles, ...specialStyles}} variant={'body2'}>{label}</Typography>
                }
            </Box>
        </TableCell> 
    )
}