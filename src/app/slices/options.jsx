import {createSlice} from '@reduxjs/toolkit'

const options = createSlice({
    name: 'options',
    initialState: {collectingBalls: [], globalDefaults: {}, sorting: {}, tradePreferences: {status: 'closed', size: 'any', onhandOnly: 'no', items: 'none', rates: {pokemonOffers: [], itemOffers: []}, lfItems: [], ftItems: {}}},
    reducers: {
        setOptionsInitialState: (state, action) => {
            const initialState = action.payload
            return state = initialState
        },
        setRate: (state, action) => {
            const {addingNew, removingRate, newRates, rateIdx, offerType, field, fieldIdx, value} = action.payload
            state.tradePreferences.rates = newRates
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
            const newState = {...state, collectingBalls: action.payload}
            return newState
        },
        setSortingOptionsState: (state, action) => {
            const {listType, data} = action.payload
            state.sorting[listType] = data
            return state
        },
        setTradePreferencesState: (state, action) => {
            const newTradePreferencesObj = action.payload
            state.tradePreferences = newTradePreferencesObj
            return state
        },
        setItemState: (state, action) => {
            const {lfItems, ftItems} = action.payload
            state.tradePreferences = {...state.tradePreferences, lfItems, ftItems}
            return state
        },
        setNameState: (state, action) => {
            const {name, globalDefault} = action.payload
            if (globalDefault !== undefined) {
                state.globalDefaults = globalDefault
            }
            state.collectionName = name
            return state
        },
        setGlobalDefaultState: (state, action) => {
            state.globalDefaults = action.payload
            return state
        }
    }
})

export const {setOptionsInitialState, setRate, setBallScope, setSortingOptionsState, setTradePreferencesState, setItemState, setNameState, setGlobalDefaultState} = options.actions

export default options