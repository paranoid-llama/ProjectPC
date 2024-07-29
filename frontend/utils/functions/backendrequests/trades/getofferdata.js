import handleApiResponse from "../handleapiresponse"

export const getOfferData = async(tradeId, offerIdx) => {
    return await fetch(`http://localhost:3000/trades/${tradeId}/offer/${offerIdx}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => await handleApiResponse(data, true))
}