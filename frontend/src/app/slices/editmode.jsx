import {createSlice} from '@reduxjs/toolkit'

const editmode = createSlice({
    name: 'editmode',
    initialState: {selected: '', listType: 'collection', showEditScreen: false, selectedBall: '', unsavedChanges: false, unsavedOnhandChanges: false, deleteOnHandMode: false, deletedOnHandIds: [], collectionOptionsModal: {open: false,  screen: 'main'}, pokemonScopeTotal: {}},
    reducers: {
        setSelected: (state, action) => {
            if (typeof action.payload === 'object') {
                const {selected, selectedBall} = action.payload
                const newState = {...state, selected, showEditScreen: true, selectedBall}
                return newState
            }
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
            const newState = {...state, listType: action.payload, deleteOnHandMode: false, deletedOnHandIds: [], setFullSetMode: false}
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
        setUnsavedChanges: (state, action) => {
            const type = action.payload
            const unsavedChangesPath = type === 'onhand' ? state.unsavedOnhandChanges : state.unsavedChanges
            if (type === 'reset') {
                return {...state, unsavedOnhandChanges: false, unsavedChanges: false}
            }
            if (unsavedChangesPath) {
                return state
            } 
            
            const newPath = type === 'onhand' ? {...state, unsavedOnhandChanges: true} : {...state, unsavedChanges: true}
            return newPath
        },
        setDeleteOnHandMode: (state, action) => {
            const removedOnHandIds = action.payload === false ? {deletedOnHandIds: []} : {}
            return {...state, deleteOnHandMode: action.payload, ...removedOnHandIds}
        },
        toggleOnHandIdToDelete: (state, action) => {
            const onhandId = action.payload
            const newOnHandIdsToDelete = state.deletedOnHandIds.includes(onhandId) ? state.deletedOnHandIds.filter(ohId => ohId !== onhandId) : [...state.deletedOnHandIds, onhandId]
            return {...state, deletedOnHandIds: newOnHandIdsToDelete}
        },
        // setCompleteSetMode: (state, action) => {
        //     state.setFullSetMode = !state.setFullSetMode
        //     return state
        // }
    }
})

export const {
    setSelected, 
    deselect, 
    changeList, 
    toggleEditScreenState, 
    setSelectedBall, 
    setSelectedAfterChangingOwned,
    changeModalState,
    setUnsavedChanges,
    setDeleteOnHandMode,
    toggleOnHandIdToDelete
} = editmode.actions

export default editmode