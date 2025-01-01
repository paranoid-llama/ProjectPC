import { TextField } from "@mui/material";
import { useState } from "react";

export default function ListSearch({queryFunc, textFieldProps, textFieldStyles, customValue=undefined}) {
    const [searchData, setSearchData] = useState('')

    const handleSearch = (e) => {
        if (!customValue) {
            setSearchData(e.target.value)
        }
        const reFilterList = e.target.value.length < searchData.length
        queryFunc(e.target.value, reFilterList)
    }

    return (
        <TextField 
            {...textFieldProps}
            sx={{...textFieldStyles}}
            value={customValue ? customValue : searchData}
            onChange={(e) => handleSearch(e)}
        />
    )
}