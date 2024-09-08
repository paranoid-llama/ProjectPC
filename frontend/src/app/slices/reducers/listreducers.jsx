import { sortOnHandList } from "../../../../common/sortingfunctions/onhandsorting.mjs"
import getDefaultData from "../../../../utils/functions/defaultdata"

//operations related to changing the values on a single pokemon in a collection, which is used to edit the row data.

const collectionReducers = {
    setIsOwned: (state, action) => {
        const {idx, ball, ballDefault} = action.payload
        const isOwned = state.collection[idx].balls[ball].isOwned
        const activeTag = state.collection[idx].balls[ball].highlyWanted !== undefined ? 'highlyWanted' : state.collection[idx].balls[ball].pending !== undefined ? 'pending' : 'none'
        if (isOwned === false) {
            const changedFields = Object.keys(ballDefault)
            for (let field of changedFields) {
                state.collection[idx].balls[ball][field] = ballDefault[field]
            }
        }
        if (isOwned === false && activeTag !== 'none') {
            delete state.collection[idx].balls[ball][activeTag]
        }
        if ((isOwned === false && state.collection[idx].balls[ball].isHA !== undefined) && ballDefault === 'none') {
            state.collection[idx].balls[ball].isHA = true
        }
        state.collection[idx].balls[ball].isOwned = !isOwned
        return state 
    },
    setTags: (state, action) => {
        const {tagType, idx, ball} = action.payload
        const otherTag = tagType === 'highlyWanted' ? 'pending' : 'highlyWanted'
        if (state.collection[idx].balls[ball][tagType] !== undefined) {
            delete state.collection[idx].balls[ball][tagType]
            return state
        }
        if (state.collection[idx].balls[ball][otherTag] !== undefined) {
            delete state.collection[idx].balls[ball][otherTag]
        }
        state.collection[idx].balls[ball][tagType] = true
        return state
    },
    setDefault: (state, action) => {
        const {idx, ball, prevDefault} = action.payload
        if (prevDefault !== 'none') {
            delete state.collection[idx].balls[prevDefault].default
        }
        if (prevDefault === ball) {
            delete state.collection[idx].balls[ball].default
        } else {
            state.collection[idx].balls[ball].default = true
        }
        return state
    },
    setMultipleIsOwned: (state, action) => {
        const {idx, ballDefault, globalDefault, possibleEggMoves} = action.payload
        const currentTotalBallData = state.collection[idx].balls
        const maxEMs = possibleEggMoves === undefined ? 0 : possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length
        const newBallData = {}
        Object.keys(state.collection[idx].balls).forEach(b => {
            const ballData = state.collection[idx].balls[b]
            if (ballData.disabled || ballData.isOwned) {
                newBallData[b] = ballData
            } else {
                const newBallParticularData = {...ballData, isOwned: true, highlyWanted: undefined, pending: undefined, ...getDefaultData(globalDefault, ballDefault, state.collection[idx].balls, maxEMs, possibleEggMoves, b)}
                newBallData[b] = newBallParticularData
            }
        })
        console.log(currentTotalBallData)
        console.log(newBallData)
        state.collection[idx].balls = newBallData
        return state
    }
}

const onhandReducers = {
    setBall: (state, action) => {
        const {idx, ball} = action.payload
        state.onhand[idx].ball = ball
        state.listDisplay.onhand = state.listDisplay.onhand.map(p => {
            if (p._id === state.onhand[idx]._id) {p.ball = ball}
            return p 
        })
        return state
    },
    setGender: (state, action) => {
        const {idx, gender} = action.payload
        state.onhand[idx].gender = gender
        return state
    },
    setPokemonSpecies: (state, action) => {
        const {id, imgLink, pokemonData, sortingOptions} = action.payload
        const idxInTotalList = state.onhand.findIndex((p) => p._id === id)
        const idxInDisplay = state.listDisplay.onhand.findIndex((p) => p._id === id)
        state.onhand[idxInTotalList] = {_id: state.onhand[idxInTotalList]._id, imgLink,  ...pokemonData}
        state.listDisplay.onhand[idxInDisplay] = {_id: state.listDisplay.onhand[idxInDisplay]._id, imgLink,  ...pokemonData}
        if (sortingOptions.reorder) {
            state.onhand = sortOnHandList(sortingOptions.sortFirstBy, sortingOptions.default, sortingOptions.ballOrder, state.onhand)
            state.listDisplay.onhand = sortOnHandList(sortingOptions.sortFirstBy, sortingOptions.default, sortingOptions.ballOrder, state.listDisplay.onhand)
        } 
        return state
    },
    setQty: (state, action) => {
        const {idx, qty} = action.payload
        state.onhand[idx].qty = qty
        state.listDisplay.onhand = state.listDisplay.onhand.map(p => {
            if (p._id === state.onhand[idx]._id) {p.qty = qty}
            return p 
        }) //need to do this so by pokemon view changes are updated immediately
        return state
    },
}

export {collectionReducers, onhandReducers}