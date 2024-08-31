import {createSelector, createDraftSafeSelector} from '@reduxjs/toolkit'
import { getBallProgress } from '../../../utils/functions/ballprogresscircle/ballprogressstate'

const selectCollectionList = (state) => {
    return state.collectionState.collection
}

const selectEnabledPokemonInCollectionList = (state) => {
    return state.collectionState.collection[0] === undefined ? state.collectionState.collection : state.collectionState.collection.filter(mon => mon.disabled === undefined) 
}

const selectOnHandList = (state) => {
    return state.collectionState.onhand
}

const selectPokemonIdentifier = (state, id) => id

const selectCollectionIdx = (state, id) => {
    const idx = state.collectionState.collection.map((p, idx) => {return (p.imgLink === id ? idx : undefined)}).filter(p => p !== undefined)[0]
    return idx
}

const selectOnHandPokemonIdx = (state, id) => {
    const idx = state.collectionState.onhand.map((p, idx) => {return (p._id === id ? idx : undefined)}).filter(p => p !== undefined)[0]
    return idx
}

const seeSelectedId = (state) => {
    return state.editmode.selected
}

const selectListFromListType = (state) => {
    if (state.editmode.listType === 'collection') {
        return state.collectionState.collection
    } else if (state.editmode.listType === 'onHand') {
        return state.collectionState.onhand
    }
}
const selectPokemon = (state, pokemon) => pokemon
const selectBall = (state, ball) => ball
const selectScopeTotal = (state, scopeTotal) => scopeTotal

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

const selectBallProgress = createSelector([selectEnabledPokemonInCollectionList, selectBall], (list, ball) => {
    return getBallProgress(list, ball)
})

const selectScopeFormData = createSelector([selectEnabledPokemonInCollectionList, selectScopeTotal], (list, scopeTotal) => {
    const listOfIds = list.filter(mon => mon.disabled === undefined).map(mon => mon.imgLink)
    const formData = {}
    const formDataMonFormat = (monInfo) => {return {name: monInfo.name, natDexNum: monInfo.natDexNum, id: monInfo.imgLink}}
    Object.keys(scopeTotal).forEach(group => {
        const hasSubGroups = !Array.isArray(scopeTotal[group])
        const uninitializedGroup = formData[group] === undefined
        if (uninitializedGroup && hasSubGroups) {
            formData[group] = {}
        }
        if (hasSubGroups) {
            Object.keys(scopeTotal[group]).forEach(subGroup => {
                const selectedMonArr = scopeTotal[group][subGroup].filter(mon => listOfIds.includes(mon.imgLink)).map(monInfo => formDataMonFormat(monInfo))
                formData[group][subGroup] = selectedMonArr
            }) 
        } else {
            const selectedMonArr = scopeTotal[group].filter(mon => listOfIds.includes(mon.imgLink)).map(monInfo => formDataMonFormat(monInfo))
            formData[group] = selectedMonArr
        }
    })
    return formData
})

const selectExcludedBallCombos = createSelector([selectEnabledPokemonInCollectionList], (filteredList) => {
    const excludedBallCombos = {}
    filteredList.forEach(mon => {
        Object.keys(mon.balls).forEach(ball => {
            if (mon.balls[ball].disabled === true) {
                if (excludedBallCombos[mon.name] === undefined) {
                    excludedBallCombos[mon.name] = {natDexNum: mon.natDexNum, imgLink: mon.imgLink, excludedBalls: [ball]}
                } else {
                    excludedBallCombos[mon.name].excludedBalls = [...excludedBallCombos[mon.name].excludedBalls, ball]
                }
            }
        })
    })
    return excludedBallCombos
})

const selectCustomSortData = createSelector([selectEnabledPokemonInCollectionList], (filteredList) => {
    return filteredList.map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}})
})

export {seeIfPokemonIsSelected, selectCollectionPokemon, selectOnHandPokemon, selectIdxOfMon, selectBallProgress, selectScopeFormData, selectExcludedBallCombos, selectCustomSortData}