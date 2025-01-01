import {createSelector, createDraftSafeSelector} from '@reduxjs/toolkit'
import { getBallProgress } from '../../../utils/functions/ballprogresscircle/ballprogressstate'
import { apriballs } from '../../../common/infoconstants/miscconstants.mjs'
import { selectPokeIdMatches } from './selectpokeidmatches'
import { matchOnHandInList } from '../../components/collectiontable/onhandlist/onhandbypokemonupdates/ohbypokemonstateupdate'

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
    const idx = state.collectionState.collection.map((p, idx) => selectPokeIdMatches(p.imgLink, id, p.disabled) ? idx : undefined).filter(p => p !== undefined)[0]
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
const selectSelectedBall = (state) => state.editmode.selectedBall
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

const selectOnHandPokemonByPokemon = createSelector([selectOnHandList, selectPokemonIdentifier], (onhandList, id) => {
    const allOhOfPokemon = onhandList.filter(p => p.imgLink === id)
    const data = {name: allOhOfPokemon[0].name, imgLink: allOhOfPokemon[0].imgLink, natDexNum: allOhOfPokemon[0].natDexNum}
    const idSetsAndNums = {}
    allOhOfPokemon.forEach(ohP => {
        if (!idSetsAndNums[ohP.ball]) {
            idSetsAndNums[ohP.ball] = {ids: [ohP._id], numTotal: ohP.qty, numNonHA: (ohP.isHA !== undefined && !ohP.isHA) ? ohP.qty : 0, numReserved: ohP.reserved !== undefined ? ohP.reserved : 0}
        } else {
            idSetsAndNums[ohP.ball].ids = [...idSetsAndNums[ohP.ball].ids, ohP._id]
            idSetsAndNums[ohP.ball].numTotal += ohP.qty
            idSetsAndNums[ohP.ball].numNonHA += (ohP.isHA !== undefined && !ohP.isHA) ? ohP.qty : 0
            idSetsAndNums[ohP.ball].numReserved += ohP.reserved !== undefined ? ohP.reserved : 0
        }
    })
    return {...data, idSetsAndNums}
})

const selectAllOnHandsOfPokemon = createSelector([selectCollectionList, selectOnHandList, selectPokemonIdentifier, selectSelectedBall], (colList, onhandList, id, selectedBall) => {
    const allOhOfPokemon = onhandList.filter(p => p.imgLink === id && p.ball === selectedBall)
    const pokemonInCol = colList.filter(p => selectPokeIdMatches(p.imgLink, id, p.disabled))[0]
    //pokemonInCol should never be undefined - this selector is used when they get to the edit screen, and if it was 
    //deleted from memory, then they can never make it there. will add logic to get around it just in case, anyway.
    const correspondingBallDataForInit = (pokemonInCol !== undefined && 
        pokemonInCol.balls[selectedBall] !== undefined && pokemonInCol.balls[selectedBall].disabled === undefined && 
        pokemonInCol.balls[selectedBall].isOwned) ? pokemonInCol.balls[selectedBall] : undefined
    const initId = matchOnHandInList(allOhOfPokemon, correspondingBallDataForInit, selectedBall)
    return {list: allOhOfPokemon, init: initId}
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

const selectAllowedBallsList = createSelector([selectCollectionList, selectCollectionIdx], (collectionList, idx) => {
    if (idx === undefined) {
        return []
    } else {
        return Object.keys(collectionList[idx].balls).filter(ball => collectionList[idx].balls[ball].disabled === undefined)
    }
})

const selectOwnedBallsList = createSelector([selectCollectionList, selectCollectionIdx], (collectionList, idx) => {
    if (idx === undefined) {
        return []
    } else {
        return Object.keys(collectionList[idx].balls).filter(ball => collectionList[idx].balls[ball].disabled === undefined && collectionList[idx].balls[ball].isOwned)
    }
})

//since its possible for a user to select a ball combo as owned, add an onhhand of that combo, then select it as not owned, its sometimes 
//needed to get those other on-hand only balls.
const selectOwnedBallsAndHangingOnHandBallsList = createSelector([selectCollectionList, selectOnHandList, selectPokemonIdentifier, selectCollectionIdx], (col, onhand, id, idx) => {
    const pokemonDeletedFromMemory = idx === undefined
    if (pokemonDeletedFromMemory) {
        return 'DELETED FROM MEMORY'
    }
    const allowedOwnedBalls = Object.keys(col[idx].balls).filter(ball => col[idx].balls[ball].disabled === undefined && col[idx].balls[ball].isOwned)
    const hangingOnHandBalls = onhand.map(oh => {
        if (!allowedOwnedBalls.includes(oh.ball) && oh.imgLink === id) {
            return oh.ball
        } else {return undefined}
    }).filter(b => b !== undefined)
    const step = [...allowedOwnedBalls, ...hangingOnHandBalls]
    const total = step.filter((b, idx) => step.indexOf(b) === idx)
    return total
})

const selectByPokemonOHData = createSelector([selectOnHandList, selectPokemonIdentifier], (onhand, id) => {
    const onhands = onhand.filter(p => p.imgLink === id)
    if (onhands.length === 0) {return undefined}
    // const returnData = {}
    // returnData.name = onhands[0].name
    // returnData.imgLink = onhands[0].imgLink
    // returnData.natDexNum = onhands[0].natDexNum
    const ballsData = {}
    onhands.forEach(oh => {
        if (ballsData[oh.ball] === undefined) {
            ballsData[oh.ball] = {numTotal: 0, numNonHA: 0, reserved: 0}
        }
        ballsData[oh.ball].numTotal += oh.qty
        if (oh.isHA !== undefined && !oh.isHA) {
            ballsData[oh.ball].numNonHA += oh.qty
        }
        if (oh.reserved !== undefined && oh.reserved !== 0) {
            ballsData[oh.ball].numNonHA += oh.reserved
        }
    })
    return {name: onhands[0].name, imgLink: onhands[0].imgLink, natDexNum: onhands[0].natDexNum, balls: ballsData}
})

const selectOtherOnhandReqData = createSelector([selectCollectionList, selectPokemonIdentifier], (col, id) => {
    const pData = col.filter(p => selectPokeIdMatches(p.imgLink, id, p.disabled))[0]
    return {
        possibleGender: pData.possibleGender,
        noHA: Object.values(pData.balls)[0].isHA === undefined,
        noEMs: Object.values(pData.balls)[0].EMs === undefined
    }
})

export {seeIfPokemonIsSelected, 
    selectCollectionPokemon, 
    selectOnHandPokemonIdx, 
    selectOnHandPokemon, 
    selectOnHandPokemonByPokemon,
    selectAllOnHandsOfPokemon,
    selectIdxOfMon, 
    selectBallProgress, 
    selectScopeFormData, 
    selectExcludedBallCombos, 
    selectCustomSortData,
    selectAllowedBallsList,
    selectOwnedBallsList,
    selectOwnedBallsAndHangingOnHandBallsList,
    selectByPokemonOHData,
    selectOtherOnhandReqData
}