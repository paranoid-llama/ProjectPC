<<<<<<< HEAD
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function checkPasswordRequest(username, inputPassword) {
    return await fetch(`${backendurl}/users/${username}/check-password`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({inputPassword})
    }).then(async(data) => {
        return {
            ok: data.ok,
            load: !data.ok ? await data.json() : {successful: true}
        }
    })
=======
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function checkPasswordRequest(username, inputPassword) {
    return await fetch(`${backendurl}/users/${username}/check-password`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({inputPassword})
    }).then(async(data) => {
        return {
            ok: data.ok,
            load: !data.ok ? await data.json() : {successful: true}
        }
    })
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}