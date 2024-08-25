import { useState } from "react";
import {TextField} from '@mui/material'

const expandedChars = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/

export default function ControlledTextInput({textFieldProps, textFieldStyles, charLimit=1000, defaultValue='', controlInputFunc=null, useRegex=false, useExpandedRegex=false, customRegex=undefined}) {
    //if controlInputFunc is true, we need to do something with the text field contents as it goes and not just take the final value. 
    //in that case, the entire approach of this text input changes. if its false, we control the input here and extract the value via a reference
    //so theres less computing on re-rendering its whole parent component, while also auto-focusing the component on re-render. 
    if (controlInputFunc === null) {
        const [value, setValue] = useState(defaultValue)
    
        const handleChange = (e) => {
            const newValue = e.target.value
            const updateValue = newValue.length <= charLimit //... add more conditionals if wanted
            if (updateValue) {
                const useCustomRegex = customRegex !== undefined
                const fitsInRegex = useCustomRegex ? (customRegex.test(newValue) || newValue === '') : 
                    useExpandedRegex ? (expandedChars.test(newValue) || newValue === '') :
                    useRegex ? (/[a-z0-9]/i.test(newValue) || newValue === '') : true
                if (fitsInRegex) {
                    setValue(newValue)
                }
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
    } else {
        const handleChange = (e) => {
            const newValue = e.target.value
            const updateValue = newValue.length <= charLimit //... add more conditionals if wanted
            if (updateValue) {
                const useCustomRegex = customRegex !== undefined
                const fitsInRegex = useCustomRegex ? (customRegex.test(newValue) || newValue === '') : 
                    useExpandedRegex ? (expandedChars.test(newValue) || newValue === '') :
                    useRegex ? (/[a-z0-9]/i.test(newValue) || newValue === '') : true
                if (fitsInRegex) {
                    controlInputFunc(newValue)
                }
            }
        }

        return (
            <TextField 
                {...textFieldProps}
                sx={textFieldStyles}
                value={defaultValue}
                onChange={(e) => handleChange(e)}
            />
        ) 
    }
}