const intServerError = {
    name: 'Internal Server Error',
    message: "Our server has encountered an unexpected error!",
    status: 500
}
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

//<!doctype is not valid json
console.log(backendurl)

export default async function getSession() {
    try {
        const userData = await fetch(`${backendurl}/api/session`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': 'https://pokellections.koyeb.app'
            },
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
    catch(e) {
        console.log(e)
        return {loggedIn: false}
    }
}