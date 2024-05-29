const newOnHandPutReq = (newOnHand, collectionID, userID) => {
    fetch(`http://localhost:3000/collections/${collectionID}/edit/addonhand`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newOnHand})
    })
}

export {newOnHandPutReq}