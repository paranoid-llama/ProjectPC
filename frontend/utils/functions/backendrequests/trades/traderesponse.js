import handleApiResponse from "../handleapiresponse"

export const acceptTradeOffer = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    return await fetch(`http://localhost:3000/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'accept', otherUserId, offerColId, receivingColId, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const rejectTradeOffer = async(tradeId, otherUserId, offerColId, username) => {
    return await fetch(`http://localhost:3000/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'reject', otherUserId, offerColId, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const counterTradeOffer = async(tradeId, otherUserId, offerColId, receivingColId, counterOfferData, username) => {
    return await fetch(`http://localhost:3000/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'counter', otherUserId, offerColId, receivingColId, counterOfferData, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const toggleMarkedAsComplete = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    return await fetch(`http://localhost:3000/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'markAsComplete', otherUserId, offerColId, receivingColId, username})
    }).then(async(data) => await handleApiResponse(data))
}