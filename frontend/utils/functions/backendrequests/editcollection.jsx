
const getCollectionEditData = (key, value, pokename, ballname) => {
    return {pokename, ballname, [key]: value}
}

const getOnHandEditData = (key, value, id) => {
    return {idOfPokemon: id, onhandPokemon: true, [key]: value}
}

const usePutRequest = (key, value, identifiers, listType, collectionID, userID) => {
    const dataParser = listType === 'collection' ? getCollectionEditData : getOnHandEditData
    fetch(`http://localhost:3000/collections/${collectionID}/edit`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(listType === 'collection' ? dataParser(key, value, identifiers.pokename, identifiers.ballname) : dataParser(key, value, identifiers.id))
    })
}

const useTagRequest = (tag, activeTag, identifiers, collectionID, userID) => {
    fetch(`http://localhost:3000/collections/${collectionID}/edit/tagedit`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({pokename: identifiers.pokename, ballname: identifiers.ballname, tag, activeTag, isDefaultModifier: identifiers.default})
    })
}

const bulkEditOnHandInfo = (onHandEdit, pokemonID, collectionID, userID) => {
    fetch(`http://localhost:3000/collections/${collectionID}/edit/bulkedit`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({bulkEdit: onHandEdit, idOfPokemon: pokemonID, onhandPokemon: true})
    })
}

export {usePutRequest, useTagRequest, bulkEditOnHandInfo}