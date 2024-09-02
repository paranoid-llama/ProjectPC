import handleApiResponse from "../handleapiresponse";

const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function sendNotifications(title, message, username, overrideNotiType) {
    return await fetch(`${backendurl}/api/admin/send-notifications`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({title, message, username, overrideNotiType}),
    }).then(async(data) => {return await handleApiResponse(data, false)})
}