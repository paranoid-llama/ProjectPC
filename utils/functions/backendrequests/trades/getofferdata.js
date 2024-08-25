<<<<<<< HEAD
import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

export const getOfferData = async(tradeId, offerIdx) => {
    return await fetch(`${backendurl}/trades/${tradeId}/offer/${offerIdx}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => await handleApiResponse(data, true))
=======
import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

export const getOfferData = async(tradeId, offerIdx) => {
    return await fetch(`${backendurl}/trades/${tradeId}/offer/${offerIdx}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => await handleApiResponse(data, true))
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}