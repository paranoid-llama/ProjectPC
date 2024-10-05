import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function createDemoCollectionBackendRequest(newCollectionInfo, type) {
    const newCollection = await fetch(`${backendurl}/collections/demo/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newCollectionInfo, type})
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return newCollection
}