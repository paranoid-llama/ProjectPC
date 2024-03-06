import { TextField } from "@mui/material";
import { useState } from "react";
import { filterSearch } from "../../../app/slices/listdisplay";
import {useDebouncedCallback} from 'use-debounce'
import { useDispatch } from "react-redux";

export default function ListSearch({listState, listType, totalList}) {
    const [searchData, setSearchData] = useState('')
    const dispatch = useDispatch()

    const handleSearchChange = (e) => {
        const reFilterList = e.target.value.length < searchData.length
        setSearchData(e.target.value)

        debouncedSearch(reFilterList)
    }

    const debounceFunction = (reFilterList) => {
        dispatch(filterSearch({searchQuery: searchData, listState, listType, reFilterList, totalList}))
    }

    const debouncedSearch = useDebouncedCallback(
        debounceFunction,
        500
    )

    return (
        <TextField 
            label='Search Pokemon' 
            variant='outlined' 
            size='small' 
            InputLabelProps={{sx: {color: 'white'}}} 
            InputProps={{sx: {color: 'white'}}}
            value={searchData}
            onChange={(e) => handleSearchChange(e)}
        />
    )
}