
const getCollectionEditData = (key, value, pokename, ballname, otherFieldsData) => {
    return {pokename, ballname, [key]: value, otherFieldsData}
}

const getOnHandEditData = (key, value, id, otherFieldsData) => {
    return {idOfPokemon: id, onhandPokemon: true, [key]: value, otherFieldsData}
}

const usePutRequest = (key, value, identifiers, listType, collectionID, userID, otherFieldsData=undefined) => {
    const dataParser = listType === 'collection' ? getCollectionEditData : getOnHandEditData
    fetch(`http://localhost:3000/collections/${collectionID}/edit`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(listType === 'collection' ? dataParser(key, value, identifiers.pokename, identifiers.ballname, otherFieldsData) : dataParser(key, value, identifiers.id, otherFieldsData))
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