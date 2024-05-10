const backendChangeOptions = (optionType, accompanyingData, collectionId) => {
    const changingSortingOption = optionType === 'sort'
    const changingRate = optionType === 'rate'
    const changingPreference = optionType === 'preference'
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
        const {addedRates, deletedRates} = accompanyingData
    } else if (changingPreference) {
        const {newPreferences} = accompanyingData
    }
}

export {backendChangeOptions}