import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const ownedPokemonEdit = async(gen, newOwnedCollectionList, collectionId, getPokemonInfo=false, newPokemon=[], ballScope=[], newCollectingBalls=[]) => {
    if (getPokemonInfo) {
        const addedPokemonReq = await fetch(`${backendurl}/collections/${collectionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'ownedPokemonEdit', newOwnedCollectionList, getPokemonInfo, newPokemon, gen, ballScope}) //implied will update egg move data
        }).then(async(data) => {return await handleApiResponse(data, true)})
        return addedPokemonReq
    } else {
        if (newCollectingBalls.length !== 0) { 
            const res = await fetch(`${backendurl}/collections/${collectionId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({editType: 'ownedPokemonEdit', gen, newOwnedCollectionList, newCollectingBalls})
            }).then(async(data) => {return await handleApiResponse(data)})

            return res
        } else {
            const res = await fetch(`${backendurl}/collections/${collectionId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({editType: 'ownedPokemonEdit', gen, newOwnedCollectionList})
            }).then(async(data) => {return await handleApiResponse(data)})
            
            return res
        }
        
    }
}

export {ownedPokemonEdit}