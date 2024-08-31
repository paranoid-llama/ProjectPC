import { filterList } from "../../../../utils/functions/sortfilterfunctions/filterfunctions"
import { sortList } from "../../../../common/sortingfunctions/customsorting.mjs"
import { sortOnHandList } from "../../../../common/sortingfunctions/onhandsorting.mjs"
import { apriballs } from "../../../../common/infoconstants/miscconstants.mjs"
import getNameDisplay from "../../../../utils/functions/display/getnamedisplay"

//operations related to editing the display state of the lists, to edit what is shown, how much is shown, etc.
//used to give how much data is given to the table renderer (for filtering lists, for example)

const listDisplayInitialState = {collection: [], onhand: [], collectionFilters: {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}, onhandFilters: {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}, onhandView: 'byIndividual'}

const displayReducers = {
    setListState: (state, action) => {
        const {collection, onhand, resetCollectionFilters, resetOnHandFilters, updatedEggMoveInfo, updatedHomeGames, onlyUpdateCollection, onlyUpdateOnHand} = action.payload
        if (onlyUpdateOnHand === undefined) {
            state.listDisplay.collection = collection.filter(pokemon => pokemon.disabled === undefined)
            state.collection = collection
        }
        if (!onlyUpdateCollection) {
            state.listDisplay.onhand = onhand
            state.onhand = onhand
        }
        if (resetCollectionFilters) {
            state.listDisplay.collectionFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
        }
        if (resetOnHandFilters) {
            state.listDisplay.onhandFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
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
        const {newOnhand, sortingOptions} = action.payload
        if (Array.isArray(newOnhand)) {
            state.onhand = [...state.onhand, ...newOnhand]
            state.listDisplay.onhand = [...state.listDisplay.onhand, ...newOnhand]
        } else {
            state.onhand[state.onhand.length] = newOnhand
            state.listDisplay.onhand[state.listDisplay.onhand.length] = newOnhand
        }
        if (sortingOptions.reorder === true) {
            state.onhand = sortOnHandList(sortingOptions.sortFirstBy, sortingOptions.default, sortingOptions.ballOrder, state.onhand)
            state.listDisplay.onhand = sortOnHandList(sortingOptions.sortFirstBy, sortingOptions.default, sortingOptions.ballOrder, state.listDisplay.onhand)
        }
        return state
    },
    removeOnHandPokemonFromList: (state, action) => {
        const {pokemonid} = action.payload
        const multipleRemoves = Array.isArray(pokemonid)
        if (multipleRemoves) {
            state.onhand = state.onhand.filter(p => !pokemonid.includes(p._id))
            state.listDisplay.onhand = state.listDisplay.onhand.filter(p => !pokemonid.includes(p._id))
            return state
        }
        state.onhand = state.onhand.filter(p => pokemonid !== p._id)
        state.listDisplay.onhand = state.listDisplay.onhand.filter(p => pokemonid !== p._id)
        return state
    },
    setSortKey: (state, action) => {
        const {sortKey, listType} = action.payload
        state.listDisplay[listType] = sortList(sortKey, state.listDisplay[listType])
        state.listDisplay[`${listType}Filters`].sort = sortKey
        return state
    },
    setFilters: (state, action) => {
        const {filterKey, listType, listState, totalList, reFilterList, noFilters, prevActiveFilters, specificCategoryFilters, currentSortKey, changingTagBallFilters, switchingTags} = action.payload
        const filterCategory = typeof filterKey === 'number' ? 'genFilters' : 
                                apriballs.includes(filterKey) ? 'ballFilters' : 'otherFilters'
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
            state.listDisplay[listType] = filteredList
            state.listDisplay[`${listType}Filters`].filters[filterCategory] = newActiveFilterList
            if (changingTagBallFilters && filterCategory === 'ballFilters') {state.listDisplay[`${listType}Filters`].filters.otherFilters = []}
            if (changingTagBallFilters && filterCategory === 'otherFilters') {state.listDisplay[`${listType}Filters`].filters.ballFilters = []}
            // const newState = (changingTagBallFilters && filterCategory === 'ballFilters') ? 
            //     {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList, otherFilters: []}}} :
            //     (changingTagBallFilters && filterCategory === 'otherFilters') ?
            //     {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList, ballFilters: []}}} : 
            //     {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList}}}
            return state
        }
        if (noFilters) {
            const correctlySortedTotalList = currentSortKey === '' ? totalList : sortList(currentSortKey, totalList)
            state.listDisplay[listType] = correctlySortedTotalList
            state.listDisplay[`${listType}Filters`].filters = {ballFilters: [], genFilters: [], otherFilters: []}
            // const newState = {...state, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {ballFilters: [], genFilters: [], otherFilters: []}}, [listType]: correctlySortedTotalList}
            return state
        }
        if (removingGenFilter) {
            const filteredList = listState.filter((pokemon) => pokemon.gen !== filterKey)
            state.listDisplay[listType] = filteredList
            state.listDisplay[`${listType}Filters`].filters[filterCategory] = newActiveFilterList
            // const newState = {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList}}}
            return state
        }
        const filteredList = filterList(listState, filterKey, filterCategory, listType)
        state.listDisplay[listType] = filteredList
        state.listDisplay[`${listType}Filters`].filters[filterCategory] = newActiveFilterList
        // const newState = {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList}}}
        return state
    },
    filterSearch: (state, action) => {
        const {searchQuery, listState, listType, reFilterList, totalList, currentSortKey, nameDisplaySettings} = action.payload
        const newListState = reFilterList ? totalList.filter((pokemon) => getNameDisplay(nameDisplaySettings, pokemon.name, pokemon.natDexNum).toLowerCase().includes(searchQuery.toLowerCase())) : listState.filter((pokemon) => getNameDisplay(nameDisplaySettings, pokemon.name, pokemon.natDexNum).toLowerCase().includes(searchQuery.toLowerCase()))
        const newListStateSorted = currentSortKey !== '' ? sortList(currentSortKey, newListState) : newListState
        state.listDisplay[listType] = newListStateSorted
        // const newState = {...state, [listType]: newListStateSorted}
        return state
    }
}

export {listDisplayInitialState, displayReducers}