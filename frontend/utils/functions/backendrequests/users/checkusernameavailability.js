import handleApiResponse from "../handleapiresponse"

const backendCheckUsernameAvailability = async(username, checkEmailInstead=false) => {
    const availability = await fetch(`http://localhost:3000/api/username-availability?${checkEmailInstead ? 'email' : 'username'}=${username}${checkEmailInstead ? '&checkEmailInstead=true' : ''}`, {
        method: 'GET'
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return availability
}

export {backendCheckUsernameAvailability}