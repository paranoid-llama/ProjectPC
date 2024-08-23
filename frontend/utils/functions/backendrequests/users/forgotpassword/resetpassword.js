import handleApiResponse from "../../handleapiresponse";

export default async function resetPasswordRequest(tokenQuery, newPassword) {
    return await fetch(`http://localhost:3000/api/reset-password${tokenQuery}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPassword})
    }).then(async(data) => await handleApiResponse(data))
}