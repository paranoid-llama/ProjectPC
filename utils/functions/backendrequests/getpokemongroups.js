<<<<<<< HEAD
const backendurl = import.meta.env.VITE_BACKEND_URL

const getPokemonGroups = async(gen) => {
    const pokemonGroups = await fetch(`${backendurl}/collections/pokemongroups?gen=${gen}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => {
        return {
            ok: data.ok,
            load: await data.json()
        }
    })
    return pokemonGroups
}

=======
const backendurl = import.meta.env.VITE_BACKEND_URL

const getPokemonGroups = async(gen) => {
    const pokemonGroups = await fetch(`${backendurl}/collections/pokemongroups?gen=${gen}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async(data) => {
        return {
            ok: data.ok,
            load: await data.json()
        }
    })
    return pokemonGroups
}

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export {getPokemonGroups}