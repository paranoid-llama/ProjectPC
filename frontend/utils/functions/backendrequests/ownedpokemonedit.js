const ownedPokemonEdit = async(gen, newOwnedCollectionList, collectionId, getPokemonInfo=false, newPokemon=[], updateEggMoves=false, ballScope=[], newCollectingBalls=[]) => {
    if (getPokemonInfo) {
        const addedPokemon = await fetch(`http://localhost:3000/collections/${collectionId}/edit/ownedpokemonedit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({getPokemonInfo, newPokemon, gen, ballScope})
        }).then(data => data.json())
        return addedPokemon
    } else {
        if (updateEggMoves) {
            const updatedEggMoveInfo = await fetch(`http://localhost:3000/collections/${collectionId}/edit/ownedpokemonedit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({gen, newOwnedCollectionList, updateEggMoves: true})
            }).then(data => data.json())
            return updatedEggMoveInfo
        } else if (newCollectingBalls.length !== 0) { 
            fetch(`http://localhost:3000/collections/${collectionId}/edit/ownedpokemonedit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({gen, newOwnedCollectionList, newCollectingBalls})
            })
        } else {
            fetch(`http://localhost:3000/collections/${collectionId}/edit/ownedpokemonedit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({gen, newOwnedCollectionList})
            })
        }
        
    }
}

export {ownedPokemonEdit}