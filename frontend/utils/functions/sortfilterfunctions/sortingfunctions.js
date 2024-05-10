import { multipleDexNumAndSpaceHavingPokemon, regionIdentifiers, apriballs } from "../../../src/infoconstants"

const sortByDexNumLogic = (a, b, order) => {
    if (order === 'NatDexNumL2H') {
        if (a.natDexNum > b.natDexNum) {
            return 1
        }
        if (a.natDexNum < b.natDexNum) {
            return -1
        }
        if (a.natDexNum === b.natDexNum) {//ensures regional and alternate form pokemon are listed after their regular forms
            if (a.name.includes(" ") && b.name.includes(" ")) {
                return multipleDexNumAndSpaceHavingPokemon.includes(a.name) ? -1 : a.name.localeCompare(b.name)
            } else if (b.name.includes(" ")){
                return -1
            } else if (a.name.includes(" ")) {
                return 1
            } else {
                return 0
            }
        }
        return 0
    } else {
        if (a.natDexNum > b.natDexNum) {
            return -1
        }
        if (a.natDexNum < b.natDexNum) {
            return 1
        }
        if (a.natDexNum === b.natDexNum) {//ensures regional and alternate form pokemon are listed BEFORE their regular forms (UNTESTED)
            if (a.name.includes(" ") && b.name.includes(" ")) {
                return multipleDexNumAndSpaceHavingPokemon.includes(a.name) ? 1 : b.name.localeCompare(a.name)
            } else if (b.name.includes(" ")){
                return 1
            } else {
                return -1
            }
        }
        return 0
    }
}

const sortByDexNum = (order='NatDexNumL2H', list) => {
    const sortedList = list.slice().sort((a, b) => sortByDexNumLogic(a, b, order))
    return sortedList
}

const sortByNameLogic = (a, b, order) => {
    if (order === 'A2Z') {
        const aIsRegional = regionIdentifiers.map(id => a.name.includes(id)).includes(true)
        const bIsRegional = regionIdentifiers.map(id => b.name.includes(id)).includes(true)
        const aNameComparator = aIsRegional ? a.name.slice(a.name.indexOf(" ")+1) : a.name
        const bNameComparator = bIsRegional ? b.name.slice(b.name.indexOf(" ")+1) : b.name
        const comparingOriginalFormMonToRegional = aIsRegional && a.name.includes(b.name) || bIsRegional && b.name.includes(a.name)
        // const comparingPokemonToTheirRegional = (aIsRegional && a.name.slice(a.name.indexOf(" ")+1) === b.name) || (bIsRegional && b.name.slice(b.name.indexOf(" ")+1) === a.name)
        if (comparingOriginalFormMonToRegional) {
            return aIsRegional ? 1 : -1
        }
        if (aNameComparator < bNameComparator) {
            return -1;
        }
        if (aNameComparator > bNameComparator) {
            return 1;
        }
        return 0;
    } else {
        const aIsRegional = regionIdentifiers.map(id => a.name.includes(id)).includes(true)
        const bIsRegional = regionIdentifiers.map(id => b.name.includes(id)).includes(true)
        const aNameComparator = aIsRegional ? a.name.slice(a.name.indexOf(" ")+1) : a.name
        const bNameComparator = bIsRegional ? b.name.slice(b.name.indexOf(" ")+1) : b.name
        const comparingOriginalFormMonToRegional = aIsRegional && a.name.includes(b.name) || bIsRegional && b.name.includes(a.name)
        if (comparingOriginalFormMonToRegional) {
            return aIsRegional ? -1 : 1
        }
        if (aNameComparator < bNameComparator) {
            return 1;
        }
        if (aNameComparator > bNameComparator) {
            return -1;
        }
        return 0;
    }
}

const sortByName = (order='A2Z', list) => {
    const sortedList = list.slice().sort((a, b) => sortByNameLogic(a, b, order))
    return sortedList
}

const sortByBallLogic = (a, b, ballOrder) => {
    const aBallIdx = ballOrder.indexOf(a.ball)
    const bBallIdx = ballOrder.indexOf(b.ball)
    if (aBallIdx < bBallIdx) {
        return -1
    }
    if (aBallIdx > bBallIdx) {
        return 1
    } 
    return 0
}

const sortOnHandList = (firstSort='pokemon', pokemonSortKey, ballOrder, list) => {
    const sortedList = list.slice().sort((a, b) => {
        const sortingMonsByDexNum = pokemonSortKey.includes('NatDexNum')
        const firstSortOperation = firstSort === 'pokemon' ? sortingMonsByDexNum ? sortByDexNumLogic(a, b, pokemonSortKey) : sortByNameLogic(a, b, pokemonSortKey) : sortByBallLogic(a, b, ballOrder)
        if (firstSortOperation === 0) {
            const secondSortOperation = firstSort === 'pokemon' ? sortByBallLogic(a, b, ballOrder) : sortingMonsByDexNum ? sortByDexNumLogic(a, b, pokemonSortKey) : sortByNameLogic(a, b, pokemonSortKey)
            return secondSortOperation
        }
        return firstSortOperation
    })
    return sortedList
}

const customSortCollectionListLogic = (a, b, customSortOrder) => {
    const customSortOrderIdxs = customSortOrder.map((p, idx) => {return {...p, idx}})
    const aIdx = customSortOrderIdxs.filter(mon => mon.id === a.imgLink)[0].idx
    const bIdx = customSortOrderIdxs.filter(mon => mon.id === b.imgLink)[0].idx
    return aIdx > bIdx ? 1 : -1
}

//this is different since this is custom sorting AFTER a collection is created, where certain mons are enabled or disabled and stay in the list.
//custom sort only sorts the enabled pokemon so we need extra logic to ensure the disabled mons stay relatively in the same position as before
const customSortChanges = (customSortOrder, collectionList) => {
    const onlyEnabledMons = collectionList.filter(mon => mon.disabled === undefined)
    const onlyDisabledMons = collectionList.map((mon, idx) => {return {...mon, idx}}).filter(mon => mon.disabled === true)
    const newCollectionList = onlyEnabledMons.sort((a, b) => {
        const aSortOrder = customSortOrder.filter(mon => mon.id === a.imgLink)[0].idx
        const bSortOrder = customSortOrder.filter(mon => mon.id === b.imgLink)[0].idx
        return aSortOrder > bSortOrder ? 1 : -1
    })
    onlyDisabledMons.forEach(mon => {
        const idxNum = mon.idx
        delete mon.idx
        newCollectionList.splice(idxNum, 0, mon)
    })
    return newCollectionList
}

const sortList = (sortKey, list) => {
    if (sortKey === 'A2Z' || sortKey === 'Z2A') {
        return sortByName(sortKey, list)
    } else {
        return sortByDexNum(sortKey, list)
    }
}

export {sortList, sortByDexNum, sortByName, sortOnHandList, customSortCollectionListLogic, customSortChanges}