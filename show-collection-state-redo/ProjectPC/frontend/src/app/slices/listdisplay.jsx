import {createSlice} from '@reduxjs/toolkit'
import { sortList, sortOnHandList } from '../../../utils/functions/sortfilterfunctions/sortingfunctions'
import { filterList } from '../../../utils/functions/sortfilterfunctions/filterfunctions'
import { apriballs } from '../../infoconstants'
import { setSortingOptionsState } from './options'

//this slice controls the display for the show list components (showonhandlist, showcollectionlist). 
//separated from the other slices as it controls the state of the list displays ONLY (not the row content) and allows it to update when the length of the lists change 
//while not allowing it to update when individual pieces of data in the array changes 
//also used to control filters/sorting

//could not find another solution to make sure the show list components only re-render when the length of the arrays change and not everytime an object in it changes

const listDisplay = createSlice({
    name: 'listDisplay',
    initialState: {collection: [], onhand: [], collectionFilters: {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}, onhandFilters: {sort: [''], filters: {ballFilters: [], genFilters: [], otherFilters: []}}, eggMoveInfo: {}},
    reducers: {
        setListInitialState: (state, action) => {
            const {collection, onhand, resetCollectionFilters, resetOnHandFilters, updatedEggMoveInfo, onlyUpdateCollection, onlyUpdateOnHand} = action.payload
            if (onlyUpdateOnHand === undefined) {
                state.collection = collection.filter(pokemon => pokemon.disabled === undefined)
            }
            if (!onlyUpdateCollection) {
                state.onhand = onhand
            }
            if (resetCollectionFilters) {
                state.collectionFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
            }
            if (resetOnHandFilters) {
                state.onhandFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
            }
            if (updatedEggMoveInfo !== undefined) {
                state.eggMoveInfo = updatedEggMoveInfo
            }
            return state
        },
        addOnHandPokemonToList: (state, action) => {
            const {newOnhand, sortingOptions} = action.payload
            state.onhand[state.onhand.length] = newOnhand
            if (sortingOptions.reorder === true) {
                state.onhand = sortOnHandList(sortingOptions.sortFirstBy, sortingOptions.default, sortingOptions.ballOrder, state.onhand)
            }
            return state
        },
        removePokemonFromList: (state, action) => {
            const {pokemonid, listType} = action.payload
            if (listType === 'collection') {
                const newState = {...state, collection: state.collection.filter((p, idx) => idx !== pokemonid)}
                return newState
            } else if (listType === 'onhand') {
                const newState = {...state, onhand: state.onhand.filter(p => p._id !== pokemonid)}
                return newState
            }
        },
        setSortKey: (state, action) => {
            const {sortKey, listType, listState} = action.payload
            const sortedList = sortList(sortKey, listState)
            const newState = {...state, [listType]: sortedList, [`${listType}Filters`]: {...state[`${listType}Filters`], sort: sortKey}}
            return newState
        },
        setFilters: (state, action) => {
            const {filterKey, listType, listState, totalList, reFilterList, noFilters, prevActiveFilters, specificCategoryFilters, currentSortKey, changingTagBallFilters, switchingTags} = action.payload
            const balls = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'dream', 'beast', 'safari', 'sport']
            const filterCategory = typeof filterKey === 'number' ? 'genFilters' : 
                                    balls.includes(filterKey) ? 'ballFilters' : 'otherFilters'
            const otherTag = (filterCategory === 'otherFilters' && filterKey === 'highlyWanted') ? 'pending' : (filterCategory === 'otherFilters' && filterKey === 'pending') ? 'highlyWanted' : 'none'
            const newActiveFilterList = specificCategoryFilters.includes(filterKey) ? 
                                            specificCategoryFilters.filter((key) => key !== filterKey) :
                                            switchingTags ? [filterKey] : 
                                            [...specificCategoryFilters, filterKey]
            const newTotalActiveFilterList = prevActiveFilters.includes(filterKey) ? prevActiveFilters.filter((key) => key !== filterKey) :
                                            switchingTags ? prevActiveFilters.filter((key) => key !== otherTag).concat([filterKey]) : 
                                            (changingTagBallFilters && filterCategory === 'ballFilters') ? [...prevActiveFilters.filter((key) => (key !== 'highlyWanted') || (key !== 'pending')), filterKey] : 
                                            (changingTagBallFilters && filterCategory === 'otherFilters') ? [...prevActiveFilters.filter((key) => !apriballs.includes(key)), filterKey] : 
                                            [...prevActiveFilters, filterKey] 
            const removingGenFilter = typeof filterKey === 'number' && specificCategoryFilters.includes(filterKey)                               
            if (reFilterList) {
                const filteredList = filterList([], filterKey, filterCategory, listType, totalList, reFilterList, newTotalActiveFilterList, currentSortKey)
                const newState = (changingTagBallFilters && filterCategory === 'ballFilters') ? 
                    {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList, otherFilters: []}}} :
                    (changingTagBallFilters && filterCategory === 'otherFilters') ?
                    {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList, ballFilters: []}}} : 
                    {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList}}}
                return newState
            }
            if (noFilters) {
                const correctlySortedTotalList = currentSortKey === '' ? totalList : sortList(currentSortKey, totalList)
                const newState = {...state, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {ballFilters: [], genFilters: [], otherFilters: []}}, [listType]: correctlySortedTotalList}
                return newState
            }
            if (removingGenFilter) {
                const filteredList = listState.filter((pokemon) => pokemon.gen !== filterKey)
                const newState = {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList}}}
                return newState
            }
            const filteredList = filterList(listState, filterKey, filterCategory, listType)
            const newState = {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList}}}
            return newState
        },
        filterSearch: (state, action) => {
            const {searchQuery, listState, listType, reFilterList, totalList, currentSortKey} = action.payload
            const newListState = reFilterList ? totalList.filter((pokemon) => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())) : listState.filter((pokemon) => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
            const newListStateSorted = currentSortKey !== '' ? sortList(currentSortKey, newListState) : newListState
            const newState = {...state, [listType]: newListStateSorted}
            return newState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setSortingOptionsState, (state, action) => {
                const {listType, data} = action.payload
                if (data.reorder === false) {
                    return state
                }
                if (listType === 'onhand') {
                    state.onhand = sortOnHandList(data.sortFirstBy, data.default, data.ballOrder, state.onhand)
                    return state
                } else {
                    state.collection = sortList(data.default, state.collection)
                    return state
                }
            })
    }
})

export const {setListInitialState, addOnHandPokemonToList, removePokemonFromList, setSortKey, setFilters, filterSearch} = listDisplay.actions

export default listDisplay