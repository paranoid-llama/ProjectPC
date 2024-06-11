export default async function userSettingsBackendRequest(settingType, newSettings, userID) {
    const status = await fetch(`http://localhost:3000/users/settings/${settingType}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newSettings, userID})
    })
}