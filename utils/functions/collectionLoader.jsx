const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function collectionLoader({params}, dispatch, editPage, initializeState, initList, initCol, initOnhand, initOptions) {
    const collection = await fetch(`${backendurl}/collections/${params.id}`)
                            .then(async(res) => {
                                const data = await res.json()
                                if (res.ok) {return data} 
                                else {throw data}
                            })
    if (initializeState) {
        dispatch(initList({collection: collection.ownedPokemon, onhand: collection.onHand, updatedEggMoveInfo: collection.eggMoveInfo, updatedHomeGames: collection.availableGamesInfo, resetCollectionFilters: true, resetOnHandFilters: true}))
        if (editPage) {
            dispatch(initCol(collection.ownedPokemon))
            dispatch(initOnhand(collection.onHand))
            dispatch(initOptions({...collection.options, collectionName: collection.name}))
        }
    }
    return collection
}