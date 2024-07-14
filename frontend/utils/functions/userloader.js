export default async function userLoader({params}) {
    console.log(params.username)
    const user = fetch(`http://localhost:3000/users/${params.username}`)
                            .then(async(res) => {
                                const data = await res.json()
                                if (res.ok) {return data}
                                else {throw data}
                            })
    return user
}