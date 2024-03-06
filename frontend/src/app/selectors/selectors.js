import {createSelector} from '@reduxjs/toolkit'

const selectCollectionList = (state) => {
    return state.collection
}

const selectOnHandList = (state) => {
    return state.onhand
}

const selectPokemonIdentifier = (state, id) => id

const selectCollectionIdx = (state, id) => {
    const idx = state.collection.map((p, idx) => {return (p.imgLink === id ? idx : undefined)}).filter(p => p !== undefined)[0]
    return idx
}

const selectOnHandPokemonIdx = (state, id) => {
    const idx = state.onhand.map((p, idx) => {return (p._id === id ? idx : undefined)}).filter(p => p !== undefined)[0]
    return idx
}

const seeSelectedId = (state) => {
    return state.editmode.selected
}

const selectListFromListType = (state) => {
    if (state.editmode.listType === 'collection') {
        return state.collection
    } else if (state.editmode.listType === 'onHand') {
        return state.onhand
    }
}
const selectPokemon = (state, pokemon) => pokemon
const selectBall = (state, ball) => ball


const seeIfPokemonIsSelected = createSelector([seeSelectedId, selectPokemonIdentifier], (selectedId, id) => {
    return id === selectedId
})

const selectCollectionPokemon = createSelector([selectCollectionList, selectCollectionIdx], (collectionList, idx) => {
    return collectionList[idx]
})

const selectOnHandPokemon = createSelector([selectOnHandList, selectOnHandPokemonIdx], (onhandList, onhandIdx) => {
    return onhandList[onhandIdx]
})

const selectIdxOfMon = createSelector([selectListFromListType, selectPokemon], (list, pokemon) => {
    const idx = list.indexOf(pokemon)
    return idx
})

const selectBallProgress = createSelector([selectCollectionList, selectBall], (list, ball) => {
    if (list.length === undefined) { //showCollection page sets initial state on launch which makes first render have an empty list array. this prevents the selector from throwing an error
        if (ball === 'total') {
            return '0/0'
        }
        return {display: '0/0', percent: 0}
    }
    if (ball === 'total') {
        let totalToCollect = 0
        let totalCollected = 0
        list.forEach(p => {
            const ballsToCollect = Object.keys(p.balls)
            for (let ball of ballsToCollect) {
                totalToCollect +=1
                if (p.balls[ball].isOwned === true) {
                    totalCollected+=1
                }
            }
        })
        const ballProgress = `${totalCollected}/${totalToCollect}`
        return ballProgress
    }
    const filteredList = list.filter(p => p.balls[ball] !== undefined)
    const totalToCollect = filteredList.length
    const totalCollected = filteredList.filter(p => p.balls[ball].isOwned === true).length
    const ballProgress = {display: `${totalCollected}/${totalToCollect}`, percent: (totalCollected/totalToCollect)*100}
    return ballProgress
})

export {seeIfPokemonIsSelected, selectCollectionPokemon, selectOnHandPokemon, selectIdxOfMon, selectBallProgress}