import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const backendCheckUsernameAvailability = async(username, checkEmailInstead=false) => {
    const availability = await fetch(`${backendurl}/api/username-availability?${checkEmailInstead ? 'email' : 'username'}=${username}${checkEmailInstead ? '&checkEmailInstead=true' : ''}`, {
        method: 'GET'
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return availability
}

export {backendCheckUsernameAvailability}