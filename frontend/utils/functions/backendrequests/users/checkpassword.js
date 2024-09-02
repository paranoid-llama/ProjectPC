const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

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
}