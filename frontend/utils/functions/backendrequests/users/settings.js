import handleApiResponse from "../handleapiresponse"

export default async function userSettingsBackendRequest(settingType, newSettings, username, miscData={}) {
    return await fetch(`http://localhost:3000/users/${username}/settings/${settingType}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newSettings, miscData})
    }).then(async(data) => {return await handleApiResponse(data)})
}