<<<<<<< HEAD
import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

export const acceptTradeOffer = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'accept', otherUserId, offerColId, receivingColId, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const rejectTradeOffer = async(tradeId, otherUserId, offerColId, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'reject', otherUserId, offerColId, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const counterTradeOffer = async(tradeId, otherUserId, offerColId, receivingColId, counterOfferData, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'counter', otherUserId, offerColId, receivingColId, counterOfferData, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const cancelTrade = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'cancel', otherUserId, offerColId, receivingColId, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const toggleMarkedAsComplete = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'markAsComplete', otherUserId, offerColId, receivingColId, username})
    }).then(async(data) => await handleApiResponse(data))
=======
import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

export const acceptTradeOffer = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'accept', otherUserId, offerColId, receivingColId, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const rejectTradeOffer = async(tradeId, otherUserId, offerColId, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'reject', otherUserId, offerColId, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const counterTradeOffer = async(tradeId, otherUserId, offerColId, receivingColId, counterOfferData, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'counter', otherUserId, offerColId, receivingColId, counterOfferData, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const cancelTrade = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'cancel', otherUserId, offerColId, receivingColId, username})
    }).then(async(data) => await handleApiResponse(data))
}

export const toggleMarkedAsComplete = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    return await fetch(`${backendurl}/trades/${tradeId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'markAsComplete', otherUserId, offerColId, receivingColId, username})
    }).then(async(data) => await handleApiResponse(data))
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}