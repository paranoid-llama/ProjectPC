const newOnHandPutReq = (newOnHand, collectionID, userID) => {
    fetch(`http://localhost:3000/collections/${collectionID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({editType: 'addOnHand', newOnHand})
    })
}

export {newOnHandPutReq}