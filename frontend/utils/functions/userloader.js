export default async function userLoader({params}) {
    const user = fetch(`http://localhost:3000/users/${params.username}`)
                            .then((res) => res.json())
                            .then((data) => data)
    return user
}