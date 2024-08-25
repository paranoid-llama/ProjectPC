<<<<<<< HEAD
import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

const backendCheckUsernameAvailability = async(username, checkEmailInstead=false) => {
    const availability = await fetch(`${backendurl}/api/username-availability?${checkEmailInstead ? 'email' : 'username'}=${username}${checkEmailInstead ? '&checkEmailInstead=true' : ''}`, {
        method: 'GET'
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return availability
}

=======
import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

const backendCheckUsernameAvailability = async(username, checkEmailInstead=false) => {
    const availability = await fetch(`${backendurl}/api/username-availability?${checkEmailInstead ? 'email' : 'username'}=${username}${checkEmailInstead ? '&checkEmailInstead=true' : ''}`, {
        method: 'GET'
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return availability
}

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export {backendCheckUsernameAvailability}