export const acceptTradeOffer = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    await fetch(`http://localhost:3000/trades/${tradeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'accept', otherUserId, offerColId, receivingColId, username})
    })
}

export const rejectTradeOffer = async(tradeId, otherUserId, username) => {
    await fetch(`http://localhost:3000/trades/${tradeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'reject', otherUserId, username})
    })
}

export const counterTradeOffer = async(tradeId, otherUserId, counterOfferData, username) => {
    await fetch(`http://localhost:3000/trades/${tradeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'counter', otherUserId, counterOfferData, username})
    })
}

export const toggleMarkedAsComplete = async(tradeId, otherUserId, offerColId, receivingColId, username) => {
    await fetch(`http://localhost:3000/trades/${tradeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({response: 'markAsComplete', otherUserId, offerColId, receivingColId, username})
    })
}