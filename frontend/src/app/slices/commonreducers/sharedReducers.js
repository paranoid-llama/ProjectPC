import displayOnHandByPokemon from "../../../../utils/functions/display/displayonhandbypokemon"
import { hideFullSets } from "../../../../utils/functions/display/fullsetview"

export const setInitialState = (state, action) => {
    const extractedState = action.payload
    return state = extractedState
}

export const setIsHA = (state, action) => {
    const {idx, ball, listType} = action.payload
    const valuePath = listType === 'collection' ? 
        state.collection[idx].balls[ball].isHA :
        state.onhand[idx].isHA
    if (listType === 'collection') {
        state.collection[idx].balls[ball].isHA = !valuePath
    } else if (listType === 'onhand') {
        state.onhand[idx].isHA = !valuePath
    }
    return state
}

export const setEmCount = (state, action) => {
    const {idx, ball, listType, numEMs} = action.payload
    if (listType === 'collection') {
        state.collection[idx].balls[ball].emCount = numEMs
    } else if (listType === 'onhand') {
        state.onhand[idx].emCount = numEMs
    }
    return state
}

export const setEms = (state, action) => {
    const {idx, ball, listType, emName} = action.payload 
    if (listType === 'collection') {
        if (state.collection[idx].balls[ball].EMs.includes(emName)) {
            const newEMList = state.collection[idx].balls[ball].EMs.filter(em => em !== emName)
            state.collection[idx].balls[ball].EMs = newEMList
            return state
        } else {
            state.collection[idx].balls[ball].EMs.push(emName)
            return state
        }
    } else if (listType === 'onhand') {
        if (state.onhand[idx].EMs.includes(emName)) {
            const newEMList = state.onhand[idx].EMs.filter(em => em !== emName)
            state.onhand[idx].EMs = newEMList
            return state
        } else {
            state.onhand[idx].EMs.push(emName)
            return state
        }
    }
}

export const deleteEms = (state, action) => {
    const {idx, ball, listType} = action.payload
    if (listType === 'collection') {
        state.collection[idx].balls[ball].EMs = []
    } else if (listType === 'onhand') {
        state.onhand[idx].EMs = []
    }
    return state
}

export const commonReducers = {
    initializeTotalState: (state, action) => {
        state.collection = action.payload.ownedPokemon
        state.listDisplay.collection = action.payload.ownedPokemon.filter(p => !(p.disabled))

        state.onhand = action.payload.onHand
        state.listDisplay.onhand = action.payload.onHand

        state.listDisplay.collectionFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
        state.listDisplay.onhandFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
        if (action.payload.eggMoveInfo) {state.eggMoveInfo = action.payload.eggMoveInfo} else {state.eggMoveInfo = {}}
        if (action.payload.availableGamesInfo) {state.availableGamesInfo = action.payload.availableGamesInfo} else {state.availableGamesInfo = {}}
        state.options = {...action.payload.options, collectionName: state.options.collectionName === '' ? action.payload.name : state.options.collectionName}
        state.demoData.gen = action.payload.gen
        return state
    },
    setListDisplayInitialState: (state, action) => {
        const {col, initOnHandView, currColUrl} = action.payload
        state.collection = []
        state.onhand = []
        
        
        if (currColUrl !== undefined && !currColUrl.includes(state.latestColId)) {
            state.listDisplay.showFullSets = true
            state.listDisplay.collection = col.ownedPokemon.filter(p => !(p.disabled))
        } else {
            state.listDisplay.collection = state.listDisplay.showFullSets ? col.ownedPokemon.filter(p => !(p.disabled)) : hideFullSets(col.ownedPokemon.filter(p => !(p.disabled)))
        }

        if (initOnHandView && !(currColUrl.includes(state.latestColId))) {
            state.listDisplay.onhandView = initOnHandView
        }

        if (state.listDisplay.onhandView === 'byPokemon') {state.listDisplay.onhand = displayOnHandByPokemon(col.onHand, col.ownedPokemon)}
        else { state.listDisplay.onhand = col.onHand }
        // state.listDisplay.onhand = action.payload.onHand

        state.listDisplay.collectionFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
        state.listDisplay.onhandFilters = {sort: '', filters: {ballFilters: [], genFilters: [], otherFilters: []}}
        state.latestColId = col._id

        if (col.eggMoveInfo) {state.eggMoveInfo = col.eggMoveInfo} else {state.eggMoveInfo = {}}
        if (col.availableGamesInfo) {state.availableGamesInfo = col.availableGamesInfo} else {state.availableGamesInfo = {}}
    },
    setIsHA,
    setEmCount,
    setEms,
    deleteEms
}