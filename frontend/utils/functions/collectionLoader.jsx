

export default async function collectionLoader({params}) {
    const collection = fetch(`http://localhost:3000/collections/${params.id}`)
                            .then((res) => res.json())
                            .then((data) => data)
    return collection
}