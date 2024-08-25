<<<<<<< HEAD
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

=======
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

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export {userRegisterRequest}