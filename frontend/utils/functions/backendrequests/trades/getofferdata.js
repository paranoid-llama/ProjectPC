export const getOfferData = async(tradeId, offerIdx) => {
    const offerData = await fetch(`http://localhost:3000/trades/${tradeId}/offer/${offerIdx}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(data => data.json())
    return offerData
}