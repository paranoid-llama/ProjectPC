import handleApiResponse from "../../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function resetPasswordRequest(tokenQuery, newPassword) {
    return await fetch(`${backendurl}/api/reset-password${tokenQuery}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPassword})
    }).then(async(data) => await handleApiResponse(data))
}