import { sortOnHandList } from "../../../../common/sortingfunctions/onhandsorting.mjs"
import { sortList } from "../../../../common/sortingfunctions/customsorting.mjs"

const optionsInitialState = {collectingBalls: [], globalDefaults: {}, sorting: {}, tradePreferences: {status: 'closed', size: 'any', onhandOnly: 'no', items: 'none', rates: {pokemonOffers: [], itemOffers: []}, lfItems: [], ftItems: {}}, collectionName: ''}

const optionsReducers = {
    setRate: (state, action) => {
        const {addingNew, removingRate, newRates, rateIdx, offerType, field, fieldIdx, value} = action.payload
        state.options.tradePreferences.rates = newRates
        // if (addingNew) {
        //     const newRate = {items: ['', ''], rate: [1, 1]}
        //     state.tradePreferences.rates[offerType][state.tradePreferences.rates[offerType].length] = newRate
        //     return state
        // }
        // if (removingRate) {
        //     const newRateArr = state.tradePreferences.rates[offerType].filter((rate, idx) => idx !== rateIdx)
        //     state.tradePreferences.rates[offerType] = newRateArr
        //     return state
        // }
        // state.tradePreferences.rates[offerType][rateIdx][field][fieldIdx] = value
        return state
    },
    setBallScope: (state, action) => {
        const {newCollectingBalls, newListState} = action.payload
        state.options.collectingBalls = newCollectingBalls
        if (newListState) {
            state.collection = newListState
            state.listDisplay.collection = newListState
            state.listDisplay.collectionFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
        }
        // const newState = {...state, collectingBalls: action.payload}
        return state
    },
    setSortingOptionsState: (state, action) => {
        const {listType, data} = action.payload
        state.options.sorting[listType] = data
        if (!(data.reorder === false) && listType === 'onhand') {
            state.onhand = sortOnHandList(data.sortFirstBy, data.default, data.ballOrder, state.onhand)
            state.listDisplay.onhand = sortOnHandList(data.sortFirstBy, data.default, data.ballOrder, state.listDisplay.onhand)
        } else if (!(data.reorder === false) && listType === 'collection') {
            state.collection = sortList(data.default, state.collection)
            state.listDisplay.collection = sortList(data.default, state.listDisplay.collection)
        }
        return state
    },
    setTradePreferencesState: (state, action) => {
        const newTradePreferencesObj = action.payload
        state.options.tradePreferences = newTradePreferencesObj
        return state
    },
    setItemState: (state, action) => {
        const {lfItems, ftItems} = action.payload
        state.options.tradePreferences = {...state.options.tradePreferences, lfItems, ftItems}
        return state
    },
    setNameState: (state, action) => {
        const {name, globalDefault} = action.payload
        if (globalDefault !== undefined) {
            state.options.globalDefaults = globalDefault
        }
        state.options.collectionName = name
        return state
    },
    setGlobalDefaultState: (state, action) => {
        state.options.globalDefaults = action.payload
        return state
    }
}

export {optionsInitialState, optionsReducers}