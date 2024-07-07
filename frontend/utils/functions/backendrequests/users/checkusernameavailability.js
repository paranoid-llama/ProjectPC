const backendCheckUsernameAvailability = async(username, checkEmailInstead=false) => {
    const availability = await fetch(`http://localhost:3000/api/username-availability?${checkEmailInstead ? 'email' : 'username'}=${username}${checkEmailInstead ? '&checkEmailInstead=true' : ''}`, {
        method: 'GET'
    }).then(data => data.json())
    return availability
}

export {backendCheckUsernameAvailability}