import handleApiResponse from "../../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function verifyForgotPwTokenForBackend(tokenQuery) {
    return await fetch(`${backendurl}/api/reset-password${tokenQuery}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => await handleApiResponse(data, true))
}