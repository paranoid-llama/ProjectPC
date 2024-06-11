import {Box, Typography, styled, TextField, ToggleButtonGroup} from '@mui/material'
import { useLoaderData } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { setFilters, filterSearch } from '../../../app/slices/listdisplay' 
import { deselect } from '../../../app/slices/editmode'
import { generations, genRomans, apriballs } from '../../../../../common/infoconstants/miscconstants'
import { checkForTypeOfFilter } from '../../../../utils/functions/sortfilterfunctions/filterfunctions'
import MuiToggleButton from '@mui/material/ToggleButton'
import ImgData from '../tabledata/imgdata'
import ListSearch from '../../functionalcomponents/listsearch'
import {useDebouncedCallback} from 'use-debounce'

export default function Filter({listType, collection, isEditMode}) {
    const dispatch = useDispatch()
    const collectionGen = useLoaderData().gen
    const genNum = collectionGen === 'swsh' ? 8 :
     collectionGen === 'bdsp' ? 4 : collectionGen
    const gens = collection.gen === 'home' ? genRomans : genRomans.slice(0, genNum)

    const ToggleButton = styled(MuiToggleButton)({
        '&.MuiToggleButton-sizeSmall': {
            color: 'white',
            borderColor: 'grey'
        },
        '&.Mui-selected': {
            backgroundColor: '#b59d0e'
        }
    })

    const listLiteralState = listType === 'collection' ? useSelector((state) => state.collection) : useSelector((state) => state.onhand)

    const currentFilters = listType === 'collection' ? useSelector((state) => state.listDisplay.collectionFilters) : useSelector((state) => state.listDisplay.onhandFilters)
    const listState = listType === 'collection' ? useSelector((state) => state.listDisplay.collection) : useSelector((state) => state.listDisplay.onhand)
    const totalList = isEditMode ? listType === 'collection' ? listLiteralState.filter((mon) => mon.disabled === undefined) : listLiteralState : listType === 'collection' ? collection.ownedPokemon : collection.onHand
    const ballFilters = currentFilters.filters.ballFilters
    const genFilters = currentFilters.filters.genFilters
    const miscFilters = currentFilters.filters.otherFilters
    const activeFilters = ballFilters.concat(genFilters, miscFilters)
    const currentSortKey = currentFilters.sort

    const generateGenFilters = () => {
        return (
            <ToggleButtonGroup>
                {gens.map((gen, idx) => {
                    const genNum = idx + 1
                    return (
                        <ToggleButton 
                            key={`gen-${genNum}-filter`} 
                            size='small' 
                            value={genNum}
                            selected={genFilters.includes(genNum)}
                            sx={{borderRadius: '5px', borderWidth: '2px', paddingX: '10px', paddingY: '3px'}}
                            onClick={(e) => handleFilterChange(e, genFilters)}
                        >
                            {gen}
                        </ToggleButton>
                    )
                })}
            </ToggleButtonGroup>
        )
    }

    const generateBallFilters = () => {
        return (
            <ToggleButtonGroup>
                {apriballs.map(ball => {
                    return (
                        <ToggleButton 
                            key={`${ball}-ball-filter`} 
                            size='small' 
                            value={ball}
                            selected={ballFilters.includes(ball)}
                            sx={{borderRadius: '25px', borderWidth: '1px', padding: 0, marginLeft: '1px', zIndex: 200}}
                            onClick={(e) => handleFilterChange(e, ballFilters)}
                        >
                            <ImgData type='ball' linkKey={ball} customValue={ball}/>
                        </ToggleButton>
                    )
                })}
            </ToggleButtonGroup>
        )
    }

    const handleFilterChange = (e, specificCategoryFilters) => {
        const filterKey = e.target.value !== undefined ? 
        !isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : e.target.value : 
        e.target.src.slice(56, e.target.src.length -4)
        dispatch(deselect())

        const isTag = filterKey === 'highlyWanted' || filterKey === 'pending'
        const otherTag = isTag && (filterKey === 'highlyWanted') ? 'pending' : 'highlyWanted'
        //gen filters = incremental (adding more increases scope of list, removing decreases scope of list)
        //ball filters = decremental (adding more decreases scope of list - have to fit more criteria, removing increases scope of list) (onhand is reverse since it filters for any pokemon who has any filtered ball, not every ball)
        //can make list filtering a bit more efficient by settubg uo refiltering cases for onhand list (specifically ball ones)

        const removingBallFilter = activeFilters.length > 1 && activeFilters.includes(filterKey) && checkForTypeOfFilter(activeFilters, 'ball') && apriballs.includes(filterKey)
        const addingGenFilter = activeFilters.length !== 0 && !activeFilters.includes(filterKey) && checkForTypeOfFilter(activeFilters, 'gen') && generations.includes(filterKey)
        const noGenFilterButOtherFilters = (ballFilters.length !== 0 || miscFilters.length !== 0) && genFilters.length === 1 && filterKey === genFilters[0]
        const addingBallFiltersOnHand = listType === 'onhand' && checkForTypeOfFilter(activeFilters, 'ball') && !activeFilters.includes(filterKey)
        const changingBetweenTagAndBallFilters = (isTag && checkForTypeOfFilter(activeFilters, 'ball')) || (apriballs.includes(filterKey) && checkForTypeOfFilter(activeFilters, 'misc'))
        const switchingTags = (isTag && activeFilters.includes(otherTag))
        const reFilterList = removingBallFilter || //cases in which we need to refilter the list from the total list
                                addingGenFilter || 
                                noGenFilterButOtherFilters || 
                                addingBallFiltersOnHand || 
                                changingBetweenTagAndBallFilters || 
                                switchingTags 
        
        const noFilters = activeFilters.length === 1 && activeFilters.includes(filterKey)

        dispatch(setFilters({filterKey, listType, listState, totalList, reFilterList, noFilters, prevActiveFilters: activeFilters, specificCategoryFilters, currentSortKey, changingTagBallFilters: changingBetweenTagAndBallFilters, switchingTags}))
    }

    const handleSearchChange = (query, reFilterList) => {
        debouncedSearch(query, reFilterList)
    }   

    const debounceFunction = (query, reFilterList) => {
        dispatch(filterSearch({searchQuery: query, listState, listType, reFilterList, totalList, currentSortKey}))
    }

    const debouncedSearch = useDebouncedCallback(
        debounceFunction,
        500
    )

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', marginLeft: '10px'}}>
            <Box sx={{height: '20%', width: '100%', display: 'flex', alignItems: 'start'}}>
                <Typography color='white' variant='h6'>Filter By</Typography>
            </Box>
            <Box sx={{height: '10%'}}>
                <Typography color='white' sx={{width: '20%', fontSize: '12px'}}>Generation</Typography>
            </Box>
            <Box sx={{height: '20%', width: '100%'}}>
                {generateGenFilters()}
            </Box>
            <Box sx={{height: '10%'}}>
                <Typography color='white' sx={{width: '100%', fontSize: '12px'}}>Owned Ball</Typography>
            </Box>
            <Box sx={{height: '20%', width: '100%'}}>
                {generateBallFilters()}
            </Box>
            <Box sx={{height: '20%', width: '100%', display: 'flex', flexDirection: 'row'}}>
                { listType !== 'onhand' &&
                <Box sx={{width: '45%', display: 'flex', flexDirection: 'row'}}>
                    <Box sx={{width: '50%', marginRight: '5px'}}>
                        <ToggleButton 
                            size='small' 
                            value='highlyWanted' 
                            selected={miscFilters.includes('highlyWanted')}
                            sx={{borderRadius: '5px', borderWidth: '1px', padding: '1px', fontSize: '10px'}}
                            onClick={(e) => handleFilterChange(e, miscFilters)}
                        >
                            Highly Wanted
                        </ToggleButton>
                    </Box>
                    <Box sx={{width: '50%', marginLeft: '5px'}}>
                        <ToggleButton 
                            size='small'
                            value='pending' 
                            selected={miscFilters.includes('pending')}
                            sx={{borderRadius: '5px', borderWidth: '1px', padding: '5px'}}
                            onClick={(e) => handleFilterChange(e, miscFilters)}
                        >
                            Pending
                        </ToggleButton>
                    </Box>
                </Box>}
                <Box sx={{width: '50%'}}>
                    <ListSearch 
                        queryFunc={handleSearchChange} 
                        textFieldProps={{
                            label: 'Search Pokemon',
                            variant: 'outlined',
                            size: 'small', 
                            InputLabelProps: {sx: {color: 'white'}},
                            InputProps: {sx: {color: 'white'}}}}
                    />
                </Box>
            </Box>
        </Box>
    )
}