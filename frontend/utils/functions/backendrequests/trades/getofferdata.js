import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export const getOfferData = async(tradeId, offerIdx) => {
    return await fetch(`${backendurl}/trades/${tradeId}/offer/${offerIdx}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => await handleApiResponse(data, true))
}