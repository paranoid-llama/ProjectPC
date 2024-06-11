export default async function getUserCollectionData(collectionId) {
    return await fetch(`http://localhost:3000/collections/${collectionId}`)
        .then((res) => {
            if (res.ok) {return res.json()} 
            else {console.log('UH OH ERROR')}
        })
}