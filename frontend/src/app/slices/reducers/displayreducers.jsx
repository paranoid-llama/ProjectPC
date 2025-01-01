import { filterList } from "../../../../utils/functions/sortfilterfunctions/filterfunctions"
import { sortList } from "../../../../common/sortingfunctions/customsorting.mjs"
import { sortOnHandList } from "../../../../common/sortingfunctions/onhandsorting.mjs"
import { apriballs, homeDisplayGames } from "../../../../common/infoconstants/miscconstants.mjs"
import getNameDisplay from "../../../../utils/functions/display/getnamedisplay"
import { hideFullSets } from "../../../../utils/functions/display/fullsetview"
import {updateListWithNewOnHands} from "../../../../utils/functions/display/displayonhandbypokemon"
import { removeByPokemonOhandsFromList } from "../../../components/collectiontable/onhandlist/onhandbypokemonupdates/ohbypokemonstateupdate"

//operations related to editing the display state of the lists, to edit what is shown, how much is shown, etc.
//used to give how much data is given to the table renderer (for filtering lists, for example)

const listDisplayInitialState = {
    collection: [], 
    onhand: [], 
    collectionFilters: {
        sort: '', 
        filters: {
            ballFilters: [], 
            genFilters: [], 
            otherFilters: []
        }
    }, 
    onhandFilters: {
        sort: '', 
        filters: {
            ballFilters: [], 
            genFilters: [], 
            otherFilters: []
        }
    }, 
    onhandView: 'byIndividual', 
    showFullSets: true,
}

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
            if (state.listDisplay.onhandView === 'byPokemon') {
                state.listDisplay.onhand = updateListWithNewOnHands(newOnhand, state.listDisplay.onhand, state.collection)
            } else {
                state.listDisplay.onhand = [...state.listDisplay.onhand, ...newOnhand]
            }
        } else {
            state.onhand[state.onhand.length] = newOnhand
            if (state.listDisplay.onhandView === 'byPokemon') {
                state.listDisplay.onhand = updateListWithNewOnHands([newOnhand], state.listDisplay.onhand, state.collection)
            } else {
                state.listDisplay.onhand[state.listDisplay.onhand.length] = newOnhand
            }
        }
        const trueSortingOptions = sortingOptions === undefined ? state.options.sorting.onhand : sortingOptions
        if (trueSortingOptions.reorder) {
            state.onhand = sortOnHandList(trueSortingOptions.sortFirstBy, trueSortingOptions.default, trueSortingOptions.ballOrder, state.onhand)
            state.listDisplay.onhand = sortOnHandList(trueSortingOptions.sortFirstBy, trueSortingOptions.default, trueSortingOptions.ballOrder, state.listDisplay.onhand)
        }
        return state
    },
    addOnHandPokemonToListByPokemon: (state, action) => { 
        //via by pokemon detailed edit => +1. primarily used since we dont need to update the listDisplay 
        //(because if we are adding to the list this way, they are already in the listdisplay, and the row will update via mapstatetoprops selectors). 
        //always updates a single
        const newOnhand = action.payload
        state.onhand[state.onhand.length] = newOnhand
        if (state.options.sorting.onhand.reorder) {
            state.onhand = sortOnHandList(state.options.sorting.onhand.sortFirstBy, state.options.sorting.onhand.default, state.options.sorting.onhand.ballOrder, state.onhand)
        }
        return state
    },
    removeOnHandPokemonFromList: (state, action) => {
        const {pokemonid, byPAddon} = action.payload
        const byP = state.listDisplay.onhandView === 'byPokemon'
        const multipleRemoves = Array.isArray(pokemonid)
        if (multipleRemoves) {
            state.onhand = state.onhand.filter(p => byP ? !pokemonid.includes(`${p.imgLink} ${p.ball}`) : !pokemonid.includes(p._id))
            state.listDisplay.onhand = byP ? removeByPokemonOhandsFromList(state.listDisplay.onhand, pokemonid) : state.listDisplay.onhand.filter(p => !pokemonid.includes(p._id))
            return state
        }
        if (byP) {
            state.onhand = state.onhand.filter(p => pokemonid !== p._id)

            const needToUpdateListDisplay = state.onhand.filter(p => p.imgLink === byPAddon.slice(0, byPAddon.indexOf(' '))).length === 0 
            //indicates no more onhands of mon exists. the quantity in the list display will update regardless since the selectors
            //in swbypokemonrow use state.onhand to calculate the qty. changing the list display is only needed if there is no longer any onhands of the pokemon.
            if (needToUpdateListDisplay) {
                state.listDisplay.onhand = state.listDisplay.onhand.map((p) => {
                    const monImgL = byPAddon.slice(0, byPAddon.indexOf(' '))
                    if (p.imgLink === monImgL) {
                            return undefined
                    }
                    return p
                }).filter(p => p !== undefined)
            }
            
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
        const {filterKey, listType, listState, totalList, reFilterList, noFilters, prevActiveFilters, specificCategoryFilters, currentSortKey, changingTagBallFilters, switchingTags, numberButIsGameFilter=false, switchingBetweenNoGameAndGame=false, availableGamesInfo} = action.payload
        const filterCategory = numberButIsGameFilter ? 'otherFilters' : typeof filterKey === 'number' ? 'genFilters' : 
                                apriballs.includes(filterKey) ? 'ballFilters' : 'otherFilters'
        const otherTag = (filterCategory === 'otherFilters' && filterKey === 'highlyWanted') ? 'pending' : (filterCategory === 'otherFilters' && filterKey === 'pending') ? 'highlyWanted' : 'none'
        const newActiveFilterList = specificCategoryFilters.includes(filterKey) ? 
                                        specificCategoryFilters.filter((key) => key !== filterKey) :
                                        switchingTags ? [...specificCategoryFilters.filter(f => filterKey === 'highlyWanted' ? f !== 'pending' : f !== 'highlyWanted'), filterKey] : 
                                        switchingBetweenNoGameAndGame ? [...specificCategoryFilters.filter(f => filterKey === 'no-game' ? !homeDisplayGames.includes(f) : f !== 'no-game'), filterKey] :
                                        [...specificCategoryFilters, filterKey]
        // const newTotalActiveFilterList = prevActiveFilters.includes(filterKey) ? prevActiveFilters.filter((key) => key !== filterKey) :
        //                                 switchingTags ? prevActiveFilters.filter((key) => key !== otherTag).concat([filterKey]) : 
        //                                 (changingTagBallFilters && filterCategory === 'ballFilters') ? [...prevActiveFilters.filter((key) => (key !== 'highlyWanted') || (key !== 'pending')), filterKey] : 
        //                                 (changingTagBallFilters && filterCategory === 'otherFilters') ? [...prevActiveFilters.filter((key) => !apriballs.includes(key)), filterKey] : 
        //                                 [...prevActiveFilters, filterKey]
        const listSpecificFilters = state.listDisplay[`${listType}Filters`].filters
        if (changingTagBallFilters && filterCategory === 'ballFilters') {state.listDisplay[`${listType}Filters`].filters.otherFilters = [...state.listDisplay[`${listType}Filters`].filters.otherFilters.filter(k => k !== 'highlyWanted' && k !== 'pending')]}
        if (changingTagBallFilters && filterCategory === 'otherFilters') {state.listDisplay[`${listType}Filters`].filters.ballFilters = []}
        const specificCatCurrFilters = listSpecificFilters[filterCategory]
        const newCatActiveFilterList = {
            [filterCategory]: specificCatCurrFilters.includes(filterKey) ? specificCatCurrFilters.filter(k => k !== filterKey) : 
                switchingTags ? specificCatCurrFilters.filter(k => k !== otherTag).concat([filterKey]) : 
                // changingTagBallFilters && filterCategory === 'ballFilters' ? [...specificCatCurrFilters.filter(k => k !== 'highlyWanted' && k !== 'pending'), filterKey] : 
                // changingTagBallFilters && filterCategory === 'otherFilters' ? [...specificCatCurrFilters.filter(k => !apriballs.includes(k)), filterKey] : 
                switchingBetweenNoGameAndGame ? [...specificCatCurrFilters.filter(f => filterKey === 'no-game' ? !homeDisplayGames.includes(f) : f !== 'no-game'), filterKey] :
                [...specificCatCurrFilters, filterKey] 
        }
        const newTotalActiveFilterList = {
            genFilters: listSpecificFilters.genFilters,
            ballFilters: listSpecificFilters.ballFilters,
            otherFilters: listSpecificFilters.otherFilters,
            ...newCatActiveFilterList
        }
        const removingGenFilter = typeof filterKey === 'number' && specificCategoryFilters.includes(filterKey) && !numberButIsGameFilter                               
        if (reFilterList) {
            const filteredList = filterList([], filterKey, filterCategory, listType, totalList, reFilterList, newTotalActiveFilterList, currentSortKey, availableGamesInfo, state.listDisplay.showFullSets)
            state.listDisplay[listType] = filteredList
            state.listDisplay[`${listType}Filters`].filters[filterCategory] = newActiveFilterList
            
            // const newState = (changingTagBallFilters && filterCategory === 'ballFilters') ? 
            //     {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList, otherFilters: []}}} :
            //     (changingTagBallFilters && filterCategory === 'otherFilters') ?
            //     {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList, ballFilters: []}}} : 
            //     {...state, [listType]: filteredList, [`${listType}Filters`]: {...state[`${listType}Filters`], filters: {...state[`${listType}Filters`].filters, [filterCategory]: newActiveFilterList}}}
            return state
        }
        if (noFilters) {
            const totalListStep1 = listType === 'collection' && !state.listDisplay.showFullSets ? hideFullSets(totalList) : totalList
            const correctlySortedTotalList = currentSortKey === '' ? totalListStep1 : sortList(currentSortKey, totalListStep1)
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
        const filteredList = filterList(listState, filterKey, filterCategory, listType, [], false, newActiveFilterList, '', availableGamesInfo)
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