const intServerError = {
    name: 'Internal Server Error',
    message: "Our server has encountered an unexpected error!",
    status: 500
}
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const userLoginRequest = async(userData) => {
    return await fetch(`${backendurl}/users/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(async(data) => {
        if (data.status === 401) {return {ok: true, load: {successful: false}}}
        else if (data.status === 500) {return {ok: false, load: intServerError}}
        else if (!data.ok) {return {ok: false, load: await data.json()}}
        else  { return {ok: true, load: {successful: true, sessionID: data.text()}}}
    })
}

export default userLoginRequest