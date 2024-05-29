const userLogoutRequest = async() => {
    await fetch(`http://localhost:3000/users/logout`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return {successful: true}
}

export default userLogoutRequest