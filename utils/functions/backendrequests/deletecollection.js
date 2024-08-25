<<<<<<< HEAD
import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

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
=======
import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

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
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}