const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function userLoader({params}) {
    const user = fetch(`${backendurl}/users/${params.username}`)
                            .then(async(res) => {
                                const data = await res.json()
                                if (res.ok) {return data}
                                else {throw data}
                            })
    return user
}