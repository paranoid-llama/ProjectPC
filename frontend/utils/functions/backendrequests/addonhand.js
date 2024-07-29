import handleApiResponse from "./handleapiresponse"

const newOnHandPutReq = async(newOnHand, collectionID, userID) => {
    const res = await fetch(`http://localhost:3000/collections/${collectionID}`, {
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