import {Box, Typography, useTheme, TextField, Button} from '@mui/material'
import {useRef, useState} from 'react'
import { useDispatch } from 'react-redux'
import { NumericFormat } from 'react-number-format'
import { setQtyByPokemon } from '../../../../app/slices/collectionstate'
import { setUnsavedChanges } from '../../../../app/slices/editmode'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function ByPokemonQtyEditor({qtyData, fullIdSetsAndNums, pokeId, ball, width='40%', height='100%', wrapperStyles={}, labelStyles={}, fieldWrapperStyles={}, otherNumsSx={}, separationFactor=1, otherNumsOffset=0, smScreen}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const qtyTfRef = useRef(null)
    const [focused, setFocused] = useState(false)

    const handleEditQty = (increment, customQty=undefined) => {
        const removeMonFromDisplay = customQty === undefined ? 
            // below: if clicking the minus button and the selected ball quantity is 1 and it is the ONLY ball qty. 
            !increment && qtyData !== undefined && qtyData.numTotal === 1 && Object.values(fullIdSetsAndNums).map(bD => bD.numTotal).reduce((acc, cV) => acc+cV, 0) === 1 : 
            //below: if setting customQty to 0 and it is the ONLY ball qty
            customQty === 0 && qtyData !== undefined && Object.values(fullIdSetsAndNums).map(bD => bD.numTotal).reduce((acc, cV) => acc+cV, 0) === qtyData.numTotal
        dispatch(setQtyByPokemon({pokeId, ball, increment, customQty, removeMonFromDisplay, smScreen}))
        dispatch(setUnsavedChanges('onhand'))
    }

    return (
        <Box sx={{width, height, ml: '5%', ...theme.components.box.fullCenterCol, justifyContent: 'start', position: 'relative', ...wrapperStyles}}>
            <Typography sx={{fontSize: '13px', mb: '-5px', mt: '-3px', ...labelStyles}}>Qty</Typography>
            <Box sx={{width: '30%', height: '100%', ...theme.components.box.fullCenterCol, ...fieldWrapperStyles}}>
                <NumericFormat
                    sx={{position: 'relative', '& .MuiInputBase-root': {width: '100%', zIndex: 5, px: 0}, '&.MuiTextField-root': {my: -1}, '& .MuiInputBase-input': {px: 0.5, pt: 0.5, pb: 1.25, fontSize: '24px', textAlign: 'center', overflow: 'visible', fontWeight: 700}, '& .MuiOutlinedInput-notchedOutline': focused ? {} : {border: 'none'}}}
                    value={qtyData === undefined ? 0 : qtyData.numTotal}
                    inputRef={qtyTfRef}
                    onBlur={(e) => {
                        if (e.target.value !== undefined && e.target.value !== '' && !(e.target.value === 0 && qtyData=== undefined)) {
                            handleEditQty(parseInt(e.target.value) > (qtyData === undefined ? 0 : qtyData.numTotal), parseInt(e.target.value))  
                            
                        }
                        if (e.target.value === '') {
                            qtyTfRef.current.value = qtyData === undefined ? 0 : qtyData.numTotal
                        }
                        setFocused(false)
                    
                    }}
                    onFocus={() => setFocused(true)}
                    onKeyUp={(e) => e.key === 'Enter' ? qtyTfRef.current.blur() : null}
                    // onChange={(e) => setVal({...val, num: e.target.value})}
                    customInput={TextField} 
                    size='small' 
                    isAllowed={(values) => {
                        const {floatValue} = values
                        return (floatValue <= 999 && floatValue >= 0 || floatValue === '' || floatValue === undefined)
                    }}
                    allowNegative={false} 
                    decimalScale={0}
                />
            </Box>
            {(qtyData !== undefined && qtyData.numNonHA !== 0) && 
                <Typography sx={{fontSize: '10px', position: 'absolute', bottom: qtyData.numReserved === 0 ? `${2+separationFactor+otherNumsOffset}px` :`${7+separationFactor+otherNumsOffset}px`, ...otherNumsSx}}>Non-HA: {qtyData.numNonHA}</Typography>
            } 
            {(qtyData !== undefined && qtyData.numReserved !== 0) &&
                <Typography sx={{fontSize: '10px', position: 'absolute', bottom: qtyData.numNonHA === 0 ? `${2+separationFactor+otherNumsOffset}px` : `${-3-separationFactor+otherNumsOffset}px`, ...otherNumsSx}}>Reserved: {qtyData.numReserved}</Typography>
            }
            <Button onClick={(qtyData === undefined || qtyData.numTotal === 0) ? undefined : () => handleEditQty(false)} sx={{position: 'absolute', minWidth: '0px', width: '50%', height: '100%', left: '0px', top: '0px', padding: 0, ...theme.components.box.fullCenterCol}}>
                <RemoveIcon sx={{mt: 2, mr: 1}}/>
            </Button>
            <Button onClick={(qtyData === undefined || qtyData.numTotal <= 999) ? () => handleEditQty(true) : undefined} sx={{position: 'absolute', minWidth: '0px', width: '50%', height: '100%', left: '50%', top: '0px', padding: 0, ...theme.components.box.fullCenterCol}}>
                <AddIcon sx={{mt: 2, ml: 1}}/>
            </Button>
        </Box>
    )
}

