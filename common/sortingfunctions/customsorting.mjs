import { sortByName } from "./sortbyname.mjs"
import { sortByDexNum } from "./sortbydexnum.mjs"

function getImgLink(p) {
    if (p.name) {
        if (p.name.includes(' ') && !pokemonNamesWithSpaces.includes(p.name)) {
            if (regionalFormRegions.map((region) => p.name.includes(region)).includes(true)) {
                if (p.name.includes('Tauros')) {
                    if (p.name.includes('(')) {
                        return `128-p-${p.name.charAt(16).toLowerCase()}`
                    }
                    return '128-p'
                }
                const modifier = p.natDexNum < 100 ? '0' : ''
                const modifiedDexNum = modifier + p.natDexNum
                return modifiedDexNum + `-${p.name.charAt(0).toLowerCase()}`
            } else if (p.name.includes('(')) {
                const startIndex = p.name.indexOf('(') + 1
                if (p.name.includes('Pumpkaboo') || p.name.includes('Rockruff')) {
                    if (p.name.includes('Small')) {
                        return p.natDexNum + `-sm`
                    }
                    if (p.name.includes('Average')) {
                        return `${p.natDexNum}`
                    }
                    return p.natDexNum + `-${p.name.charAt(startIndex).toLowerCase()}`
                } 
                if (p.name.includes('Deerling')) {
                    return p.natDexNum + `-${p.name.charAt(startIndex).toLowerCase() + p.name.slice(startIndex + 1, startIndex + 3)}`
                } else if (p.name.includes('Oricorio')) {
                    if (p.name.includes("Pa'u")) {
                        return p.natDexNum + '-pau'
                    }
                    else {
                        return p.natDexNum + `-${p.name.charAt(startIndex).toLowerCase()}`
                    }
                } else if (p.name.includes('Alcremie')) {
                    //Alcremie (Strawberry Matcha Cream)
                    //         ^          ^      ^
                    //      startindex   2ndspac 3rdspace
                    const indexOfSecondSpace = p.name.indexOf(' ', startIndex)
                    
                    const indexOfThirdSpace = p.name.indexOf(' ', indexOfSecondSpace+1)
                    const sweetName = p.name.slice(startIndex, indexOfSecondSpace).toLowerCase()
                    const creamName = p.name.slice(indexOfSecondSpace+1, indexOfThirdSpace).toLowerCase()
                    const creamSwirlId = p.name.slice(indexOfThirdSpace+1, indexOfThirdSpace+2).toLowerCase()

                    return `869-${sweetName}${creamName}${creamSwirlId}`
                } else if (p.name.includes('Vivillon')) {
                    return `666-${p.name.slice(startIndex, p.name.length-1).toLowerCase().replace(' ', '-')}`
                } else {
                    return p.natDexNum + `-${p.name.charAt(startIndex).toLowerCase()}`
                }
            }
        } else {
            const modifier = p.natDexNum < 100 && p.natDexNum >= 10 ? '0' : p.natDexNum < 10 ? '00' : ''
            const modifiedDexNum = modifier + p.natDexNum
            return modifiedDexNum
        }
    } else {
        return
    }
}

const customSortCollectionListLogic = (a, b, customSortOrder, initializeImgLink=false) => {
    if (initializeImgLink) { //need to get Ids for when we custom sort the first time ever (on collection creation in backend)
        const aId = getImgLink(a)
        const bId = getImgLink(b)
        const customSortOrderIdxs = customSortOrder.map((p, idx) => {return {...p, idx}})
        const aIdx = customSortOrderIdxs.filter(mon => mon.id === aId)[0].idx
        const bIdx = customSortOrderIdxs.filter(mon => mon.id === bId)[0].idx
        return aIdx > bIdx ? 1 : -1
    }
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

export {customSortCollectionListLogic, customSortChanges, sortList}