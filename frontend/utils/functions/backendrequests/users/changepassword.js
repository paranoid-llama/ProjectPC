import handleApiResponse from "../handleapiresponse";

export default async function changePassword(username, currPasswordInput, newPassword) {
    return await fetch(`http://localhost:3000/users/${username}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, currPassword: currPasswordInput, newPassword})
    }).then(async(data) => await handleApiResponse(data))
}