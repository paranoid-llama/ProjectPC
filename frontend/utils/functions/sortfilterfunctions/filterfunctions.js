import { apriballs, generations, findGenByDexNum } from "../../../../common/infoconstants/miscconstants.mjs"
import { sortList } from "../../../../common/sortingfunctions/customsorting.mjs"

//checks if the current filter list has any of a specified type of filter. useful for accounting for refiltering when we're adding a second of a particular type of filter
const checkForTypeOfFilter = (activeFilters, filterType) => {
    const arrayToUse = filterType === 'gen' ? generations : filterType === 'ball' ? apriballs : ['highlyWanted', 'pending']
    const arr = arrayToUse.map((item) => {
        if (activeFilters.includes(item)) {
            return true
        }
        else {
            return false
        }
    })
    const typeOfFilterPresent = arr.includes(true)
    return typeOfFilterPresent
}

const filterMultipleKeys = (totalList, genKeys, ballKeys, otherKeys, currentSortKey, listType) => {
    const filteredList = []
    if (genKeys.length !== 0) {
        const filteredByGenList = totalList.filter((pokemon) => {
            for (let key of genKeys) {
                if (key === pokemon.gen || key === findGenByDexNum(pokemon.natDexNum)) {
                    return true
                }
                if (genKeys[genKeys.length-1] === key) {
                    return false //ends loop after the last key and ensures it can keep looping by not returning a value until it does
                }
            }
        })
        filteredList.push(...filteredByGenList)
    } else {
        filteredList.push(...totalList)
    }

    // only other misc filters currently are highly wanted/pending in trade tags, which are exclusively non-owned ball pokemon (either/or ball/tag filters)
    if (ballKeys.length !== 0) {
        const filteredByOwnedBallList = filteredList.filter((pokemon) => {
            if (listType === 'collection') {
                const booleanList = ballKeys.map((key) => pokemon.balls[key] !== undefined && pokemon.balls[key].isOwned === true)
                const hasAllFilteredBalls = !booleanList.includes(false)
                return hasAllFilteredBalls
            } else {
                const booleanList = ballKeys.map((key) => pokemon.ball === key)
                const hasAnyFilteredBalls = booleanList.includes(true)
                return hasAnyFilteredBalls
            }
        })
        return currentSortKey === '' ? filteredByOwnedBallList : sortList(currentSortKey, filteredByOwnedBallList)
    } else if (otherKeys.length !== 0) {
        const filteredByTagList = filteredList.filter((pokemon) => {
            const booleanList = Object.values(pokemon.balls).map((ball) => ball[otherKeys[0]] !== undefined)
            const hasTagKey = booleanList.includes(true)
            return hasTagKey
        })
        return currentSortKey === '' ? filteredByTagList : sortList(currentSortKey, filteredByTagList)
    } 

    return currentSortKey === '' ? filteredList : sortList(currentSortKey, filteredList)
}

const filterByGen = (list, genFilter, listType) => {
    //for some reason i had gen as a key value for pokemon in the collection array but not for the ones in the onhand array. i did a lazy workaround.
    if (listType === 'collection') {
        return list.filter((pokemon) => pokemon.gen === genFilter)
    } else {
        return list.filter((pokemon) => findGenByDexNum(pokemon.natDexNum) === genFilter)
    }
    
}

const filterByOwnedBall = (list, ballFilter, listType) => {
    const newList = listType === 'collection' ? list.filter((pokemon) => pokemon.balls[ballFilter] !== undefined && pokemon.balls[ballFilter].isOwned === true) : 
                        list.filter((pokemon) => pokemon.ball === ballFilter)
    return newList
}

const filterByTag = (list, tagFilter) => {
    const newList = list.filter((pokemon) => {
        const balls = Object.values(pokemon.balls)
        const arr = balls.map(b => b[tagFilter] !== undefined ? true : false)
        const hasTag = arr.includes(true)
        return hasTag
    }) 
    return newList
}

const filterList = (list=[], filterKey, filterCategory, listType, totalList=[], reFilterList=false, filterKeys=[], currentSortKey='') => {
    if (reFilterList) { //refer to filter.jsx notes for when refiltering the list (taking the total list and re-adding filters) is required
        const ballFilters = filterKeys.filter(key => apriballs.includes(key))
        const genFilters = filterKeys.filter(key => generations.includes(key))
        const otherFilters = filterKeys.filter(key => (!generations.includes(key) && !apriballs.includes(key)))
        const filteredList = filterMultipleKeys(totalList, genFilters, ballFilters, otherFilters, currentSortKey, listType)
        return filteredList
    }
    if (filterCategory === 'ballFilters') {
        return filterByOwnedBall(list, filterKey, listType)
    } else if (filterCategory === 'genFilters') {
        return filterByGen(list, filterKey, listType)
    } else if (filterCategory === 'otherFilters') {
        return filterByTag(list, filterKey)
    }
}

export {filterList, checkForTypeOfFilter}