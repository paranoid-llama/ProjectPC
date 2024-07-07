import Collection from "../../models/collections.js";
import { getPokemonGroups } from "../../utils/pokemongroups/getpokemongroups.js";

export async function getCollectionController(req, res) {
    const collection = await Collection.findById(req.params.id).populate({path: 'owner'})
    res.json(collection)
}

export async function retrievePokemonGroups(req, res) {
    const {gen} = req.query
    const pokemonGroups = getPokemonGroups(gen)
    res.json(pokemonGroups)
}