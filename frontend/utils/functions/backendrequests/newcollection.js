const createNewCollection = async(newCollectionInfo, type) => {
    const collectionIdRes = await fetch('http://localhost:3000/collections/new', {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({newCollectionInfo, type}),
    }).then(async(data) => {
        return {
            load: await data.json(),
            ok: data.ok
        }
    })
    return collectionIdRes
}

export {createNewCollection}