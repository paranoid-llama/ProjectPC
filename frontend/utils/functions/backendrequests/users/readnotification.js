import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

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
}