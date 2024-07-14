import Collection from "../../models/collections.js";
import { getPokemonGroups } from "../../utils/pokemongroups/getpokemongroups.js";

export async function getCollectionController(req, res) {
    const collection = await Collection.findById(req.params.id).populate({path: 'owner'})
    if (collection === null) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find a collection with this ID!`
        exception.status = 404
        return res.status(404).send(exception)
    }
    res.json(collection)
}

export async function retrievePokemonGroups(req, res) {
    const {gen} = req.query
    const pokemonGroups = getPokemonGroups(gen)
    res.json(pokemonGroups)
}