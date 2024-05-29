const userLoginRequest = async(userData) => {
    return await fetch(`http://localhost:3000/users/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(data => {
        if (data.status === 401) {return {successful: false}}
        else { return {successful: true, sessionID: data.text()}}
    })
}

export default userLoginRequest