<<<<<<< HEAD
import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

const createNewCollection = async(newCollectionInfo, type) => {
    const collectionIdRes = await fetch(`${backendurl}/collections/new`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({newCollectionInfo, type}),
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return collectionIdRes
}

=======
import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

const createNewCollection = async(newCollectionInfo, type) => {
    const collectionIdRes = await fetch(`${backendurl}/collections/new`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({newCollectionInfo, type}),
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return collectionIdRes
}

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export {createNewCollection}