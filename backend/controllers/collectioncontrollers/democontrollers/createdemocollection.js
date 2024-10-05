import { getAvailableHomeGames, getPossibleEggMoves, getImgLink, getPossibleGender } from "../../../utils/schemavirtuals/collectionvirtuals.js"
import { getCollectionProgressPercent } from "../../../models/postpremiddleware.js"
import CollectionClass from "../../../utils/createCollection.js"

export default async function createNewDemoCollection(req, res) {
    const {newCollectionInfo, type} = req.body
    const collectionData = new CollectionClass(undefined, newCollectionInfo)
    const conditionalTopLevelVirtuals = collectionData.gen === 'home' ? {availableGamesInfo: getAvailableHomeGames(collectionData.ownedPokemon)} : {eggMoveInfo: getPossibleEggMoves(collectionData.ownedPokemon, collectionData.gen)}
    const collectionWithVirtuals = {
        ...collectionData,
        ...conditionalTopLevelVirtuals,
        progress: getCollectionProgressPercent(collectionData),
        ownedPokemon: collectionData.ownedPokemon.map(p => {return {...p, imgLink: getImgLink(p), possibleGender: getPossibleGender(p)}}),
        onHand: collectionData.onHand.map(p => {return {...p, imgLink: getImgLink(p)}})
    }
    return res.json(collectionWithVirtuals)
}