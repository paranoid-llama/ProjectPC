const getPokemonGroups = async(gen) => {
    const pokemonGroups = await fetch(`http://localhost:3000/collections/pokemongroups?gen=${gen}`, {
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

export {getPokemonGroups}