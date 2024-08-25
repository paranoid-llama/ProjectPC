<<<<<<< HEAD
export const getWantedData = (ownerColPokemon) => {
    const wantedData = {current: []}
    ownerColPokemon.forEach(p => {
        Object.keys(p.balls).map(ball => {
            const ballData = p.balls[ball]
            const isWanted = ballData.highlyWanted === true
            if (isWanted) {
                const pokemonIsThere = wantedData.current.filter(pokemon => pokemon.name === p.name).length !== 0
                if (pokemonIsThere) {
                    wantedData.current = wantedData.current.map(poke => {
                        const isPoke = poke.name === p.name
                        return isPoke ? {...poke, balls: [...poke.balls, ball]} : poke
                    })
                } else {
                   wantedData.current.push({name: p.name, balls: [ball]}) 
                } 
            }
        })
    })
    return wantedData.current
=======
export const getWantedData = (ownerColPokemon) => {
    const wantedData = {current: []}
    ownerColPokemon.forEach(p => {
        Object.keys(p.balls).map(ball => {
            const ballData = p.balls[ball]
            const isWanted = ballData.highlyWanted === true
            if (isWanted) {
                const pokemonIsThere = wantedData.current.filter(pokemon => pokemon.name === p.name).length !== 0
                if (pokemonIsThere) {
                    wantedData.current = wantedData.current.map(poke => {
                        const isPoke = poke.name === p.name
                        return isPoke ? {...poke, balls: [...poke.balls, ball]} : poke
                    })
                } else {
                   wantedData.current.push({name: p.name, balls: [ball]}) 
                } 
            }
        })
    })
    return wantedData.current
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
}