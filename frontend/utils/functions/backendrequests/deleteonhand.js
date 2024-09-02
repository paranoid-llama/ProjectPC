import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const deleteOnHandPutRequest = async(pokemonId, collectionID, userId) => {
    const res = await fetch(`${backendurl}/collections/${collectionID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({deleteType: 'deleteOnHand', pokemonId})
    }).then(async(data) => {return await handleApiResponse(data)})

    return res
}

export {deleteOnHandPutRequest}