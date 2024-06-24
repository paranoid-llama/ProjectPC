import {Box, Button, TextField} from '@mui/material'
import { useRef, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function NumericTextField({handleChange, onClickArrowUp, onClickArrowDown, value, width, textFieldStyles, isAllowedFunc, upperLimit}) {
    const inputRef = useRef()

    const handleChangeFunc = (newQty) => {
        const num = parseInt(newQty)
        const isNum = !isNaN(num)
        handleChange(newQty)
        //i had more logic here i wanted to do based on the variables but i decided against it cuz it was making me lose my mind to make work. will improve later.
    }
    return (
        <>
        <NumericFormat
            sx={{position: 'relative', '& .MuiInputBase-root': {width: '100%', color: 'white'}, '&.MuiTextField-root': {width, ...textFieldStyles}}}
            InputProps={{
                endAdornment: <Box sx={{height: '90%', width: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative'}}>
                    <Box sx={{height: '50%', width: '100%', position: 'absolute', top: '-25px', right: '25px'}}>
                        <Button sx={{padding: 0}} onClick={onClickArrowUp}>
                            <KeyboardArrowUpIcon/>
                        </Button>
                    </Box>
                    <Box sx={{height: '50%', width: '100%', position: 'absolute', top: '0px', right: '25px'}}>
                        <Button sx={{padding: 0, '&.MuiButton-root': {width: '20px', height: '20px'}, height: '100%'}} onClick={onClickArrowDown}>
                            <KeyboardArrowDownIcon/>
                        </Button>
                    </Box>
                </Box>,
                inputRef
            }}
            value={value}
            onChange={(e) => handleChangeFunc(e.target.value)}
            // onBlur={(e) => {handleChangeFunc(e.target.value)}}
            customInput={TextField} 
            size='small' 
            isAllowed={isAllowedFunc}
            allowNegative={false} 
            decimalScale={0}
        />
        
        </>
    )
}