import handleApiResponse from "../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function changePassword(username, currPasswordInput, newPassword) {
    return await fetch(`${backendurl}/users/${username}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, currPassword: currPasswordInput, newPassword})
    }).then(async(data) => await handleApiResponse(data))
}