import handleApiResponse from "../../handleapiresponse";

export default async function generateForgotPwTokenForBackend(email) {
    return await fetch(`http://localhost:3000/api/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    }).then(async(data) => await handleApiResponse(data, true))
}