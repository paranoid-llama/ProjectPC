export default async function collectionLoader({params}, dispatch, editPage, initializeState, initList, initCol, initOnhand, initOptions) {
    const collection = await fetch(`http://localhost:3000/collections/${params.id}`)
                            .then((res) => {
                                if (res.ok) {return res.json()} 
                                else {console.log('UH OH ERROR')}
                            })
    if (initializeState) {
        dispatch(initList({collection: collection.ownedPokemon, onhand: collection.onHand, updatedEggMoveInfo: collection.eggMoveInfo, resetCollectionFilters: true, resetOnHandFilters: true}))
        if (editPage) {
            dispatch(initCol(collection.ownedPokemon))
            dispatch(initOnhand(collection.onHand))
            dispatch(initOptions({...collection.options, collectionName: collection.name}))
        }
    }
    return collection
}