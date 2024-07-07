import Collection from '../../../models/collections.js'

export default async function deleteOnHand(req, res) {
    const {pokemonId} = req.body
    const {id} = req.params
    await Collection.updateOne({
        _id: id
        }, {
            $pull: {"onHand": {"_id": pokemonId}}
        }, 
        { multi: true }
    )
    res.end()
}