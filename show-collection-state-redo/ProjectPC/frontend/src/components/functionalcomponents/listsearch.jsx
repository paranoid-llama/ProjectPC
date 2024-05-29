import { TextField } from "@mui/material";
import { useState } from "react";

export default function ListSearch({queryFunc, textFieldProps, textFieldStyles}) {
    const [searchData, setSearchData] = useState('')

    const handleSearch = (e) => {
        setSearchData(e.target.value)
        const reFilterList = e.target.value.length < searchData.length
        queryFunc(e.target.value, reFilterList)
    }

    return (
        <TextField 
            {...textFieldProps}
            sx={{...textFieldStyles}}
            value={searchData}
            onChange={(e) => handleSearch(e)}
        />
    )
}