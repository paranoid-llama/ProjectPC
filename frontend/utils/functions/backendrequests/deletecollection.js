import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function deleteCollectionRequest(collectionID) {
    const res = await fetch(`${backendurl}/collections/${collectionID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({deleteType: 'deleteCollection'})
    }).then(async(data) => {return await handleApiResponse(data)})

    return res
}