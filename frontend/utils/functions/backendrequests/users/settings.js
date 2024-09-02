import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function userSettingsBackendRequest(settingType, newSettings, username, miscData={}) {
    return await fetch(`${backendurl}/users/${username}/settings/${settingType}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newSettings, miscData})
    }).then(async(data) => {return await handleApiResponse(data)})
}