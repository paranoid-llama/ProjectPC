import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

const userRegisterRequest = async(username, email, password, securityQuestionData) => {
    return await fetch(`${backendurl}/users/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password, ...securityQuestionData})
    }).then(async(data) => {return await handleApiResponse(data, true)})
}

export {userRegisterRequest}