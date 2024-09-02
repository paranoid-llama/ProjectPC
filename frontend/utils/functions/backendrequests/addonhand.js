import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const newOnHandPutReq = async(newOnHand, collectionID, userID) => {
    const res = await fetch(`${backendurl}/collections/${collectionID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({editType: 'addOnHand', newOnHand})
    }).then(async(data) => {return await handleApiResponse(data)})

    return res
}

export {newOnHandPutReq}