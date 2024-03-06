const deleteOnHandPutRequest = (pokemonId, collectionID, userId) => {
    fetch(`http://localhost:3000/collections/${collectionID}/edit/deleteonhand`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pokemonId})
    })
}

export {deleteOnHandPutRequest}