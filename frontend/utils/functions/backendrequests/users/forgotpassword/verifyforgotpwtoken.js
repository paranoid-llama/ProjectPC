import handleApiResponse from "../../handleapiresponse";

export default async function verifyForgotPwTokenForBackend(tokenQuery) {
    return await fetch(`http://localhost:3000/api/reset-password${tokenQuery}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => await handleApiResponse(data, true))
}