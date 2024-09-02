import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function getUserCollectionData(collectionId) {
    return await fetch(`${backendurl}/collections/${collectionId}`)
        .then(async(data) => {return await handleApiResponse(data, true)})
}