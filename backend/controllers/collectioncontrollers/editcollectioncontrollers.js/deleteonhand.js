import Collection from '../../../models/collections.js'

export default async function deleteOnHand(req, res) {
    const {pokemonId} = req.body
    const {id} = req.params

    const multipleDeletes = Array.isArray(pokemonId)

    if (multipleDeletes) {
        const collection = await Collection.findById(id)
        collection.onHand = collection.onHand.filter(p => !pokemonId.includes(p._id.toString()))
        await collection.save()
    } else {
       await Collection.updateOne({
            _id: id
            }, {
                $pull: {"onHand": {"_id": pokemonId}}
            }, 
            { multi: true }
        ) 
    }
    
    res.end()
}