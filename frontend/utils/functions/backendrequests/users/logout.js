const intServerError = {
    name: 'Internal Server Error',
    message: "Our server has encountered an unexpected error!",
    status: 500
}
const backendurl = import.meta.env.VITE_BACKEND_URL

const userLogoutRequest = async() => {
    return await fetch(`${backendurl}/users/logout`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => {
        if (data.status === 500) {return {ok: false, load: intServerError}}
        return {
            ok: data.ok,
            load: !data.ok ? await data.json() : {successful: true}
        }
    })
}

export default userLogoutRequest