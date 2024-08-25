<<<<<<< HEAD
import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function readNotification(username, id, isTradeId=false) {   
    const idBackend = isTradeId ? {tradeId: id} : {noteId: id}
    return await fetch(`${backendurl}/users/${username}/read-notification`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...idBackend})
    }).then(async(data) => {return await handleApiResponse(data)})
=======
import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function readNotification(username, id, isTradeId=false) {   
    const idBackend = isTradeId ? {tradeId: id} : {noteId: id}
    return await fetch(`${backendurl}/users/${username}/read-notification`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...idBackend})
    }).then(async(data) => {return await handleApiResponse(data)})
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}