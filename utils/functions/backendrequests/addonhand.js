<<<<<<< HEAD
import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

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

=======
import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

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

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export {newOnHandPutReq}