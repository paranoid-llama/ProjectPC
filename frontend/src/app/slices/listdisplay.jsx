import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { sortOnHandList } from '../../../common/sortingfunctions/onhandsorting.mjs'
import { sortList } from '../../../common/sortingfunctions/customsorting.mjs'
import { filterList } from '../../../utils/functions/sortfilterfunctions/filterfunctions'
import { apriballs } from '../../../common/infoconstants/miscconstants.mjs'
import { setSortingOptionsState } from './options'
import getNameDisplay from '../../../utils/functions/display/getnamedisplay'
import { setOnHandInitialState } from './onhand'
import { selectivelyReturnIsHAAndEMs } from '../../../utils/functions/misc'

// const backendurl = import.meta.env.VITE_BACKEND_URL

// export const fetchCollectionData = createAsyncThunk('collection/fetchCollectionStatus', async(colId) => {
//     const response = await fetch(`${backendurl}/collections/${colId}`).then(res => res.json())
//     return response
// })

//this slice controls the display for the show list components (showonhandlist, showcollectionlist). 
//separated from the other slices as it controls the state of the list displays ONLY (not the row content) and allows it to update when the length of the lists change 
//while not allowing it to update when individual pieces of data in the array changes 
//also used to control filters/sorting

//could not find another solution to make sure the show list components only re-render when the length of the arrays change and not everytime an object in it changes

const listDisplay = createSlice({
    name: 'listDisplay',
    initialState: {collection: [], onhand: [], collectionFilters: {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}, onhandFilters: {sort: [''], filters: {ballFilters: [], genFilters: [], otherFilters: []}}, eggMoveInfo: {}, availableGamesInfo: {}},
    reducers: {
        setListInitialState: (state, action) => {
            const {collection, onhand, resetCollectionFilters, resetOnHandFilters, updatedEggMoveInfo, updatedHomeGames, onlyUpdateCollection, onlyUpdateOnHand} = action.payload
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
            if (updatedHomeGames !== undefined) {
                state.availableGamesInfo = updatedHomeGames
            }
            return state
        },
        addOnHandPokemonToList: (state, action) => {
            const {newOnhand, sortingOptions, speciesEditOnly=false} = action.payload
            if (!speciesEditOnly) {
                if (Array.isArray(newOnhand)) {
                    state.onhand = [...state.onhand, ...newOnhand]
                } else {
                    state.onhand[state.onhand.length] = newOnhand
                }
            }
            if (sortingOptions.reorder === true) {
                state.onhand = sortOnHandList(sortingOptions.sortFirstBy, sortingOptions.default, sortingOptions.ballOrder, state.onhand)
            }
            return state
        },
        changeOnHandPokemon: (state, action) => {
            const {onhandId, newPokeData, sortingOptions} = action.payload
            const indexOfId = state.onhand.findIndex(pData => pData._id === onhandId)
            state.onhand[indexOfId] = {_id: onhandId, ...newPokeData}
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
                const multipleRemoves = Array.isArray(pokemonid)
                if (multipleRemoves) {
                    const newState = {...state, onhand: state.onhand.filter(p => !pokemonid.includes(p._id))}
                    return newState
                }
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
            const {searchQuery, listState, listType, reFilterList, totalList, currentSortKey, nameDisplaySettings} = action.payload
            const newListState = reFilterList ? totalList.filter((pokemon) => getNameDisplay(nameDisplaySettings, pokemon.name, pokemon.natDexNum).toLowerCase().includes(searchQuery.toLowerCase())) : listState.filter((pokemon) => getNameDisplay(nameDisplaySettings, pokemon.name, pokemon.natDexNum).toLowerCase().includes(searchQuery.toLowerCase()))
            const newListStateSorted = currentSortKey !== '' ? sortList(currentSortKey, newListState) : newListState
            const newState = {...state, [listType]: newListStateSorted}
            return newState
        }
    }
})

export const {setListInitialState, addOnHandPokemonToList, changeOnHandPokemon, removePokemonFromList, setSortKey, setFilters, filterSearch} = listDisplay.actions

export default listDisplay