import {createSlice} from '@reduxjs/toolkit'

const editmode = createSlice({
    name: 'editmode',
    initialState: {selected: '', listType: 'collection', showEditScreen: false, selectedBall: '', collectionOptionsModal: {open: false,  screen: 'main'}, pokemonScopeTotal: {}},
    reducers: {
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
        },
        changeModalState: (state, action) => {
            const {open, screen, initializeScopeTotal, scopeTotal} = action.payload
            if (initializeScopeTotal) {
                const newState = {...state, collectionOptionsModal: {open: true, screen}, pokemonScopeTotal: scopeTotal}
                return newState
            }
            const newState = {...state, collectionOptionsModal: {open: open === undefined ? state.collectionOptionsModal.open : open, screen: screen === undefined ? state.collectionOptionsModal.screen : screen}}
            return newState
        },
        
    }
})

export const {
    setSelected, 
    deselect, 
    changeList, 
    toggleEditScreenState, 
    setSelectedBall, 
    setSelectedAfterChangingOwned,
    changeModalState
} = editmode.actions

export default editmode