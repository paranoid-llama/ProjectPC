import { getImgLink } from "../../backend/utils/schemavirtuals/collectionvirtuals.js"
import { sortByName } from "./sortbyname.mjs"
import { sortByDexNum } from "./sortbydexnum.mjs"

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