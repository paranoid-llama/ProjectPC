import Collection from '../../../models/collections.js'
import { getIndividualPokemonInfo } from '../../../utils/createCollection.js'
import { getPossibleEggMoves } from '../../../utils/schemavirtuals/collectionvirtuals.js'

export default async function ownedPokemonEdit(req, res) {
    //this route handles all scope changes (including ball scope changes) and custom sorting
    const {id} = req.params
    const {getPokemonInfo, newPokemon, gen, ballScope, newOwnedCollectionList, updateEggMoves, newCollectingBalls} = req.body

    if (getPokemonInfo) {
        const newPokemonArr = getIndividualPokemonInfo(gen, newPokemon, ballScope)
        res.json(newPokemonArr)
    } else {
        const collection = await Collection.findById(id)
        collection.ownedPokemon = newOwnedCollectionList
        if (newCollectingBalls !== undefined) {
            //note: you cannot reference a subdoc when updating data this way, only top level docs. 
            collection.options = {...collection.options, collectingBalls: newCollectingBalls}
        }
        collection.save()
        if (updateEggMoves && gen !== 'home') {
            const updatedEggMoveInfo = getPossibleEggMoves(newOwnedCollectionList, gen)
            res.json(updatedEggMoveInfo)
        } else if (updateEggMoves && gen === 'home') { 
            res.json({})
        } else {
            res.end()
        }
    }
}