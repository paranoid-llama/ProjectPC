import {useSelector, useDispatch} from 'react-redux'
import {Box} from '@mui/material'
import store from './../../app/store'
import listStyles from './../../../utils/styles/componentstyles/liststyles'
import modalStyles from './../../../utils/styles/componentstyles/modalstyles'
import {deselect} from './../../app/slices/editmode'

export default function Selection({height='76px', modal=false, onhandSelection=false, deselectFunc, otherStyles={}}) {
    const selectionBoxStyles = modal ? modalStyles.selectionBox : listStyles.collection.selectionBox
    return (
        <Box sx={{
            position: 'absolute', 
            width: '100%',
            zIndex: 1
        }}>
            <Box sx={{
                position: 'absolute', 
                left: selectionBoxStyles.left, 
                top: onhandSelection ? '-15px' : selectionBoxStyles.top, 
                border: selectionBoxStyles.border,
                height, 
                ':hover': {
                    cursor: 'pointer'
                },
                ...otherStyles,
                ...selectionBoxStyles.widthScaling
            }}
                onClick={deselectFunc} 
            >
            </Box>
        </Box>
    )
}