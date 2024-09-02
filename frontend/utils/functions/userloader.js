const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
import { defer } from "react-router"

export default async function userLoader({params}) {
    const user = fetch(`${backendurl}/users/${params.username}`).then(res => res.json())
                            // .then(async(res) => {
                            //     const data = await res.json()
                            //     if (res.ok) {return data}
                            //     else {throw data}
                            // })
    return defer({
        resolvedData: user
    })
}