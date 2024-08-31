import {Box, Typography, styled, TextField, ToggleButtonGroup, useTheme} from '@mui/material'
import { useLoaderData, useRouteLoaderData } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { setFilters, filterSearch } from '../../../app/slices/collectionstate' 
import { deselect } from '../../../app/slices/editmode'
import { generations, genRomans, apriballs } from '../../../../common/infoconstants/miscconstants'
import { checkForTypeOfFilter } from '../../../../utils/functions/sortfilterfunctions/filterfunctions'
import MuiToggleButton from '@mui/material/ToggleButton'
import ImgData from '../tabledata/imgdata'
import ListSearch from '../../functionalcomponents/listsearch'
import {useDebouncedCallback} from 'use-debounce'
import { selectScreenBreakpoint } from '../../../app/selectors/windowsizeselectors'
import displayOnHandByPokemon from '../../../../utils/functions/display/displayonhandbypokemon'

export default function Filter({listType, collection, isOwner, isEditMode}) {
    const dispatch = useDispatch()
    const theme = useTheme()
    const collectionGen = collection.gen
    const genNum = collectionGen === 'swsh' ? 8 :
     collectionGen === 'bdsp' ? 4 : collectionGen
    const userData = useRouteLoaderData('root')
    const screenSize = useSelector((state) => selectScreenBreakpoint(state, 'filtersort'))
    const onhandViewType = useSelector(state => state.collectionState.listDisplay.onhandView)
    const nameDisplaySettings = !userData.loggedIn ? undefined : userData.user.settings.display.pokemonNames
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

    const listLiteralState = listType === 'collection' ? useSelector((state) => state.collectionState.collection) : onhandViewType === 'byPokemon' ? displayOnHandByPokemon(useSelector((state) => state.collectionState.onhand), collection.ownedPokemon) : useSelector((state) => state.collectionState.onhand)

    const currentFilters = listType === 'collection' ? useSelector((state) => state.collectionState.listDisplay.collectionFilters) : useSelector((state) => state.collectionState.listDisplay.onhandFilters)
    const listState = listType === 'collection' ? useSelector((state) => state.collectionState.listDisplay.collection) : useSelector((state) => state.collectionState.listDisplay.onhand)
    const totalList = (isEditMode) ? listType === 'collection' ? listLiteralState.filter((mon) => mon.disabled === undefined) : listLiteralState : listType === 'collection' ? collection.ownedPokemon : onhandViewType === 'byPokemon' ? displayOnHandByPokemon(collection.onHand, collection.ownedPokemon) : collection.onHand
    const ballFilters = currentFilters.filters.ballFilters
    const genFilters = currentFilters.filters.genFilters
    const miscFilters = currentFilters.filters.otherFilters
    const activeFilters = ballFilters.concat(genFilters, miscFilters)
    const currentSortKey = currentFilters.sort

    const genFilterButtonPadding = {
        '@media only screen and (max-width: 899px)': {
            paddingX: '10px'
        },
        '@media only screen and (min-width: 900px) and (max-width: 1099px)': {
            paddingX: '15px'
        },
        '@media only screen and (min-width: 1100px) and (max-width: 1300px)': {
            paddingX: '15px',
            paddingY: '6px'
        },
        '@media only screen and (min-width: 1301px)': {
            paddingX: '20px',
            paddingY: '6px'
        },
    }
    const ballFilterButtonPadding = {
        '@media only screen and (min-width: 768px) and (max-width: 900px)': {
            paddingX: '0px'
        },
        '@media only screen and (min-width: 901px) and (max-width: 975px)': {
            paddingX: '3px'
        },
        '@media only screen and (min-width: 976px) and (max-width: 1099px)': {
            paddingX: '5px'
        },
        '@media only screen and (min-width: 1100px) and (max-width: 1300px)': {
            paddingX: '3px',
            paddingY: '1px'
        },
        '@media only screen and (min-width: 1301px)': {
            paddingX: '6px',
            paddingY: '3px'
        },
    }

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
                            sx={{borderRadius: '5px', borderWidth: '2px', paddingX: '15px', paddingY: '3px', ':hover': {cursor: 'pointer', opacity: '0.5', backgroundColor: theme.palette.color3.main}, '&.Mui-selected': {':hover': {cursor: 'pointer', opacity: '0.5', backgroundColor: theme.palette.color3.main}}, ...genFilterButtonPadding}}
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
                            sx={{borderRadius: '25px', borderWidth: '1px', padding: 0, marginLeft: '1px', zIndex: 200, ':hover': {cursor: 'pointer', opacity: '0.5', backgroundColor: theme.palette.color3.main}, '&.Mui-selected': {':hover': {cursor: 'pointer', opacity: '0.5', backgroundColor: theme.palette.color3.main}}, ...ballFilterButtonPadding}}
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
        dispatch(filterSearch({searchQuery: query, listState, listType, reFilterList, totalList, currentSortKey, nameDisplaySettings}))
    }

    const debouncedSearch = useDebouncedCallback(
        debounceFunction,
        500
    )

    const genBallFilterContainerStyles = screenSize === 'lg' ? {gap: 0, height: '100%', width: '70%'} : {}
    const otherFilterContainerStyles = screenSize === 'lg' ? {gap: 1.5, height: '100%', width: '30%'} : {}
    const otherFilterButtonContStyles = screenSize === 'lg' ? {gap: 0.5, mt: 1.5} : {}
    const hwButPad = screenSize !== 'lg' ? {padding: '1px', paddingX: '4px'} : {}
    const pendButPad = screenSize !== 'lg' ? {padding: '1px', paddingX: '4px'} : {}

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', marginLeft: '10px'}}>
            <Box sx={{height: '20%', width: '100%', display: 'flex', alignItems: 'start'}}>
                <Typography color='white' variant='h6'>Filter By</Typography>
            </Box>
            <Box sx={{...theme.components.box.fullCenterCol, flexDirection: screenSize === 'lg' ? (listType === 'onhand' ? 'row-reverse' : 'row') : 'column', width: '100%', height: '80%', marginLeft: '10px', gap: 2}}>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '60%', gap: 1.5, ...genBallFilterContainerStyles, mr: screenSize === 'lg' && listType === 'onhand' ? 3 : 0}}>
                    <Box sx={{height: '50%', width: '100%', ...theme.components.box.fullCenterCol}}>
                        <Typography color='white' sx={{width: '100%', fontSize: '12px', textAlign: 'start'}}>Generation</Typography>
                        {generateGenFilters()}
                    </Box>
                    <Box sx={{height: '50%', width: '100%', ...theme.components.box.fullCenterCol}}>
                        <Typography color='white' sx={{width: '100%', fontSize: '12px', textAlign: 'start'}}>{listType === 'onhand' ? '' : 'Owned '}Ball</Typography>
                        {generateBallFilters()}
                    </Box>
                </Box>
                <Box sx={{height: '20%', width: '100%', display: 'flex', flexDirection: screenSize === 'lg' ? 'column' : 'row', ...otherFilterContainerStyles}}>
                    
                    <Box sx={{width: screenSize === 'lg' ? '80%' : '55%', height: screenSize === 'lg' ? (listType === 'onhand' ? '10%' : '60%') : '100%', display: 'flex', flexDirection: screenSize === 'lg' ? 'column' : 'row', mt: 0.75, ...otherFilterButtonContStyles}}>
                        { listType !== 'onhand' &&
                        <>
                        <Box sx={{width: screenSize === 'lg' ? '100%' : '60%', marginRight: '5px'}}>
                            <ToggleButton 
                                size='small' 
                                value='highlyWanted' 
                                selected={miscFilters.includes('highlyWanted')}
                                sx={{borderRadius: '5px', borderWidth: '1px', fontSize: '13px', ':hover': {cursor: 'pointer', opacity: '0.5', backgroundColor: theme.palette.color3.main}, '&.Mui-selected': {':hover': {cursor: 'pointer', opacity: '0.5', backgroundColor: theme.palette.color3.main}}, ...hwButPad}}
                                onClick={(e) => handleFilterChange(e, miscFilters)}
                            >
                                Highly Wanted
                            </ToggleButton>
                        </Box>
                        <Box sx={{width: screenSize === 'lg' ? '100%' : '40%', marginLeft: '5px'}}>
                            <ToggleButton 
                                size='small'
                                value='pending' 
                                selected={miscFilters.includes('pending')}
                                sx={{borderRadius: '5px', borderWidth: '1px', ':hover': {cursor: 'pointer', opacity: '0.5', backgroundColor: theme.palette.color3.main}, '&.Mui-selected': {':hover': {cursor: 'pointer', opacity: '0.5', backgroundColor: theme.palette.color3.main}}, ...pendButPad}}
                                onClick={(e) => handleFilterChange(e, miscFilters)}
                            >
                                Pending
                            </ToggleButton>
                        </Box>
                        </>
                        }
                    </Box>
                    <Box sx={{width: screenSize === 'lg' ? (listType === 'onhand' ? '90%' : '80%') : '40%', height: screenSize === 'lg' ? '40%' : '100%', display: 'flex', alignItems: 'center', mt: screenSize === 'lg' ? 0 : 0.5}}>
                        <ListSearch 
                            queryFunc={handleSearchChange} 
                            textFieldProps={{
                                label: 'Search Pokemon',
                                variant: 'outlined',
                                size: 'small', 
                                // sx: {
                                
                                // },
                                InputLabelProps: {sx: {color: 'white', fontSize: screenSize === 'lg' ? '14px' : '12px'}},
                                InputProps: {sx: {color: 'white',  '& .MuiInputBase-input': {paddingY: screenSize === 'lg' ? 1 : 0.5}}}
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}