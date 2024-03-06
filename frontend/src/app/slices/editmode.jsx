import {createSlice} from '@reduxjs/toolkit'

const editmode = createSlice({
    name: 'editmode',
    initialState: {isEditMode: false, selected: '', listType: 'collection', showEditScreen: false, selectedBall: ''},
    reducers: {
        enterEditMode: (state) => {
            state.isEditMode = true
            return state
        },
        leaveEditMode: (state) => {
            state.isEditMode = false
            return state
        },
        setSelected: (state, action) => {
            const newState = {...state, selected: action.payload, showEditScreen: false, selectedBall: ''}
            return newState
        },
        setSelectedAfterChangingOwned: (state, action) => {
            const newState = {...state, selected: action.payload.idx, showEditScreen: true, selectedBall: action.payload.ball}
            return newState
        },
        deselect: (state) => {
            const newState = {...state, selected: '', showEditScreen: false, selectedBall: ''}
            return newState
        },
        changeList: (state, action) => {
            const newState = {...state, listType: action.payload}
            return newState
        },
        toggleEditScreenState: (state) => {
            const newState = {...state, showEditScreen: !state.showEditScreen}
            return newState
        }, 
        setSelectedBall: (state, action) => {
            const newState = {...state, selectedBall: action.payload}
            return newState
        }
    }
})

export const {
    enterEditMode, 
    leaveEditMode, 
    setSelected, 
    deselect, 
    changeList, 
    toggleEditScreenState, 
    setSelectedBall, 
    setSelectedAfterChangingOwned
} = editmode.actions

export default editmode