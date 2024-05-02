import { getImgLink } from "./../schemavirtuals/collectionvirtuals.js";

function customSortCollectionListLogic(a, b, customSortOrder) {
    const aId = getImgLink(a)
    const bId = getImgLink(b)
    const customSortOrderIdxs = customSortOrder.map((p, idx) => {return {...p, idx}})
    const aIdx = customSortOrderIdxs.filter(mon => mon.id === aId)[0].idx
    const bIdx = customSortOrderIdxs.filter(mon => mon.id === bId)[0].idx
    return aIdx > bIdx ? 1 : -1
}

export {customSortCollectionListLogic}