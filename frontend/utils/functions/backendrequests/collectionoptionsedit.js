const backendChangeOptions = (optionType, accompanyingData, collectionId) => {
    const changingSortingOption = optionType === 'sort'
    const changingRate = optionType === 'rates'
    const changingPreference = optionType === 'preferences'
    const changingItems = optionType === 'items'
    const changingCollectionName = optionType === 'name'
    if (changingSortingOption) {
        const {listType, data, sortedList} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}/edit/optionsedit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({optionType, listType, data, sortedList})
        })
    } else if (changingRate) {
        const {newRates} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}/edit/optionsedit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({optionType, newRates})
        })
    } else if (changingPreference) {
        const {newPreferences} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}/edit/optionsedit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({optionType, newPreferences})
        })
    } else if (changingItems) {
        const {lfItems, ftItems} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}/edit/optionsedit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({optionType, lfItems, ftItems})
        })
    } else if (changingCollectionName) {
        const {name} = accompanyingData
        fetch(`http://localhost:3000/collections/${collectionId}/edit/optionsedit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({optionType, name})
        })
    }
}

export {backendChangeOptions}