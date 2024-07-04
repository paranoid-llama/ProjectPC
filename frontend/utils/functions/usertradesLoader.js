export default async function userTradesLoader({params}) {
    const userTradesData = fetch(`http://localhost:3000/users/${params.username}/trades`)
                            .then((res) => res.json())
                            .then((data) => data)
    return userTradesData
}