import {createSlice} from '@reduxjs/toolkit'

const alerts = createSlice({
    name: 'alerts',
    initialState: [],
    reducers: {
        addAlert: (state, action) => {
            const {alertData, id} = action.payload
            state.unshift({...alertData, id})
            return state
        },
        dismissAlert: (state, action) => {
            return state.filter(alerts => alerts.id !== action.payload)
        }
    }
})

export const {addAlert, dismissAlert} = alerts.actions

export default alerts