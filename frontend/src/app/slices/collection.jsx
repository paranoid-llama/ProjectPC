import {createSlice} from '@reduxjs/toolkit'
import {setInitialState, setIsHA, setEmCount, setEms, deleteEms} from './commonreducers/sharedReducers.js'

const collection = createSlice({
    name: 'collection',
    initialState: {},
    reducers: {
        setCollectionInitialState: setInitialState,
        setCollectionIsHA: setIsHA,
        setCollectionEmCount: setEmCount,
        setCollectionEms: setEms,
        deleteCollectionEms: deleteEms,
        selectMon: (state, action) => {
            state[action.payload.idx].selected = true
            return state
        },
        setIsOwned: (state, action) => {
            const {idx, ball, ballDefault} = action.payload
            const isOwned = state[idx].balls[ball].isOwned
            const activeTag = state[idx].balls[ball].highlyWanted !== undefined ? 'highlyWanted' : state[idx].balls[ball].pending !== undefined ? 'pending' : 'none'
            if (isOwned === false && ballDefault !== 'none') {
                if (state[idx].balls[ball].isHA !== undefined) {
                    state[idx].balls[ball].isHA = state[idx].balls[ballDefault].isHA
                }
                if (state[idx].balls[ball].EMs !== undefined) {
                    state[idx].balls[ball].EMs = state[idx].balls[ballDefault].EMs
                    state[idx].balls[ball].emCount = state[idx].balls[ballDefault].emCount
                }
            }
            if (isOwned === false && activeTag !== 'none') {
                delete state[idx].balls[ball][activeTag]
            }
            if ((isOwned === false && state[idx].balls[ball].isHA !== undefined) && ballDefault === 'none') {
                state[idx].balls[ball].isHA = true
            }
            state[idx].balls[ball].isOwned = !isOwned
            return state 
        },
        setTags: (state, action) => {
            const {tagType, idx, ball} = action.payload
            const otherTag = tagType === 'highlyWanted' ? 'pending' : 'highlyWanted'
            if (state[idx].balls[ball][tagType] !== undefined) {
                delete state[idx].balls[ball][tagType]
                return state
            }
            if (state[idx].balls[ball][otherTag] !== undefined) {
                delete state[idx].balls[ball][otherTag]
            }
            state[idx].balls[ball][tagType] = true
            return state
        },
        setDefault: (state, action) => {
            const {idx, ball, prevDefault} = action.payload
            if (prevDefault !== 'none') {
                delete state[idx].balls[prevDefault].default
            }
            if (prevDefault === ball) {
                delete state[idx].balls[ball].default
            } else {
                state[idx].balls[ball].default = true
            }
            return state
        }
    }
})

export const {setCollectionInitialState, setCollectionIsHA, setCollectionEmCount, setCollectionEms, deleteCollectionEms, setIsOwned, selectMon, setTags, setDefault} = collection.actions

export default collection
