<<<<<<< HEAD
import handleApiResponse from "../../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function resetPasswordRequest(tokenQuery, newPassword) {
    return await fetch(`${backendurl}/api/reset-password${tokenQuery}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPassword})
    }).then(async(data) => await handleApiResponse(data))
=======
import handleApiResponse from "../../handleapiresponse";
const backendurl = import.meta.env.VITE_BACKEND_URL

export default async function resetPasswordRequest(tokenQuery, newPassword) {
    return await fetch(`${backendurl}/api/reset-password${tokenQuery}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPassword})
    }).then(async(data) => await handleApiResponse(data))
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}