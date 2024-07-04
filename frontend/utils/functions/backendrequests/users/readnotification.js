export default async function readNotification(username, id, isTradeId=false) {   
    const idBackend = isTradeId ? {tradeId: id} : {noteId: id}
    await fetch(`http://localhost:3000/users/${username}/read-notification`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...idBackend})
    })
}