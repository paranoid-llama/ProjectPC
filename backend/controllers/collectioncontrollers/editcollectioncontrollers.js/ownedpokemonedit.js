import Collection from '../../../models/collections.js'
import { getIndividualPokemonInfo } from '../../../utils/createCollection.js'
import { getImgLink, getPossibleGender, getPossibleEggMoves, getAvailableHomeGames } from '../../../utils/schemavirtuals/collectionvirtuals.js'
import { sortList } from '../../../common/sortingfunctions/customsorting.mjs'

export default async function ownedPokemonEdit(req, res) {
    //this route handles all scope changes (including ball scope changes) and custom sorting
    const {id} = req.params
    const {getPokemonInfo, newPokemon, gen, ballScope, newOwnedCollectionList, newCollectingBalls} = req.body
    const collection = await Collection.findById(id)
    if (getPokemonInfo) {
        const newPokemonArr = getIndividualPokemonInfo(gen, newPokemon, ballScope)
        collection.ownedPokemon = collection.options.sorting.collection.reorder ? 
            sortList(collection.options.sorting.collection.default, [...newOwnedCollectionList, ...newPokemonArr]) : [...newOwnedCollectionList, ...newPokemonArr]
        await collection.save()
        const newAddedPokemonState = newPokemonArr.map(mon => {
            return {...mon, imgLink: getImgLink(mon), possibleGender: getPossibleGender(mon)}
        })
        const updatedEggMoves = (gen !== 'home') ? getPossibleEggMoves(collection.ownedPokemon, collection.gen) : {}
        const updatedHomeGames = (gen === 'home') ? getAvailableHomeGames(collection.ownedPokemon) : {}
        res.json({newPokemon: newAddedPokemonState, updatedEggMoves, updatedHomeGames})
    } else {
        
        collection.ownedPokemon = newOwnedCollectionList
        if (newCollectingBalls !== undefined) {
            //note: you cannot reference a subdoc when updating data this way, only top level docs. 
            collection.options = {...collection.options, collectingBalls: newCollectingBalls}
        }
        collection.save()
        res.end()
    }
}