import handleApiResponse from "./handleapiresponse"

const deleteOnHandPutRequest = async(pokemonId, collectionID, userId) => {
    const res = await fetch(`http://localhost:3000/collections/${collectionID}`, {
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