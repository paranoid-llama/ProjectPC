import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function sendUserMessageToEmailBackend(reason, subject, text, username) {
    return await fetch(`${backendurl}/api/send-user-message`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({reason, subject, text, username}),
    }).then(async(data) => {return await handleApiResponse(data, false)})
} 