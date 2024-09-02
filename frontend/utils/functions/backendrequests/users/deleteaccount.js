const intServerError = {
    name: 'Internal Server Error',
    message: "Our server has encountered an unexpected error!",
    status: 500
}
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function deleteUserAccount(username, inputPassword) {
    return await fetch(`${backendurl}/users/${username}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({inputPassword})
    }).then(async(data) => {
        if (data.status === 500) {return {ok: false, load: intServerError}}
        return {
            ok: data.ok,
            load: !data.ok ? await data.json() : {successful: true}
        }
    })
}