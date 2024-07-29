const intServerError = {
    name: 'Internal Server Error',
    message: "Our server has encountered an unexpected error!",
    status: 500
}

export default async function getSession() {
    const userData = await fetch('http://localhost:3000/api/session', {
        method: 'GET',
        credentials: 'include'
    }).then(async(res) => {
        if (res.status === 500) {throw intServerError}
        const data = await res.json()
        if (res.ok) {return data} 
        else {throw data}
    })  
    const userIsLoggedIn = Object.keys(userData).length !== 0
    const loggedInData = userIsLoggedIn ? {loggedIn: true, user: userData} : {loggedIn: false}
    return loggedInData
}