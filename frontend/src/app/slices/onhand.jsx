import {createSlice} from '@reduxjs/toolkit'
import {setInitialState, setIsHA, setEmCount, setEms, deleteEms} from './commonreducers/sharedReducers.js'
import { selectivelyReturnIsHAAndEMs } from '../../../utils/functions/misc.js'

const onhand = createSlice({
    name: 'onhand',
    initialState: {},
    reducers: {
        setOnHandInitialState: setInitialState,
        setOnHandIsHA: setIsHA,
        setOnHandEmCount: setEmCount,
        setOnHandEms: setEms,
        deleteOnHandEms: deleteEms,
        setBall: (state, action) => {
            const {idx, ball} = action.payload
            state[idx].ball = ball
            return state
        },
        setGender: (state, action) => {
            const {idx, gender} = action.payload
            state[idx].gender = gender
            return state
        },
        setPokemon: (state, action) => {
            const {idx, imgLink, pokemonData} = action.payload
            state[idx] = {_id: state[idx]._id, imgLink,  ...pokemonData}
            return state
        },
        setQty: (state, action) => {
            const {idx, qty} = action.payload
            state[idx].qty = qty
            return state
        },
        setNewOnHand: (state, action) => {
            const newOnHand = action.payload
            const multipleOnhands = Array.isArray(newOnHand)
            if (multipleOnhands) {
                return [...state, ...newOnHand]
            }
            state[state.length] = newOnHand
            return state
        },
        deleteOnHand: (state, action) => {
            const id = action.payload
            const multipleDeletes = Array.isArray(id)
            if (multipleDeletes) {
                const newState = state.filter(p => !id.includes(p._id))
                return newState
            }
            const newState = state.filter(p => p._id !== id)
            return newState
        }
    }
})

export const {setOnHandInitialState, setOnHandIsHA, setOnHandEmCount, setOnHandEms, deleteOnHandEms, setBall, setGender, setPokemon, setQty, setNewOnHand, deleteOnHand} = onhand.actions

export default onhand

