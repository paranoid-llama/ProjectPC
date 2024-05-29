export default async function getSession() {
    const userData = await fetch('http://localhost:3000/api/session', {
        method: 'GET',
        credentials: 'include'
    }).then(data => data.json())
    const userIsLoggedIn = Object.keys(userData).length !== 0
    const loggedInData = userIsLoggedIn ? {loggedIn: true, user: userData} : {loggedIn: false}
    return loggedInData
}