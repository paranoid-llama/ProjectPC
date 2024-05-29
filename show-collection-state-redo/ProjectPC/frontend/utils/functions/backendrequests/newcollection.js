const createNewCollection = async(newCollectionInfo, type) => {
    const collectionId = await fetch('http://localhost:3000/collections/new', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({newCollectionInfo, type}),
    }).then((res) => res.json())
    return collectionId
}

export {createNewCollection}