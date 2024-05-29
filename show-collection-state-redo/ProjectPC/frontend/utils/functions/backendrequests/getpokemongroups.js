const getPokemonGroups = async(gen) => {
    const pokemonGroups = await fetch('http://localhost:3000/collections/pokemongroups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({gen})
    }).then(data => data.json())
    return pokemonGroups
}

export {getPokemonGroups}