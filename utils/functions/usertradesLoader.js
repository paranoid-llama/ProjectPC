<<<<<<< HEAD
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function userTradesLoader({params}) {
    const userTradesData = fetch(`${backendurl}/users/${params.username}/trades`)
                            .then(async(res) => {
                                const data = await res.json()
                                if (res.ok) {return data}
                                else {throw data}
                            })
    return userTradesData
=======
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function userTradesLoader({params}) {
    const userTradesData = fetch(`${backendurl}/users/${params.username}/trades`)
                            .then(async(res) => {
                                const data = await res.json()
                                if (res.ok) {return data}
                                else {throw data}
                            })
    return userTradesData
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}