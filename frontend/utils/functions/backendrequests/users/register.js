import handleApiResponse from "../handleapiresponse"

const userRegisterRequest = async(username, email, password, securityQuestionData) => {
    return await fetch(`http://localhost:3000/users/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password, ...securityQuestionData})
    }).then(async(data) => {return await handleApiResponse(data, true)})
}

export {userRegisterRequest}