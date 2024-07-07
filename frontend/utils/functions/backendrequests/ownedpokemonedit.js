const ownedPokemonEdit = async(gen, newOwnedCollectionList, collectionId, getPokemonInfo=false, newPokemon=[], updateEggMoves=false, ballScope=[], newCollectingBalls=[]) => {
    if (getPokemonInfo) {
        const addedPokemon = await fetch(`http://localhost:3000/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'ownedPokemonEdit', getPokemonInfo, newPokemon, gen, ballScope})
        }).then(data => data.json())
        return addedPokemon
    } else {
        if (updateEggMoves) {
            const updatedEggMoveInfo = await fetch(`http://localhost:3000/collections/${collectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({editType: 'ownedPokemonEdit', gen, newOwnedCollectionList, updateEggMoves: true})
            }).then(data => data.json())
            return updatedEggMoveInfo
        } else if (newCollectingBalls.length !== 0) { 
            fetch(`http://localhost:3000/collections/${collectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({editType: 'ownedPokemonEdit', gen, newOwnedCollectionList, newCollectingBalls})
            })
        } else {
            fetch(`http://localhost:3000/collections/${collectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({editType: 'ownedPokemonEdit', gen, newOwnedCollectionList})
            })
        }
        
    }
}

export {ownedPokemonEdit}