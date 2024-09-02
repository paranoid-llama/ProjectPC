import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const backendChangeOptions = async(optionType, accompanyingData, collectionId) => {
    const changingSortingOption = optionType === 'sort'
    const changingRate = optionType === 'rates'
    const changingPreference = optionType === 'preferences'
    const changingItems = optionType === 'items'
    const changingCollectionName = optionType === 'name'
    const changingGlobalDefault = optionType === 'globalDefault'
    if (changingSortingOption) {
        const {listType, data, sortedList} = accompanyingData
        const res = await fetch(`${backendurl}/collections/${collectionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, listType, data, sortedList})
        }).then(async(data) => {return await handleApiResponse(data)})

        return res
    } else if (changingRate) {
        const {newRates} = accompanyingData
        const res = await fetch(`${backendurl}/collections/${collectionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, newRates})
        }).then(async(data) => {return await handleApiResponse(data)})

        return res
    } else if (changingPreference) {
        const {newPreferences} = accompanyingData
        const res = await fetch(`${backendurl}/collections/${collectionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, newPreferences})
        }).then(async(data) => {return await handleApiResponse(data)})

        return res
    } else if (changingItems) {
        const {lfItems, ftItems} = accompanyingData
        const res = await fetch(`${backendurl}/collections/${collectionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, lfItems, ftItems})
        }).then(async(data) => {return await handleApiResponse(data)})

        return res
    } else if (changingCollectionName) {
        const {name, globalDefault} = accompanyingData
        const res = await fetch(`${backendurl}/collections/${collectionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, name, globalDefault})
        }).then(async(data) => {return await handleApiResponse(data)})

        return res
    } else if (changingGlobalDefault) {
        const {globalDefault} = accompanyingData
        const res = await fetch(`${backendurl}/collections/${collectionId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, globalDefault})
        }).then(async(data) => {return await handleApiResponse(data)})

        return res
    }
}

export {backendChangeOptions}