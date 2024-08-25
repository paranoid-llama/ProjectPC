<<<<<<< HEAD
import handleApiResponse from "../../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function generateForgotPwTokenForBackend(email) {
    return await fetch(`${backendurl}/api/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    }).then(async(data) => await handleApiResponse(data, true))
=======
import handleApiResponse from "../../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function generateForgotPwTokenForBackend(email) {
    return await fetch(`${backendurl}/api/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    }).then(async(data) => await handleApiResponse(data, true))
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}