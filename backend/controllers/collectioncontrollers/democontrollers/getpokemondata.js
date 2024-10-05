import { getIndividualPokemonInfo } from '../../../utils/createCollection.js'
import { getImgLink, getPossibleGender, getPossibleEggMoves, getAvailableHomeGames } from '../../../utils/schemavirtuals/collectionvirtuals.js'

export default async function getIndividualPokemonObject(req, res) {
    const {newPokemon, gen, ballScope, newOwnedCollectionList, newCollectingBalls, demoCollectionData} = req.body
    const newPokemonArr = getIndividualPokemonInfo(demoCollectionData.gen, newPokemon, ballScope)
    const newAddedPokemonState = newPokemonArr.map(mon => {
        return {...mon, imgLink: getImgLink(mon), possibleGender: getPossibleGender(mon)}
    })
    const updatedEggMoves = (demoCollectionData.gen !== 'home') ? getPossibleEggMoves([...demoCollectionData.ownedPokemon, ...newAddedPokemonState], demoCollectionData.gen) : {}
    const updatedHomeGames = (demoCollectionData.gen === 'home') ? getAvailableHomeGames([...demoCollectionData.ownedPokemon, ...newAddedPokemonState]) : {}
    res.json({newPokemon: newAddedPokemonState, updatedEggMoves, updatedHomeGames})
    
}