export default async function userTradesLoader({params}) {
    const userTradesData = fetch(`http://localhost:3000/users/${params.username}/trades`)
                            .then(async(res) => {
                                const data = await res.json()
                                if (res.ok) {return data}
                                else {throw data}
                            })
    return userTradesData
}