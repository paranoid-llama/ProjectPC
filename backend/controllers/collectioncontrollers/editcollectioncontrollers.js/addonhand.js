import Collection from '../../../models/collections.js'
import { sortOnHandList } from '../../../common/sortingfunctions/onhandsorting.mjs'

export default async function addOnHand(req, res) {
    const {newOnHand} = req.body
    const {id} = req.params

    const collection = await Collection.findById(id)
    const addingMultipleOnhands = Array.isArray(newOnHand)
    if (addingMultipleOnhands) {
        collection.onHand = [...collection.onHand, ...newOnHand]
    } else {
        collection.onHand[collection.onHand.length] = newOnHand
    }
    const onhandSortingOptions = collection.options.sorting.onhand
    if (onhandSortingOptions.reorder === true) {
        collection.onHand = sortOnHandList(onhandSortingOptions.sortFirstBy, onhandSortingOptions.default, onhandSortingOptions.ballOrder, collection.onHand)
    }
    
    await collection.save()

    res.end()
}