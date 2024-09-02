import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

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

export {createNewCollection}