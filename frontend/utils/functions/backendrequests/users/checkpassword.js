export default async function checkPasswordRequest(username, inputPassword) {
    return await fetch(`http://localhost:3000/users/${username}/check-password`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({inputPassword})
    }).then(async(data) => {
        return {
            ok: data.ok,
            load: !data.ok ? await data.json() : {successful: true}
        }
    })
}