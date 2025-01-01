import { sortOnHandList } from "../../../../common/sortingfunctions/onhandsorting.mjs"
import getDefaultData from "../../../../utils/functions/defaultdata"
import newObjectId from "../../../../utils/functions/newobjectid"
import { interchangeableAltFormIds } from "../../../../common/infoconstants/pokemonconstants.mjs"
import { filterList } from "../../../../utils/functions/sortfilterfunctions/filterfunctions"
import { OHByPokemonStateUpdate } from "../../../components/collectiontable/onhandlist/onhandbypokemonupdates/ohbypokemonstateupdate"
import { randomGender } from "../../../../utils/functions/misc"
import { selectPokeIdMatches } from "../../selectors/selectpokeidmatches"

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
        Object.keys(currentTotalBallData).forEach(b => {
            const ballData = currentTotalBallData[b]
            if (ballData.disabled || ballData.isOwned) {
                newBallData[b] = ballData
            } else {
                const newBallParticularData = {...ballData, isOwned: true, highlyWanted: undefined, pending: undefined, ...getDefaultData(globalDefault, ballDefault, state.collection[idx].balls, maxEMs, possibleEggMoves, b)}
                newBallData[b] = newBallParticularData
            }
        })
        state.collection[idx].balls = newBallData
        return state
    }
}

const onhandReducers = {
    setBall: (state, action) => {
        const {idx, ball} = action.payload
        state.onhand[idx].ball = ball
        // state.listDisplay.onhand = state.listDisplay.onhand.map(p => {
        //     if (p._id === state.onhand[idx]._id) {p.ball = ball}
        //     return p 
        // })
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
        return state
    },
    setQtyByPokemon: (state, action) => {
        const {pokeId, ball, increment, customQty, removeMonFromDisplay} = action.payload
        const pokeBInColData = state.collection.filter(p => selectPokeIdMatches(p.imgLink, pokeId, p.disabled))[0]
        const onhandMons = state.onhand.map((p, idx) => {return {...p, idx}}).filter(p => (p.imgLink === pokeId && p.ball === ball))
        const addingNew = onhandMons.length === 0 && !(customQty === 0) && (customQty !== undefined || increment)
        const isAnIFormEquivalency = pokeBInColData.imgLink !== pokeId //this means that there is ALWAYS at least one onhand in the list that matches this mon
        if (addingNew) {
            //if the pokemon/ball doesnt already have a single onhand with it. 
            //handles custom qty and incrementing
            const peripherals = {...pokeBInColData.balls[ball], isOwned: undefined, default: undefined}
            const basicMonInfo = isAnIFormEquivalency ? state.onhand.filter(p => p.imgLink === pokeId)[0] : pokeBInColData
            const pData = {
                _id: newObjectId(),
                name: basicMonInfo.name,
                natDexNum: basicMonInfo.natDexNum,
                imgLink: pokeId,
                ball,
                gender: pokeBInColData.possibleGender === 'both' ? 'unknown' : pokeBInColData.possibleGender,
                ...peripherals,
                qty: (customQty) ? ((customQty <= 99) ? customQty : 99) : 1
            }
            if (customQty && customQty > 99) {
                let remainingQty = customQty-99
                const multipleOHs = [{...pData, qty: 99}]
                while (remainingQty > 0) {
                    multipleOHs.push({...pData, _id: newObjectId(), qty: remainingQty > 99 ? 99 : remainingQty})
                    remainingQty = remainingQty > 99 ? remainingQty - 99 : 0
                }
                state.onhand = [...state.onhand, ...multipleOHs]
            } else {
                state.onhand[state.onhand.length] = pData
            }
        } else if (customQty !== undefined) { //lowering the quantity via customQty
            if (customQty === 0) {
                state.onhand = state.onhand.filter(p => !(p.imgLink === pokeId && p.ball === ball))
            } else if (!increment) {
                const changeDataArr = OHByPokemonStateUpdate(onhandMons, false, pokeBInColData.balls[ball], customQty, true)
                let remainingQtyToRemove = onhandMons.map(ohP => ohP.qty).reduce((acc, cV) => acc+cV, 0) - customQty
                const newQtys = changeDataArr.map(ohId => {
                    const ohData = state.onhand.filter(p => p._id === ohId)[0]
                    if (remainingQtyToRemove === 0) {return ohData.qty}
                    if (ohData.qty < remainingQtyToRemove) {
                        remainingQtyToRemove -= ohData.qty
                        return 0
                    } else if (ohData.qty >= remainingQtyToRemove) {
                        const qtyDifference = ohData.qty - remainingQtyToRemove
                        remainingQtyToRemove = 0
                        return qtyDifference
                    }
                })
                state.onhand = state.onhand.map(p => {
                    const idx = changeDataArr.indexOf(p._id)
                    const changedQty = idx !== -1
                    if (changedQty) {
                        p.qty = newQtys[idx]
                        if (p.qty === 0) {
                            return undefined
                        }
                    }
                    return p
                }).filter(p => p !== undefined) 
            } else {
                const changeData = OHByPokemonStateUpdate(onhandMons, increment, pokeBInColData.balls[ball], customQty) //onhand id of the pokemon to increment first.
                let remainingQtyToAdd = customQty - onhandMons.map(ohP => ohP.qty).reduce((a, c) => a+c, 0) //should always be greater than 0
                // let remainingQtyToAdd = customQty //should always be greater than 0
                if (onhandMons.filter(p => p._id === changeData.id).length !== 0 && onhandMons.filter(p => p._id === changeData.id)[0].qty < 99) {
                    state.onhand = state.onhand.map((p) => {
                        const changedQty = changeData.id === p._id
                        if (changedQty) {
                            if (p.qty+remainingQtyToAdd <= 99) {
                                p.qty += remainingQtyToAdd
                                remainingQtyToAdd = 0
                            } else {
                                remainingQtyToAdd -= (99-p.qty)
                                p.qty = 99
                            }
                        }
                        return p
                    })
                }
                if (remainingQtyToAdd > 0) {
                    const peripherals = {...pokeBInColData.balls[ball], isOwned: undefined, default: undefined}
                    const pData = {
                        _id: newObjectId(),
                        name: pokeBInColData.name,
                        natDexNum: pokeBInColData.natDexNum,
                        imgLink: pokeId,
                        ball,
                        gender: pokeBInColData.possibleGender === 'both' ? 'unknown' : pokeBInColData.possibleGender,
                        ...peripherals,
                    }
                    const multipleOHs = [{...pData, qty: remainingQtyToAdd > 99 ? 99 : remainingQtyToAdd}]
                    remainingQtyToAdd = remainingQtyToAdd > 99 ? remainingQtyToAdd-99 : 0
                    while (remainingQtyToAdd > 0) {
                        multipleOHs.push({...pData, _id: newObjectId(), qty: remainingQtyToAdd > 99 ? 99 : remainingQtyToAdd})
                        remainingQtyToAdd = remainingQtyToAdd > 99 ? remainingQtyToAdd - 99 : 0
                    }
                    state.onhand = [...state.onhand, ...multipleOHs]
                }    
            }
            
        } else {
            const changeData = OHByPokemonStateUpdate(onhandMons, increment, pokeBInColData.balls[ball], customQty)
            let addNewOnHand = false
            const changeIdx = onhandMons.filter(p => p._id === changeData.id)[0].idx
            if (changeData.remove) {
                state.onhand.splice(changeIdx, 1)
            } else if (increment && state.onhand[changeIdx].qty === 99) {
                addNewOnHand = true
            } else {
                state.onhand[changeIdx].qty = increment ? state.onhand[changeIdx].qty+1 : state.onhand[changeIdx].qty-1
            }

            if (addNewOnHand) {
                const peripherals = {...pokeBInColData.balls[ball], isOwned: undefined, default: undefined}
                const basicMonInfo = isAnIFormEquivalency ? state.onhand.filter(p => p.imgLink === pokeId)[0] : pokeBInColData
                const pData = {
                    _id: newObjectId(),
                    name: basicMonInfo.name,
                    natDexNum: basicMonInfo.natDexNum,
                    imgLink: pokeId,
                    ball,
                    gender: pokeBInColData.possibleGender === 'both' ? 'unknown' : pokeBInColData.possibleGender,
                    ...peripherals,
                    qty: 1
                }
                state.onhand[state.onhand.length] = pData
            } 
        }
        if (removeMonFromDisplay) {
            state.listDisplay.onhand = state.listDisplay.onhand.filter(p => p.imgLink !== pokeId)
        }
        if (state.options.sorting.onhand.reorder) {
            state.onhand = sortOnHandList(state.options.sorting.onhand.sortFirstBy, state.options.sorting.onhand.default, state.options.sorting.onhand.ballOrder, state.onhand)
        }
        return state
    }
}

export {collectionReducers, onhandReducers}