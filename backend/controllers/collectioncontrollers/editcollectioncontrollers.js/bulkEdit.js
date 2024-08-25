import Collection from '../../../models/collections.js'
import { sortOnHandList } from '../../../common/sortingfunctions/onhandsorting.mjs'

export default async function bulkEdit(req, res) {
    const {bulkEdit, idOfPokemon, onhandPokemon} = req.body
    const {id} = req.params
    
    const collection = await Collection.findById(id)

    if (onhandPokemon === true) {
        const onhandSortingOptions = collection.options.sorting.onhand
        const indexOfPokemon = collection.onHand.findIndex(ohPoke => ohPoke._id.toString() === idOfPokemon)
        collection.onHand[indexOfPokemon] = bulkEdit
        // await Collection.updateOne({
        //     _id: id,
        //     "onHand._id": idOfPokemon
        //     }, { 
        //         $set: {['onHand.$']: bulkEdit} 
        //     }
        // )
        if (onhandSortingOptions.reorder === true) {
            collection.onHand = sortOnHandList(onhandSortingOptions.sortFirstBy, onhandSortingOptions.default, onhandSortingOptions.ballOrder, collection.onHand)
            
        }
        await collection.save()
    } else {}

    res.end()
}