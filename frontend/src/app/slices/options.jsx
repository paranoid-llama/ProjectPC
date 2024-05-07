import {createSlice} from '@reduxjs/toolkit'

const options = createSlice({
    name: 'options',
    initialState: {},
    reducers: {
        setOptionsInitialState: (state, action) => {
            const initialState = action.payload
            return state = initialState
        },
        setRate: (state, action) => {
            const {addingNew, removingRate, rateIdx, offerType, field, fieldIdx, value} = action.payload
            if (addingNew) {
                const newRate = {items: ['', ''], rate: [1, 1]}
                state.tradePreferences.rates[offerType][state.tradePreferences.rates[offerType].length] = newRate
                return state
            }
            if (removingRate) {
                const newRateArr = state.tradePreferences.rates[offerType].filter((rate, idx) => idx !== rateIdx)
                state.tradePreferences.rates[offerType] = newRateArr
                return state
            }
            state.tradePreferences.rates[offerType][rateIdx][field][fieldIdx] = value
            return state
        },
        setBallScope: (state, action) => {
            const newState = {...state, collectingBalls: action.payload}
            return newState
        }

    }
})

export const {setOptionsInitialState, setRate, setBallScope} = options.actions

export default options