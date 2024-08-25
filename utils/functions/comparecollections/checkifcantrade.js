import { homeCompatibleGames } from "../../../common/infoconstants/miscconstants.mjs"

export function checkIfCanTrade(collection, loggedInCollection) {
    const typeMatches = collection.type === loggedInCollection.type
    const genMatches = (collection.gen === loggedInCollection.gen && typeMatches)
    const oneHomeCollection = collection.gen === 'home' || loggedInCollection.gen === 'home'
    if (oneHomeCollection && typeMatches && !genMatches) {
        const otherCollection = collection.gen === 'home' ? loggedInCollection : collection
        const otherCollectionGen = isNaN(parseInt(otherCollection.gen)) ? otherCollection.gen : parseInt(otherCollection.gen)
        const checkCompatibility = homeCompatibleGames.filter(data => (data.game === otherCollectionGen && otherCollectionGen !== 7))[0]
        const homeCompatible = checkCompatibility !== undefined && checkCompatibility.compatible
        return homeCompatible
    } else {
        return genMatches
    }
}