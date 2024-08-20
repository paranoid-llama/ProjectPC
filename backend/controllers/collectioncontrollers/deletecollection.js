import Collection from "../../models/collections.js";

export default async function deleteCollectionController(req, res) {
    const collectionExists = await Collection.findById(req.params.id) !== null
    if (!collectionExists) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find a collection with this ID!`
        exception.status = 404
        return res.status(404).send(exception)
    }
    await Collection.findByIdAndDelete(req.params.id)
    res.end()
}