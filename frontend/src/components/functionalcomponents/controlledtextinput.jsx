import { useState } from "react";
import {TextField} from '@mui/material'

export default function ControlledTextInput({textFieldProps, textFieldStyles, charLimit=1000, defaultValue=''}) {
    const [value, setValue] = useState(defaultValue)
    
    const handleChange = (e) => {
        const newValue = e.target.value
        const updateValue = newValue.length <= charLimit //... add more conditionals if wanted
        if (updateValue) {
            setValue(newValue)
        }
    }

    return (
        <TextField 
            {...textFieldProps}
            sx={textFieldStyles}
            value={value}
            onChange={(e) => handleChange(e)}
        />
    )
}