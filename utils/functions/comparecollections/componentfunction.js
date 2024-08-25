import { compareCollections } from "./comparison";
import getUserCollectionData from "../backendrequests/getusercollectiondata";

const startComparison = (fullUserCollectionData, ownerCollectionData, opts, advOpts, userColData=undefined) => {
    // const fullUserCollectionData = userColData === undefined ? await getUserCollectionData(selectedColId) : userColData
    const userEMInfo = fullUserCollectionData.eggMoveInfo === undefined ? {} : fullUserCollectionData.eggMoveInfo
    const ownerEMInfo = ownerCollectionData.eggMoveInfo === undefined ? {} : ownerCollectionData.eggMoveInfo
    const ignoreEMs = fullUserCollectionData.gen === 'home' || ownerCollectionData.gen === 'home'
    const comparisonResult = compareCollections(fullUserCollectionData, ownerCollectionData, opts, advOpts, userEMInfo, ownerEMInfo, ignoreEMs)
    return comparisonResult
}

export default startComparison