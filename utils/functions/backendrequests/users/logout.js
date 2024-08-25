<<<<<<< HEAD
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

=======
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

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export default userLogoutRequest