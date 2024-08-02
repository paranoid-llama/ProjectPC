import handleApiResponse from "../handleapiresponse"

export default async function readNotification(username, id, isTradeId=false) {   
    const idBackend = isTradeId ? {tradeId: id} : {noteId: id}
    return await fetch(`http://localhost:3000/users/${username}/read-notification`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...idBackend})
    }).then(async(data) => {return await handleApiResponse(data)})
}