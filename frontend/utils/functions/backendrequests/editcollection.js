import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

const getCollectionEditData = (key, value, pokename, ballname, otherFieldsData) => {
    return {pokename, ballname, [key]: value, otherFieldsData, editType: 'singleValue'}
}

const getOnHandEditData = (key, value, id, otherFieldsData) => {
    return {idOfPokemon: id, onhandPokemon: true, [key]: value, otherFieldsData, editType: 'singleValue'}
}

const usePutRequest = async(key, value, identifiers, listType, collectionID, userID, otherFieldsData=undefined) => {
    const dataParser = listType === 'collection' ? getCollectionEditData : getOnHandEditData
    const res = await fetch(`${backendurl}/collections/${collectionID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(listType === 'collection' ? dataParser(key, value, identifiers.pokename, identifiers.ballname, otherFieldsData) : dataParser(key, value, identifiers.id, otherFieldsData))
    }).then(async(data) => {return await handleApiResponse(data)})

    return res
}

const useTagRequest = async(tag, activeTag, identifiers, collectionID, userID) => {
    const res = await fetch(`${backendurl}/collections/${collectionID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({editType: 'tagEdit', pokename: identifiers.pokename, ballname: identifiers.ballname, tag, activeTag, isDefaultModifier: identifiers.default})
    }).then(async(data) => {return await handleApiResponse(data)})

    return res
}

const bulkEditOnHandInfo = async(onHandEdit, pokemonID, collectionID, userID) => {
    const res = await fetch(`${backendurl}/collections/${collectionID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({editType: 'bulkEdit', bulkEdit: onHandEdit, idOfPokemon: pokemonID, onhandPokemon: true})
    }).then(async(data) => {return await handleApiResponse(data)})

    return res
}

export {usePutRequest, useTagRequest, bulkEditOnHandInfo}