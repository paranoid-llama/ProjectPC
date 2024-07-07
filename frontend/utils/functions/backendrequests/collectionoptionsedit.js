const backendChangeOptions = (optionType, accompanyingData, collectionId) => {
    const changingSortingOption = optionType === 'sort'
    const changingRate = optionType === 'rates'
    const changingPreference = optionType === 'preferences'
    const changingItems = optionType === 'items'
    const changingCollectionName = optionType === 'name'
    const changingGlobalDefault = optionType === 'globalDefault'
    if (changingSortingOption) {
        const {listType, data, sortedList} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, listType, data, sortedList})
        })
    } else if (changingRate) {
        const {newRates} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, newRates})
        })
    } else if (changingPreference) {
        const {newPreferences} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, newPreferences})
        })
    } else if (changingItems) {
        const {lfItems, ftItems} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, lfItems, ftItems})
        })
    } else if (changingCollectionName) {
        const {name, globalDefault} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, name, globalDefault})
        })
    } else if (changingGlobalDefault) {
        const {globalDefault} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({editType: 'optionsEdit', optionType, globalDefault})
        })
    }
}

export {backendChangeOptions}