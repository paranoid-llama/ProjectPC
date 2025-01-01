import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collectionReducers, onhandReducers } from "./reducers/listreducers";
import { listDisplayInitialState, displayReducers } from "./reducers/displayreducers";
import { optionsInitialState, optionsReducers } from "./reducers/optionsreducers";
import { commonReducers } from "./commonreducers/sharedReducers";
import displayOnHandByPokemon from "../../../utils/functions/display/displayonhandbypokemon";
import { filterList } from "../../../utils/functions/sortfilterfunctions/filterfunctions";
import { changeList, setAllData, setPosRenderOHBallData } from "./editmode";
import { hideFullSets } from "../../../utils/functions/display/fullsetview";

const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export const fetchCollectionData = createAsyncThunk('collection/fetchCollectionStatus', async(colId) => {
    const response = await fetch(`${backendurl}/collections/${colId}`).then(res => res.json())
    return response
})

const collectionState = createSlice({
    name: 'collectionState',
    initialState: {
        collection: [],
        onhand: [],
        eggMoveInfo: {},
        availableGamesInfo: {},
        listDisplay: listDisplayInitialState,
        options: optionsInitialState,
        demoData: {gen: ''}
    },
    reducers: {
        initializeTotalState: commonReducers.initializeTotalState,
        setListDisplayInitialState: commonReducers.setListDisplayInitialState,
        setIsHA: commonReducers.setIsHA,
        setEmCount: commonReducers.setEmCount,
        setEms: commonReducers.setEms,
        deleteEms: commonReducers.deleteEms,

        setIsOwned: collectionReducers.setIsOwned,
        setTags: collectionReducers.setTags,
        setDefault: collectionReducers.setDefault,
        setMultipleIsOwned: collectionReducers.setMultipleIsOwned,

        setBall: onhandReducers.setBall,
        setGender: onhandReducers.setGender,
        setPokemonSpecies: onhandReducers.setPokemonSpecies,
        setQty: onhandReducers.setQty,
        setQtyByPokemon: onhandReducers.setQtyByPokemon,

        setListState: displayReducers.setListState,
        addOnHandPokemonToList: displayReducers.addOnHandPokemonToList,
        addOnHandPokemonToListByPokemon: displayReducers.addOnHandPokemonToListByPokemon,
        removeOnHandPokemonFromList: displayReducers.removeOnHandPokemonFromList,
        setSortKey: displayReducers.setSortKey,
        setFilters: displayReducers.setFilters,
        filterSearch: displayReducers.filterSearch,
        setScrollPosition: (state, action) => {
            return action.payload.onhandScrollRef ? 
            {...state, lastOnhandScrollPosition: action.payload.scrollPos, prevColId: action.payload.latestColId, } : 
            {...state, lastScrollPosition: action.payload.scrollPos, prevColId: action.payload.latestColId}
        },
        setOnHandView: (state, action) => {
            const useState = action.payload.useState
            if (state.listDisplay.onhandView === 'byIndividual') {
                state.listDisplay.onhand = displayOnHandByPokemon(state.listDisplay.onhand, action.payload.collection)
                state.listDisplay.onhandView = 'byPokemon'
            }
            else {
                const filtersData = {
                    ballFilters: state.listDisplay.onhandFilters.filters.ballFilters,
                    genFilters: state.listDisplay.onhandFilters.filters.genFilters,
                    otherFilters: state.listDisplay.onhandFilters.filters.otherFilters
                }
                state.listDisplay.onhand = filterList(useState ? state.onhand : action.payload.onhand, '', '', 'onhand', useState ? state.onhand : action.payload.onhand, true, filtersData, state.listDisplay.onhandFilters.sort, state.availableGamesInfo)
                state.listDisplay.onhandView = 'byIndividual'
            }
            return state
        },
        toggleFullSetView: (state, action) => {
            const useState = action.payload.useState
            state.listDisplay.showFullSets = !state.listDisplay.showFullSets
            if (state.listDisplay.showFullSets) {
                const filtersData = {
                    ballFilters: state.listDisplay.collectionFilters.filters.ballFilters,
                    genFilters: state.listDisplay.collectionFilters.filters.genFilters,
                    otherFilters: state.listDisplay.collectionFilters.filters.otherFilters
                }
                state.listDisplay.collection = filterList(useState ? state.collection.filter(p => p.disabled === undefined) : action.payload.collection, '', '', 'collection', useState ? state.collection.filter(p => p.disabled === undefined) : action.payload.collection, true, filtersData, state.listDisplay.collectionFilters.sort, state.availableGamesInfo)
            } else {
                state.listDisplay.collection = hideFullSets(state.listDisplay.collection)
            }
            return state
        },
        resetFilters: (state, action) => {
            const {useState, onhand, collection, listType} = action.payload
            state.listDisplay[`${listType}Filters`].filters = {genFilters: [], ballFilters: [], otherFilters: []}
            if (listType === 'collection') {
                state.listDisplay.showFullSets = true
                state.listDisplay.collection = useState ? state.collection.filter(p => p.disabled === undefined) : collection 
            } else {
                const onhandListToUse = useState ? state.onhand : onhand 
                state.listDisplay.onhand = state.listDisplay.onhandView === 'byIndividual' ? onhandListToUse : displayOnHandByPokemon(onhandListToUse, useState ? state.collection : collection)
            }
        },

        setRate: optionsReducers.setRate,
        setBallScope: optionsReducers.setBallScope,
        setSortingOptionsState: optionsReducers.setSortingOptionsState,
        setTradePreferencesState: optionsReducers.setTradePreferencesState,
        setItemState: optionsReducers.setItemState,
        setNameState: optionsReducers.setNameState,
        setGlobalDefaultState: optionsReducers.setGlobalDefaultState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollectionData.fulfilled, (state, action) => {
                state.collection = action.payload.ownedPokemon
                if (state.listDisplay.collection.length === 0) {state.listDisplay.collection = action.payload.ownedPokemon.filter(p => !p.disabled)}

                state.onhand = action.payload.onHand
                if (state.listDisplay.onhand.length === 0){
                    // state.listDisplay.onhand = action.payload.onHand
                    if (state.listDisplay.onhandView === 'byPokemon') {state.listDisplay.onhand = displayOnHandByPokemon(state.onhand, action.payload.ownedPokemon)}
                    else { state.listDisplay.onhand = state.onhand }
                }
                if (action.payload.eggMoveInfo) {state.eggMoveInfo = action.payload.eggMoveInfo} else {state.eggMoveInfo = {}}
                if (action.payload.availableGamesInfo) {state.availableGamesInfo = action.payload.availableGamesInfo} else {state.availableGamesInfo = {}}
                state.options = {...action.payload.options, collectionName: action.payload.name}
                return state
            })
            .addCase(changeList, (state, action) => {
                state.lastScrollPosition = undefined,
                state.lastOnhandScrollPosition = undefined
                return state
            })
            .addCase(setPosRenderOHBallData, (state, action) => {
                const {onhandId, noOhUpdate, newBall} = action.payload
                if (!noOhUpdate) {
                    state.onhand = state.onhand.map((p) => {
                        if (p._id === onhandId) {
                            p.ball = newBall
                        }
                        return p
                    })
                }
                return state
            })
            .addCase(setAllData, (state, action) => { //used in sw editors, which is why we use the pokemonIdx instead
                const {noOhUpdate, newBall, pokemonIdx} = action.payload
                if (!noOhUpdate) {
                    // state.onhand[pokemonIdx].ball = newBall
                    return {...state, onhand: state.onhand.map((p, idx) => idx === pokemonIdx ? {...p, ball: newBall} : p)}
                }
                return state
            })
    }
})

export const {
    initializeTotalState, setListDisplayInitialState, setIsHA, setEmCount, setEms, deleteEms,
    setIsOwned, setTags, setDefault, setMultipleIsOwned,
    setBall, setGender, setPokemonSpecies, setQty, setQtyByPokemon,
    setListState, addOnHandPokemonToList, addOnHandPokemonToListByPokemon, removeOnHandPokemonFromList, setSortKey, setFilters, filterSearch, setScrollPosition, setOnHandView, toggleFullSetView, resetFilters,
    setRate, setBallScope, setSortingOptionsState, setTradePreferencesState, setItemState, setNameState, setGlobalDefaultState,
} = collectionState.actions

export default collectionState