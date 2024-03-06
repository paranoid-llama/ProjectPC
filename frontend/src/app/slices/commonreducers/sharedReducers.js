export const setInitialState = (state, action) => {
    const extractedState = action.payload
    return state = extractedState
}

export const setIsHA = (state, action) => {
    const {idx, ball, listType} = action.payload
    const valuePath = listType === 'collection' ? 
        state[idx].balls[ball].isHA :
        state[idx].isHA
    if (listType === 'collection') {
        state[idx].balls[ball].isHA = !valuePath
    } else if (listType === 'onhand') {
        state[idx].isHA = !valuePath
    }
    return state
}

export const setEmCount = (state, action) => {
    const {idx, ball, listType, numEMs} = action.payload
    if (listType === 'collection') {
        state[idx].balls[ball].emCount = numEMs
    } else if (listType === 'onhand') {
        state[idx].emCount = numEMs
    }
    return state
}

export const setEms = (state, action) => {
    const {idx, ball, listType, emName} = action.payload 
    if (listType === 'collection') {
        if (state[idx].balls[ball].EMs.includes(emName)) {
            const newEMList = state[idx].balls[ball].EMs.filter(em => em !== emName)
            state[idx].balls[ball].EMs = newEMList
            return state
        } else {
            state[idx].balls[ball].EMs.push(emName)
            return state
        }
    } else if (listType === 'onhand') {
        if (state[idx].EMs.includes(emName)) {
            const newEMList = state[idx].EMs.filter(em => em !== emName)
            state[idx].EMs = newEMList
            return state
        } else {
            state[idx].EMs.push(emName)
            return state
        }
    }
}

export const deleteEms = (state, action) => {
    const {idx, ball, listType} = action.payload
    if (listType === 'collection') {
        state[idx].balls[ball].EMs = []
    } else if (listType === 'onhand') {
        state[idx].EMs = []
    }
    return state
}