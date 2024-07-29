import handleApiResponse from "./handleapiresponse"

export default async function getUserCollectionData(collectionId) {
    return await fetch(`http://localhost:3000/collections/${collectionId}`)
        .then(async(data) => {return await handleApiResponse(data, true)})
}