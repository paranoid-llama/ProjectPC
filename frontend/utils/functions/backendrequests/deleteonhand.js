const deleteOnHandPutRequest = (pokemonId, collectionID, userId) => {
    fetch(`http://localhost:3000/collections/${collectionID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({deleteType: 'deleteOnHand', pokemonId})
    })
}

export {deleteOnHandPutRequest}