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
            const {idx, name, natDexNum, imgLink, ball, gender, isHA, emCount, EMs, qty} = action.payload
            const newPokemon = {
                name, 
                natDexNum, 
                imgLink, 
                ball, 
                gender, 
                qty, 
                ...selectivelyReturnIsHAAndEMs('isHA', isHA), 
                ...selectivelyReturnIsHAAndEMs('emCount', emCount), 
                ...selectivelyReturnIsHAAndEMs('EMs',EMs)
                //functions are required here as not all pokemon have isHA field/EMs field. this dispatch receives those fields as 'undefined' if they don't.
            }
            state[idx] = {_id: state[idx]._id, ...newPokemon}
            return state
        },
        setQty: (state, action) => {
            const {idx, qty} = action.payload
            state[idx].qty = qty
            return state
        },
        setNewOnHand: (state, action) => {
            const newOnHand = action.payload
            state[state.length] = newOnHand
            return state
        },
        deleteOnHand: (state, action) => {
            const id = action.payload
            const newState = state.filter(p => p._id !== id)
            return newState
        }
    }
})

export const {setOnHandInitialState, setOnHandIsHA, setOnHandEmCount, setOnHandEms, deleteOnHandEms, setBall, setGender, setPokemon, setQty, setNewOnHand, deleteOnHand} = onhand.actions

export default onhand

