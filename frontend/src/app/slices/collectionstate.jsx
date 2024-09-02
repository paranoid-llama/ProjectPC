import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collectionReducers, onhandReducers } from "./reducers/listreducers";
import { listDisplayInitialState, displayReducers } from "./reducers/displayreducers";
import { optionsInitialState, optionsReducers } from "./reducers/optionsreducers";
import { commonReducers } from "./commonreducers/sharedReducers";
import displayOnHandByPokemon from "../../../utils/functions/display/displayonhandbypokemon";
import { filterList } from "../../../utils/functions/sortfilterfunctions/filterfunctions";
import { changeList } from "./editmode";

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
        options: optionsInitialState
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

        setBall: onhandReducers.setBall,
        setGender: onhandReducers.setGender,
        setPokemonSpecies: onhandReducers.setPokemonSpecies,
        setQty: onhandReducers.setQty,

        setListState: displayReducers.setListState,
        addOnHandPokemonToList: displayReducers.addOnHandPokemonToList,
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
                state.listDisplay.onhand = filterList(useState ? state.onhand : action.payload.onhand, '', '', 'onhand', useState ? state.onhand : action.payload.onhand, true, [...state.listDisplay.onhandFilters.filters.ballFilters, ...state.listDisplay.onhandFilters.filters.genFilters, ...state.listDisplay.onhandFilters.filters.otherFilters], state.listDisplay.onhandFilters.sort)
                state.listDisplay.onhandView = 'byIndividual'
            }
            return state
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
                if (state.listDisplay.collection.length === 0) {state.listDisplay.collection = action.payload.ownedPokemon.filter(p => !(p.disabled))}

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
    }
})

export const {
    initializeTotalState, setListDisplayInitialState, setIsHA, setEmCount, setEms, deleteEms,
    setIsOwned, setTags, setDefault,
    setBall, setGender, setPokemonSpecies, setQty,
    setListState, addOnHandPokemonToList, removeOnHandPokemonFromList, setSortKey, setFilters, filterSearch, setScrollPosition, setOnHandView,
    setRate, setBallScope, setSortingOptionsState, setTradePreferencesState, setItemState, setNameState, setGlobalDefaultState,
} = collectionState.actions

export default collectionState