import { useTheme, Box, Typography, ToggleButton, ToggleButtonGroup, Button } from "@mui/material"; 
import { useState, useRef, useEffect, useTransition, useContext } from "react";
import { ErrorContext } from "../app/contexts/errorcontext";
import SearchIcon from '@mui/icons-material/Search';
import BodyWithBanner from "../components/partials/routepartials/bodywithbanner";
import SearchAreaRoute from "../components/functionalcomponents/search/searcharearoute";
import ControlledTextInput from "../components/functionalcomponents/controlledtextinput";
import { searchDB } from "../../utils/functions/backendrequests/search";
import { useDebouncedCallback } from "use-debounce";

export default function Search({}) {
    const {handleError} = useContext(ErrorContext)
    const [searchData, setSearchData] = useState({type: 'all', query: '', queryFunction: '', page: 1, result: {collections: [], users: [], collectionCount: 0, userCount: 0}, searching: false})
    //query controls what is shown in the input while query function controls the query that operators take. since the function operators are debounced,
    //we want the child components to update when the debounce update, necessitating a new variable which only updates when the debounce occurs
    const [isPending, startTransition] = useTransition()
    // const searchTypeRef = useRef(searchData.type)

    const changeSearchType = (newVal) => {
        if (newVal === null) { //when clicking a selected button the value becomes null, it doesnt send the regular value of the button.
            return
        } 
        debounceSearchFunction(searchData.query, 1, true, newVal)
    }
    const theme = useTheme()
    const groupTheme = theme.components.toggleButton.dark.group
    const buttonTheme = theme.components.toggleButton.dark.buttons

    const changeQuery = (newVal) => {
        setSearchData({...searchData, query: newVal})
        searchDatabaseState(newVal)
    }

    const searchDatabaseState = (query) => {
        debouncedSearch(query)
    }

    const debounceSearchFunction = async(query, pageNum=1, changeSearchType=false, newSearchType) => {
        setSearchData({...searchData, searching: true})
        const backendFunc = async() => {return await searchDB(changeSearchType ? newSearchType : searchData.type, query, pageNum)}
        const successFunc = (searchResult) => {
            if (changeSearchType) { 
                setSearchData({...searchData, queryFunction: query, result: searchResult, page: 1, type: newSearchType, error: false, searching: false})
                return
            }
            setSearchData({...searchData, queryFunction: query, result: searchResult, page: pageNum, error: false, searching: false})
        }
        const errorFunc = (errorData) => {
            setSearchData({...searchData, error: true, errorData, searching: false})
        }
        handleError(backendFunc, false, successFunc, errorFunc)
        // if (changeSearchType) {
        //     const newSearchResult = await searchDB(newSearchType, query, pageNum)
        //     setSearchData({...searchData, queryFunction: query, result: newSearchResult, page: 1, type: newSearchType})
        //     return
        // }
        // const searchResult = await searchDB(searchData.type, query, pageNum)
        // setSearchData({...searchData, queryFunction: query, result: searchResult, page: pageNum})
    }

    const debouncedSearch = useDebouncedCallback(
        debounceSearchFunction,
        750
    )

    // useEffect(() => {
    //     // console.log(`REF: ${searchTypeRef.current} NOW: ${searchData.type}`)
    //     if (searchTypeRef.current !== searchData.type) {
    //         debounceSearchFunction(searchData.query, 1)
    //         searchTypeRef.current = searchData.type
    //     }
    // }, [searchData.type])

    useEffect(() => {
        debounceSearchFunction('')
    }, [])

    const changePage = (newPage) => {
        setSearchData({...searchData, page: newPage})
        startTransition(() => {
            debounceSearchFunction(searchData.query, newPage)
        })
    }
    // const seedDB = () => {
    //     fetch(`http://localhost:3000/collections/new/seeddb`, {
    //         method: 'POST',
    //         credentials: 'same-origin',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     })
    // }

    // console.log(searchData)

    return (
        <BodyWithBanner bodySx={{height: '100%', mt: 2, mb: 0, ...theme.components.box.fullCenterCol, justifyContent: 'start', position: 'relative'}} bannerSx={{backgroundColor: theme.palette.color1.light, color: theme.palette.color1.contrastTextLight}} text='Search'>
            {/* <Button onClick={seedDB} sx={{position: 'absolute', right: '10px'}} size='large'>Seed Database</Button> */}
            <ToggleButtonGroup exclusive sx={{mt: 0.5, mb: 0.5, width: '50%', ...groupTheme}} size='small' value={searchData.type} onChange={(e, newVal) => changeSearchType(newVal)}>
                <ToggleButton value='all' sx={{width: '30%', fontSize: '12px', padding: 0, ...buttonTheme}}>All</ToggleButton>
                <ToggleButton value='users' sx={{width: '35%', fontSize: '12px', ...buttonTheme}}>Users</ToggleButton>
                <ToggleButton value='collections' sx={{width: '35%', fontSize: '12px', ...buttonTheme}}>Collections</ToggleButton>
                
            </ToggleButtonGroup>
            <ControlledTextInput 
                textFieldProps={
                    {
                        autoFocus: true,
                        size: 'small',
                        InputProps: {
                            endAdornment: <SearchIcon />
                        }
                    }
                }
                textFieldStyles={
                    {width: '60%', mt: 2}
                }
                defaultValue={searchData.query}
                controlInputFunc={changeQuery}
                useRegex={true}
            />
            {searchData.error ? 
            <Box sx={{width: '80%', minHeight: '600px', mt: 2, ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
                <Typography sx={{fontSize: '24px', color: 'rgb(200, 50, 50)', fontWeight: 700, mb: 2, mt: 10}}>
                    Error {searchData.errorData.status}: {searchData.errorData.name}
                </Typography>
                <Typography sx={{fontSize: '16px', color: 'rgb(200, 50, 50)', fontWeight: 700}}>
                    {searchData.errorData.message}
                </Typography>
                <Typography sx={{fontSize: '16px', color: 'rgb(200, 50, 50)', fontWeight: 700}}>
                    Try again later!
                </Typography>
            </Box> :
            <SearchAreaRoute 
                query={searchData.queryFunction} 
                result={searchData.result} 
                searchType={searchData.type} 
                page={searchData.page} 
                changePage={changePage} 
                changeSearchType={changeSearchType} 
                changingPage={isPending}
                searching={searchData.searching}
            />}
        </BodyWithBanner>
    )
}