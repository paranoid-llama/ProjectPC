const backendurl = import.meta.env.VITE_BACKEND_URL
import { defer } from "react-router"

export default async function collectionLoader({params}, dispatch, editPage, initializeState, initList, initCol, initOnhand, initOptions) {
    const collectionPromise = fetch(`${backendurl}/collections/${params.id}`).then(res => res.json())
                            // .then(async(res) => {
                            //     const data = await res.json()
                            //     if (res.ok) {return data} 
                            //     else {throw data}
                            // })
    // if (initializeState) {
    //     if (editPage) {
    //         dispatch(initCol(collection.ownedPokemon))
    //         dispatch(initOnhand(collection.onHand))
    //         dispatch(initOptions({...collection.options, collectionName: collection.name}))
    //     }
    //     dispatch(initList({collection: collection.ownedPokemon, onhand: collection.onHand, updatedEggMoveInfo: collection.eggMoveInfo, updatedHomeGames: collection.availableGamesInfo, resetCollectionFilters: true, resetOnHandFilters: true}))
    // }
    return defer({
        resolvedData: collectionPromise
    })
}

export const initializeCollectionPageState = (collection, tools) => {
    const {dispatch, initList, initCol, initOnhand, initOptions, editPage} = tools
    // if (editPage) {
    //     dispatch(initCol(collection.ownedPokemon))
    //     dispatch(initOnhand(collection.onHand))
    //     dispatch(initOptions({...collection.options, collectionName: collection.name}))
    // }
    dispatch(initList({collection: collection.ownedPokemon, onhand: collection.onHand, updatedEggMoveInfo: collection.eggMoveInfo, updatedHomeGames: collection.availableGamesInfo, resetCollectionFilters: true, resetOnHandFilters: true}))
}

export async function collectionLoaderEditPage({params}, dispatch, initList, initCol, initOnhand, initOptions) {
    const collection = await fetch(`${backendurl}/collections/${params.id}`)
                            .then(async(res) => {
                                const data = await res.json()
                                if (res.ok) {return data} 
                                else {throw data}
<<<<<<< HEAD
                            }) 

    dispatch(initCol(collection.ownedPokemon))
    dispatch(initOnhand(collection.onHand))
    dispatch(initOptions({...collection.options, collectionName: collection.name}))
    dispatch(initList({collection: collection.ownedPokemon, onhand: collection.onHand, updatedEggMoveInfo: collection.eggMoveInfo, updatedHomeGames: collection.availableGamesInfo, resetCollectionFilters: true, resetOnHandFilters: true}))
        
=======
                            })
    if (initializeState) {
        if (editPage) {
            dispatch(initCol(collection.ownedPokemon))
            dispatch(initOnhand(collection.onHand))
            dispatch(initOptions({...collection.options, collectionName: collection.name}))
        }
        dispatch(initList({collection: collection.ownedPokemon, onhand: collection.onHand, updatedEggMoveInfo: collection.eggMoveInfo, updatedHomeGames: collection.availableGamesInfo, resetCollectionFilters: true, resetOnHandFilters: true}))
    }
>>>>>>> da117561453ada333ccb4dac2d33ced7e28f4916
    return collection
}