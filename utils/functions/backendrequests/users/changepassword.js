<<<<<<< HEAD
import handleApiResponse from "../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function changePassword(username, currPasswordInput, newPassword) {
    return await fetch(`${backendurl}/users/${username}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, currPassword: currPasswordInput, newPassword})
    }).then(async(data) => await handleApiResponse(data))
=======
import handleApiResponse from "../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function changePassword(username, currPasswordInput, newPassword) {
    return await fetch(`${backendurl}/users/${username}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, currPassword: currPasswordInput, newPassword})
    }).then(async(data) => await handleApiResponse(data))
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}