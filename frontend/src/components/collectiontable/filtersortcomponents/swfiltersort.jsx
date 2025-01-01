import {Box, Typography, useTheme, Button, ToggleButton} from '@mui/material'
import SmallWidthModalWrapper from '../../partials/wrappers/smallwidthmodalwrapper'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { genRomans, generations, apriballs, homeDisplayGames, getGameColor } from '../../../../common/infoconstants/miscconstants.mjs'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import { deselect } from '../../../app/slices/editmode'
import { setFilters, setSortKey, filterSearch, toggleFullSetView, resetFilters } from '../../../app/slices/collectionstate'
import displayOnHandByPokemon from '../../../../utils/functions/display/displayonhandbypokemon'
import { checkForTypeOfFilter } from '../../../../utils/functions/sortfilterfunctions/filterfunctions'
import { useDebouncedCallback } from 'use-debounce'
import hexToRgba from 'hex-to-rgba'
import ImgData from '../tabledata/imgdata'
import { useRouteLoaderData } from 'react-router'
import ListSearch from '../../functionalcomponents/listsearch'

export default function SWFilterSort({collection, isOwner, isEditMode, demo}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const user = useRouteLoaderData('root')
    const nameDisplaySettings = !user.loggedIn ? undefined : user.user.settings.display.pokemonNames
    const [openStates, setOpenStates] = useState({modal: false, cat: '', subCat: '', query: ''})
    const toggleModal = () => setOpenStates({...openStates, modal: !openStates.modal})
    const gen = collection.gen
    
    const toggleSubCat = (subCat) => setOpenStates({...openStates, subCat: subCat === openStates.subCat ? '' : subCat})
    
    const list = useSelector((state) => state.editmode.listType).toLowerCase()
    const onhandViewType = useSelector(state => state.collectionState.listDisplay.onhandView)
    const showFullSets = useSelector((state) => state.collectionState.listDisplay.showFullSets)
    const ballScope = (isEditMode || demo) ? useSelector((state) => state.collectionState.options.collectingBalls) : collection.options.collectingBalls

    const catRef = useRef(openStates.cat)
    const queryRef = useRef(openStates.query)
    const sortCats = [{display: 'National Dex Number', value: 'natDexNum'}, {display: 'Name', value: 'name'}]
    const tagFilter = list === 'collection' ? [{display: 'Tag', value: 'tag'}] : []
    const gameFilter = gen === 'home' ? [{display: 'Game', value: 'game'}] : []
    const filterCats = [{display: 'Generation', value: 'gen'}, {display: list === 'collection' ? 'Owned Ball' : 'Ball', value: 'ball'}, ...gameFilter, ...tagFilter]

    const dexNumSorts = [{display: 'Lowest to Highest', value: 'NatDexNumL2H'}, {display: 'Highest to Lowest', value: 'NatDexNumH2L'}]
    const nameSorts = [{display: 'A to Z', value: 'A2Z'}, {display: 'Z to A', value: 'Z2A'}]
    
    const genFilters = generations.map((g, i) => {return {display: genRomans[i], value: g}}).filter(g => {
        if (gen === 'home') {return true}
        const genNum = isNaN(parseInt(gen)) ? ((gen === 'swsh' || gen === 'bdsp') && 8) : parseInt(gen)
        return g.value <= genNum
    })
    const ballFilters = apriballs.filter(b => ballScope.includes(b)).map(b => {return {display: capitalizeFirstLetter(b), value: b}})
    const tagFilters = list === 'collection' && [{display: 'Highly Wanted', value: 'highlyWanted'}, {display: 'Pending', value: 'pending'}]
    const gameFilters = gen === 'home' && homeDisplayGames.map(game => {return {display: game === 9 ? 'S/V' : game === 'swsh' ? 'SW/SH' : game === 'bdsp' && 'BD/SP', value: game}})

    // this below section is copied bar for bar from filter.jsx

    const collectionLiteral = useSelector((state) => state.collectionState.collection)
    const onhandLiteral = useSelector((state) => state.collectionState.onhand)
    const listLiteralStateStep1 = list === 'collection' ? collectionLiteral : onhandLiteral
    const listLiteralState = list !== 'collection' && onhandViewType === 'byPokemon' ? displayOnHandByPokemon(listLiteralStateStep1, (isEditMode || demo) ? collectionLiteral : collection.ownedPokemon) : listLiteralStateStep1

    const currentFilters = list === 'collection' ? useSelector((state) => state.collectionState.listDisplay.collectionFilters) : useSelector((state) => state.collectionState.listDisplay.onhandFilters)
    const listState = list === 'collection' ? useSelector((state) => state.collectionState.listDisplay.collection) : useSelector((state) => state.collectionState.listDisplay.onhand)
    const totalList = (isEditMode || demo) ? list === 'collection' ? listLiteralState.filter((mon) => mon.disabled === undefined) : listLiteralState : list === 'collection' ? collection.ownedPokemon.filter(p => p.disabled === undefined) : onhandViewType === 'byPokemon' ? displayOnHandByPokemon(collection.onHand, collection.ownedPokemon) : collection.onHand
    const availableGamesInfo = useSelector((state) => state.collectionState.availableGamesInfo)
    const ballFiltersState = currentFilters.filters.ballFilters
    const genFiltersState = currentFilters.filters.genFilters
    const miscFiltersState = currentFilters.filters.otherFilters
    const currentGameFilters = miscFiltersState.filter(f => homeDisplayGames.includes(f) || f === 'no-game')
    const activeFilters = ballFiltersState.concat(genFiltersState, miscFiltersState)
    const currentSortKey = currentFilters.sort

    // ------

    const generateButtonStyles = (type) => {
        const even = type === 'even'
        return {
            color: theme.palette.color2.contrastText,
            backgroundColor: even ? theme.palette.color2.darker : theme.palette.color2.main,
            ':hover': {
                backgroundColor: hexToRgba(even ? theme.palette.color2.darker : theme.palette.color2.main, 0.8) 
            },
            '&.Mui-selected': {
                backgroundColor: hexToRgba(theme.palette.color3.darker),
                color: theme.palette.color3.contrastText
            },
            '&.Mui-selected:hover': {
                backgroundColor: hexToRgba(theme.palette.color3.darker, 0.8),
                color: theme.palette.color3.contrastText
            }
        }
    }

    const toggleCat = (cat) => {
        setOpenStates({...openStates, cat: cat === openStates.cat ? '' : cat, subCat: ''})
    }

    const handleFilterChange = (filterKey, specificCategoryFilters, isGameFilter) => {
        // console.log(e.target.value)

        // const filterKey = e.target.value !== undefined ? 
        // !isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : e.target.value : 
        // e.target.src.slice(56, e.target.src.length -4)

        dispatch(deselect())

        const isTag = filterKey === 'highlyWanted' || filterKey === 'pending'
        const otherTag = isTag && (filterKey === 'highlyWanted') ? 'pending' : 'highlyWanted'
        //gen filters = incremental (adding more increases scope of list, removing decreases scope of list)
        //ball filters = decremental (adding more decreases scope of list - have to fit more criteria, removing increases scope of list) (onhand is reverse since it filters for any pokemon who has any filtered ball, not every ball)
        //can make list filtering a bit more efficient by settubg uo refiltering cases for onhand list (specifically ball ones)

        const removingBallFilter = activeFilters.length > 1 && activeFilters.includes(filterKey) && checkForTypeOfFilter(activeFilters, 'ball') && apriballs.includes(filterKey)
        const addingGenFilter = activeFilters.length !== 0 && !activeFilters.includes(filterKey) && checkForTypeOfFilter(activeFilters, 'gen') && generations.includes(filterKey)
        const noGenFilterButOtherFilters = (ballFiltersState.length !== 0 || miscFiltersState.length !== 0) && genFiltersState.length === 1 && filterKey === genFiltersState[0]
        const addingBallFiltersOnHand = list === 'onhand' && checkForTypeOfFilter(activeFilters, 'ball') && !activeFilters.includes(filterKey)
        const changingBetweenTagAndBallFilters = (isTag && checkForTypeOfFilter(activeFilters, 'ball')) || (apriballs.includes(filterKey) && checkForTypeOfFilter(activeFilters, 'misc'))
        const switchingTags = (isTag && activeFilters.includes(otherTag))
        const removingTags = (isTag && activeFilters.includes(filterKey) && !switchingTags)
        const switchingBetweenNoGameAndGame = (isGameFilter) && ((filterKey === 'no-game' && currentGameFilters.length !== 0) || (filterKey !== 'no-game' && currentGameFilters.length !== 0))
        const numberButIsGameFilter = isGameFilter && typeof filterKey === 'number'
        const removingGameFilter = homeDisplayGames.includes(filterKey) && miscFiltersState.includes(filterKey)
        const reFilterList = removingBallFilter || //cases in which we need to refilter the list from the total list
                                addingGenFilter || 
                                noGenFilterButOtherFilters || 
                                addingBallFiltersOnHand || 
                                changingBetweenTagAndBallFilters || 
                                switchingTags || removingTags || removingGameFilter || switchingBetweenNoGameAndGame ||
                                list === 'onhand' && apriballs.includes(filterKey) //always need to do refilter when its onhand
        
        const noFilters = (activeFilters.length === 1 && activeFilters.includes(filterKey) && (numberButIsGameFilter ? currentGameFilters.includes(filterKey) : true))

        dispatch(setFilters({filterKey, listType: list, listState, totalList, reFilterList, noFilters, prevActiveFilters: activeFilters, specificCategoryFilters, currentSortKey, changingTagBallFilters: changingBetweenTagAndBallFilters, switchingTags, numberButIsGameFilter, switchingBetweenNoGameAndGame, availableGamesInfo}))
    }

    const handleSortChange = (val) => {
        dispatch(setSortKey({sortKey: val, listType: list, listState: listState}))
    }

    const generateStyles = () => {
        return `
            @keyframes grow-sw-sort-subcats {
                from {
                    height: 0px;
                }
                to {
                    height: 120px;
                }
            }
            @keyframes shrink-sw-sort-subcats {
                from {
                    height: 120px;
                }
                to {
                    height: 0px;
                }
            }
            @keyframes grow-sw-filter-subcats {
                from {
                    height: 0px;
                }
                to {
                    height: ${(gen === 'home' && list === 'collection') ? '240' : (gen === 'home' || list === 'collection') ? '180' : '120'}px;
                }
            }
            @keyframes shrink-sw-filter-subcats {
                from {
                    height: ${(gen === 'home' && list === 'collection') ? '240' : (gen === 'home' || list === 'collection') ? '180' : '120'}px;
                }
                to {
                    height: 0px;
                }
            }
            .add-sw-sort-subcats-height {
                animation: 0.5s ease-out 0s 1 grow-sw-sort-subcats;
                animation-fill-mode: forwards;
            }
            .shrink-sw-sort-subcats-height {
                animation: 0.5s ease-out 0s 1 shrink-sw-sort-subcats;
                animation-fill-mode: forwards;
            }
            .add-sw-filter-subcats-height {
                animation: 0.5s ease-out 0s 1 grow-sw-filter-subcats;
                animation-fill-mode: forwards;
            }
            .shrink-sw-filter-subcats-height {
                animation: 0.5s ease-out 0s 1 shrink-sw-filter-subcats;
                animation-fill-mode: forwards;
            }
        `
    }
    const firstRender = openStates.cat === '' && catRef.current === ''
    const resettingCat = openStates.cat === ''
    const sortSubCatClass = ((openStates.cat === 'filter') || firstRender) ? '' : openStates.cat === 'sort' ? 'add-sw-sort-subcats-height' : (resettingCat && catRef.current === 'sort') && 'shrink-sw-sort-subcats-height'
    const filterSubCatClass = (openStates.cat === 'sort' || firstRender) ? '' : openStates.cat === 'filter' ? 'add-sw-filter-subcats-height' : (resettingCat && catRef.current === 'filter') && 'shrink-sw-filter-subcats-height'

    const handleSearchChange = (query, reFilterList) => {
        debouncedSearch(query, reFilterList)
    }   

    const debounceFunction = (query, reFilterList) => {
        dispatch(filterSearch({searchQuery: query, listState, listType: list, reFilterList, totalList, currentSortKey, nameDisplaySettings}))
    }

    const debouncedSearch = useDebouncedCallback(
        debounceFunction,
        500
    )

    useEffect(() => {
        catRef.current = openStates.cat
    }, [openStates.cat])

    useEffect(() => {
        handleSearchChange(openStates.query, true)
    }, [openStates.query])

    // useEffect(() => {
    //     if (!openStates.modal) {
    //         setTimeout(() => {
    //             setOpenStates({...openStates, cat: '', subCat: ''})
    //         }, 500)
    //     }
    // }, [openStates.modal])

    return (
        <>
        <style>{generateStyles()}</style>
        <Box sx={{width: '100%', height: '50px', ...theme.components.box.fullCenterRow, justifyContent: 'end', mb: 0.25}}>
            <Box sx={{width: '150px', height: '100%', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', backgroundColor: theme.palette.color2.main}}>
                <Button onClick={toggleModal} sx={{width: '100%', height: '100%', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', color: theme.palette.color2.contrastText, fontSize: '16px'}}>Filter/Sort</Button>
            </Box>
        </Box>
        <SmallWidthModalWrapper
            ariaLabel={'filter/sort modal'}
            ariaDescribe={'apply filtering and/or sorting keys to a list'}
            open={openStates.modal}
            handleClose={toggleModal}
            hideCloseButton={true}
            sx={{width: '160px', backgroundColor: theme.palette.color2.dark, justifyContent: 'start', position: 'relative', color: theme.palette.color2.contrastText}}
            modalSx={{alignItems: 'end'}}
        >
            <Box sx={{height: '30px', ...theme.components.box.fullCenterCol, mb: 1}}>
                <Typography sx={{fontWeight: 700}}>{list === 'collection' ? 'Collection List' : 'On-Hand List'}</Typography>
            </Box>
            <Box sx={{height: '100px', width: '100%', ...theme.components.box.fullCenterCol}}>
                <ToggleButton 
                    value={'sort-button'}
                    selected={openStates.cat === 'sort'} 
                    onClick={() => toggleCat('sort')}
                    sx={{width: '100%', height: '100%', fontWeight: 700, fontSize: '24px', border: 'none', borderRadius: '0px', ...generateButtonStyles('odd'), position: 'relative'}}
                >
                    Sort
                    {currentSortKey !== '' && 
                    <Typography sx={{position: 'absolute', fontSize: '11px', bottom: '5%'}}>
                        Sorted by {currentSortKey.includes('NatDexNum') ? `Dex Number` : `Name - ${currentSortKey.includes('A2Z') ? 'A to Z' : 'Z to A'}`}
                    </Typography>
                    }
                </ToggleButton>
            </Box>
            <Box sx={{height: '0px', width: '100%', ...theme.components.box.fullCenterCol, overflowY: openStates.cat === 'sort' ? 'visible' : 'hidden'}} className={sortSubCatClass}>
                {sortCats.map((sC, idx) => {
                    const eOStyle = idx % 2 === 0 ? generateButtonStyles('even') : generateButtonStyles('odd')
                    const borderTop = idx === 0 ? {borderTop: '1px solid black'} : {}
                    const sortingArr = sC.value === 'natDexNum' ? dexNumSorts : nameSorts

                    return (
                        <Box key={`${sC.value}-sorting-category`} sx={{width: '100%', height: `${100/sortCats.length}%`, ...theme.components.box.fullCenterCol, ...borderTop, position: 'relative'}}>
                            <ToggleButton 
                                value={sC.value}
                                selected={openStates.subCat === sC.value} 
                                onClick={() => toggleSubCat(sC.value)}
                                sx={{width: '100%', height: '100%', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '0px', ...eOStyle}}
                            >
                                {sC.display}
                            </ToggleButton>
                            {openStates.subCat === sC.value && 
                            <Box sx={{position: 'absolute', right: '100%', width: '160px'}}>
                                {sortingArr.map((s, i) => {
                                    const eOStyle2 = i % 2 === 0 ? generateButtonStyles('even') : generateButtonStyles('odd')

                                    return (
                                        <Box key={`${s.value}-sorting-option`} sx={{height: '60px', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.dark}}>
                                            <ToggleButton 
                                                value={s.value}
                                                selected={currentSortKey === s.value} 
                                                onClick={() => handleSortChange(s.value, list, listState)}
                                                sx={{width: '100%', height: '100%', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '0px', ...eOStyle2}}
                                            >
                                                {s.display}
                                            </ToggleButton>
                                        </Box>
                                    )
                                })}
                            </Box>
                            }
                        </Box>
                    )
                })}
            </Box>
            <Box sx={{height: '100px', width: '100%', ...theme.components.box.fullCenterCol}}>
                <ToggleButton 
                    value={'filter-button'}
                    selected={openStates.cat === 'filter'}
                    onClick={() => toggleCat('filter')}
                    sx={{width: '100%', height: '100%', fontWeight: 700, fontSize: '24px', border: 'none', borderRadius: '0px', ...generateButtonStyles('even'), position: 'relative'}}
                >
                    Filter
                    {activeFilters.length !== 0 &&
                    <Typography sx={{position: 'absolute', fontSize: '11px', bottom: '5%'}}>
                        {activeFilters.length} filter{activeFilters.length >= 2 ? 's' : ''} applied
                    </Typography>
                    }
                </ToggleButton>
            </Box>
            <Box sx={{height: '0px', width: '100%', ...theme.components.box.fullCenterCol, overflow: openStates.cat === 'filter' ? 'visible' : 'hidden'}} className={filterSubCatClass}>
                {filterCats.map((fC, idx) => {
                    const eOStyle = (idx+1) % 2 === 0 ? generateButtonStyles('even') : generateButtonStyles('odd')
                    const borderTop = idx === 0 ? {borderTop: '1px solid black'} : {}
                    const filteringArr = fC.value === 'gen' ? genFilters : fC.value === 'ball' ? ballFilters : fC.value === 'tag' ? tagFilters : gameFilters
                    const catFiltersArr = fC.value === 'gen' ? genFiltersState : fC.value === 'ball' ? ballFiltersState : miscFiltersState
                    const filterCountArr = fC.value === 'game' ? catFiltersArr.filter(c => gameFilters.filter(gF => gF.value === c)[0] !== undefined || c === 'no-game') : 
                        fC.value === 'tag' ? catFiltersArr.filter(c => gameFilters.filter(gF => gF.value === c)[0] === undefined && c !== 'no-game') : catFiltersArr
                    const isGameFilt = fC.value === 'game'

                    return (
                        <Box key={`${fC.value}-filtering-category`} sx={{width: '100%', height: `${100/filterCats.length}%`, ...theme.components.box.fullCenterCol, ...borderTop, position: 'relative'}}>
                            <ToggleButton 
                                value={fC.value}
                                selected={openStates.subCat === fC.value} 
                                onClick={() => toggleSubCat(fC.value)}
                                sx={{width: '100%', height: '100%', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '0px', ...eOStyle}}
                            >
                                {fC.display}
                                {filterCountArr.length !== 0 && 
                                <Typography sx={{position: 'absolute', fontSize: '9px', bottom: '5%'}}>
                                    {filterCountArr.length} filter{filterCountArr.length >= 2 ? 's' : ''} applied
                                </Typography>
                                }
                            </ToggleButton>
                            {openStates.subCat === fC.value && 
                            <Box sx={{position: 'absolute', right: '100%', width: '160px'}}>
                                {filteringArr.map((f, i) => {
                                    const eOStyle2 = i % 2 === 0 ? generateButtonStyles('even') : generateButtonStyles('odd')
                                    const firstGame = isGameFilt && f.display.slice(0, f.display.indexOf('/'))
                                    const secondGame = isGameFilt && f.display.slice(f.display.indexOf('/')+1, f.display.length)
                                    const firstGameColor = isGameFilt && getGameColor(firstGame)
                                    const secondGameColor = isGameFilt && getGameColor(secondGame)
                                    return (
                                        <Box key={`${f.value}-filtering-option`} sx={{height: '60px', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.dark}}>
                                            <ToggleButton 
                                                value={f.value}
                                                selected={catFiltersArr.includes(f.value)} 
                                                onClick={() => handleFilterChange(f.value, catFiltersArr, isGameFilt)}
                                                sx={{width: '100%', height: '100%', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '0px', ...theme.components.box.fullCenterRow, flexDirection: fC.value === 'ball' ? 'column' : 'row', ...eOStyle2}}
                                            >
                                                {isGameFilt ? 
                                                <>
                                                    <Typography sx={{color: firstGameColor}}>{firstGame}</Typography>
                                                    <Typography sx={{color: secondGameColor}}>/{secondGame}</Typography>
                                                </> : 
                                                f.display}
                                                {fC.value === 'ball' && 
                                                <ImgData type='ball' linkKey={f.value} size='28px'/>
                                                }
                                            </ToggleButton>
                                        </Box>
                                    )
                                })}
                                {fC.value === 'game' && 
                                    <Box sx={{height: '60px', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.dark}}>
                                        <ToggleButton 
                                            value={'no-game'}
                                            selected={catFiltersArr.includes('no-game')} 
                                            onClick={() => handleFilterChange('no-game', catFiltersArr, true)}
                                            sx={{width: '100%', height: '100%', fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '0px', ...theme.components.box.fullCenterCol, ...generateButtonStyles(gameFilters.length % 2 === 0 ? 'even' : 'odd')}}
                                        >
                                            None
                                        </ToggleButton>
                                    </Box>
                                }
                            </Box>
                            }
                        </Box>
                    )
                })}
            </Box>
            <Box sx={{height: '170px', width: '100%', ...theme.components.box.fullCenterCol, position: 'absolute', bottom: '0px', justifyContent: 'end', gap: 0.5}}>
                {list === 'collection' &&
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative'}}>
                    <Typography sx={{color: 'white', fontSize: '14px'}}>Full Sets: {showFullSets ? 'Shown' : 'Hidden'}</Typography>
                    <Button 
                        sx={{
                            border: `1px solid ${theme.palette.color1.dark}`, 
                            backgroundColor: hexToRgba(theme.palette.color3.main, 0.75), 
                            color: theme.palette.color1.main,
                            padding: 0.5,
                            fontSize: '14px',
                            zIndex: 15,
                            ':hover': {cursor: 'pointer', backgroundColor: hexToRgba(theme.palette.color3.main, 0.75), opacity: 0.65}
                        }}
                        onClick={() => {
                            dispatch(deselect())
                            dispatch(toggleFullSetView({useState: (isEditMode || demo), collection: collection.ownedPokemon.filter(p => p.disabled === undefined)}))
                        }}
                    >
                        {showFullSets ? 'Hide' : 'Show'} Full Sets
                    </Button>
                    
                </Box>
                }
                <ListSearch 
                    queryFunc={(q) => setOpenStates({...openStates, query: q})} 
                    textFieldProps={{
                        label: 'Search Pokemon',
                        variant: 'outlined',
                        size: 'small', 
                        // sx: {
                        
                        // },
                        InputLabelProps: {sx: {color: 'white', fontSize: '16px'}},
                        InputProps: {sx: {color: 'white',  '& .MuiInputBase-input': {paddingY: 1}, mx: 0.5}}
                    }}
                    customValue={openStates.query}
                />
                <Button 
                    sx={{width: '100%', height: '60px', backgroundColor: hexToRgba(theme.palette.color2.darker, 0.8) }}
                    onClick={() => {
                        dispatch(deselect())
                        dispatch(resetFilters({useState: (isEditMode || demo), collection: collection.ownedPokemon.filter(p => p.disabled === undefined), onhand: collection.onHand, listType: list}))
                    }}
                >
                    Reset All Filters
                </Button>
            </Box>
        </SmallWidthModalWrapper>
        </>
    )
}