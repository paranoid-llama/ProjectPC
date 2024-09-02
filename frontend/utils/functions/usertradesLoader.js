const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
import { defer } from "react-router"

export default async function userTradesLoader({params}) {
    const userTradesData = fetch(`${backendurl}/users/${params.username}/trades`).then(res => res.json())
                            // .then(async(res) => {
                            //     const data = await res.json()
                            //     if (res.ok) {return data}
                            //     else {throw data}
                            // })
    return defer({resolvedData: userTradesData})
}