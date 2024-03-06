function capitalizeFirstLetter(word) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
}

function setMaxEmArr(maxEms) {
    if (maxEms === 0) {
        return [0]
    } else if (maxEms === 1) {
        return [0, 1]
    } else if (maxEms === 2) {
        return [0, 2, 1]
    } else if (maxEms === 3) {
        return [0, 3, 1, 2]
    } else {
        return [0, 4, 1, 2, 3]
    }
}

function selectNextEmCount(emCountArr, currEmCount) {
    const idxOfCurrEmCount = emCountArr.indexOf(currEmCount)
    if (idxOfCurrEmCount === (emCountArr.length - 1)) {
        return 0
    } else {
        return emCountArr[idxOfCurrEmCount + 1]
    }
}

function getOwnedBalls(ballsObj) {
    const temp = Object.entries(ballsObj)
    const ownedBalls = temp.filter(p => p[1].isOwned === true).map(p => p[0])
    return ownedBalls
}

function getPokemonWithOwnedBalls(collection) {
    const listOfPokemon = collection.map(pokemon => {
        const hasOwnedBalls = Object.values(pokemon.balls).map(ballInfo => ballInfo.isOwned).includes(true)
        return hasOwnedBalls ? pokemon : undefined
    }).filter(pokemon => pokemon !== undefined)
    return listOfPokemon
}

function randomGender() {
    const genders = ['male', 'female']
    const idx = Math.round(Math.random())
    return genders[idx]
}

function setNewOnHandPokemonState(ballInfo, newSelection) {
    if (ballInfo.isHA === undefined && ballInfo.EMs === undefined) {
        const newOnHandData = {
            gender: newSelection.possibleGender === 'both' ? randomGender() : newSelection.possibleGender, 
            qty: 1
        }
        return newOnHandData
    } else if (ballInfo.isHA === undefined) {
        const newOnHandData = {
            gender: newSelection.possibleGender === 'both' ? randomGender() : newSelection.possibleGender, 
            emCount: ballInfo.emCount,
            EMs: ballInfo.EMs,
            qty: 1
        }
        return newOnHandData
    } else if (ballInfo.EMs === undefined) {
        const newOnHandData = {
            gender: newSelection.possibleGender === 'both' ? randomGender() : newSelection.possibleGender, 
            isHA: ballInfo.isHA,
            qty: 1
        }
        return newOnHandData
    } else {
        const newOnHandData = {
            gender: newSelection.possibleGender === 'both' ? randomGender() : newSelection.possibleGender, 
            isHA: ballInfo.isHA,
            emCount: ballInfo.emCount,
            EMs: ballInfo.EMs,
            qty: 1
        }
        return newOnHandData
    }
}

function selectivelyReturnIsHAAndEMs(key, value) {
    if (value === undefined) {
        return {}
    } else {
        return {[key]: value}
    }
}

function handleEMsState(newEM, currEMArr) {
    if (currEMArr.includes(newEM)) {
        const newEMList = currEMArr.filter(em => em !== newEM)
        return newEMList
    } else {
        const newEMList = currEMArr.concat(newEM)
        return newEMList
    }
}

export {capitalizeFirstLetter, setMaxEmArr, selectNextEmCount, getOwnedBalls, getPokemonWithOwnedBalls, randomGender, setNewOnHandPokemonState, selectivelyReturnIsHAAndEMs, handleEMsState}