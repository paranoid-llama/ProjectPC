import handleApiResponse from "./handleapiresponse"

export default async function deleteCollectionRequest(collectionID) {
    const res = await fetch(`http://localhost:3000/collections/${collectionID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({deleteType: 'deleteCollection'})
    }).then(async(data) => {return await handleApiResponse(data)})

    return res
}