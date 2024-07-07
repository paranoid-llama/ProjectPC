
const getCollectionEditData = (key, value, pokename, ballname, otherFieldsData) => {
    return {pokename, ballname, [key]: value, otherFieldsData, editType: 'singleValue', }
}

const getOnHandEditData = (key, value, id, otherFieldsData) => {
    return {idOfPokemon: id, onhandPokemon: true, [key]: value, otherFieldsData, editType: 'singleValue'}
}

const usePutRequest = (key, value, identifiers, listType, collectionID, userID, otherFieldsData=undefined) => {
    const dataParser = listType === 'collection' ? getCollectionEditData : getOnHandEditData
    fetch(`http://localhost:3000/collections/${collectionID}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(listType === 'collection' ? dataParser(key, value, identifiers.pokename, identifiers.ballname, otherFieldsData) : dataParser(key, value, identifiers.id, otherFieldsData))
    })
}

const useTagRequest = (tag, activeTag, identifiers, collectionID, userID) => {
    fetch(`http://localhost:3000/collections/${collectionID}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({editType: 'tagEdit', pokename: identifiers.pokename, ballname: identifiers.ballname, tag, activeTag, isDefaultModifier: identifiers.default})
    })
}

const bulkEditOnHandInfo = (onHandEdit, pokemonID, collectionID, userID) => {
    fetch(`http://localhost:3000/collections/${collectionID}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({editType: 'bulkEdit', bulkEdit: onHandEdit, idOfPokemon: pokemonID, onhandPokemon: true})
    })
}

export {usePutRequest, useTagRequest, bulkEditOnHandInfo}