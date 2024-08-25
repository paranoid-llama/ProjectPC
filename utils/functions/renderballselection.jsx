<<<<<<< HEAD
const handleIfOverOrUnderListLength = (allowedBalls, selectedIdx) => {
    const arrLength = allowedBalls.length
    if (selectedIdx < 0) {
        return arrLength + selectedIdx
    } else if (selectedIdx >= arrLength) {
        return selectedIdx - arrLength
    } else {
        return selectedIdx
    }
}

const renderedBallList = (allowedBalls, currBall) => {
    const idxOfValue = allowedBalls.indexOf(currBall)
    const smallAllowedBallsList = allowedBalls.length < 7
    //this logic is used to render ball lists not only for changing collection information, but also to render ball selections for on-hand pokemon. 
    if (smallAllowedBallsList) {
        if (allowedBalls.length === 3 || allowedBalls.length === 4) {
            //As of Sept 2023 there's not a single pokemon that has a legal apriball list length of 4 in any gen, but adding logic just in case.
            if (idxOfValue === 1 || (idxOfValue === 2 && allowedBalls.length === 4)) {
                return {render: [(idxOfValue - 1),(idxOfValue),(idxOfValue + 1)], style: {}}
            } else if (idxOfValue === 0) {
                return {render: [(idxOfValue), (idxOfValue + 1)], style: {left: '21px'}}
            } else {
                return {render: [(idxOfValue - 1), (idxOfValue)], style: {right: '21px'}}
            }
        } else if (allowedBalls.length === 1) {
            return [(idxOfValue)]
        } else if (allowedBalls.length === 5 || allowedBalls.length === 6) {
            return [
                handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 2)),
                handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 1)), 
                (idxOfValue), 
                handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 1)),
                handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 2))
            ] 
        } else {
            if (idxOfValue === 0) {
                return {render: [(idxOfValue), (idxOfValue + 1)], style: {left: '21px'}}
            } else {
                return {render: [(idxOfValue - 1), (idxOfValue)], style: {right: '21px'}}
            }
        }
    }
    return [
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 3)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 2)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 1)), 
        (idxOfValue), 
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 1)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 2)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 3))
    ]
}

export {renderedBallList}
=======
const handleIfOverOrUnderListLength = (allowedBalls, selectedIdx) => {
    const arrLength = allowedBalls.length
    if (selectedIdx < 0) {
        return arrLength + selectedIdx
    } else if (selectedIdx >= arrLength) {
        return selectedIdx - arrLength
    } else {
        return selectedIdx
    }
}

const renderedBallList = (allowedBalls, currBall) => {
    const idxOfValue = allowedBalls.indexOf(currBall)
    const smallAllowedBallsList = allowedBalls.length < 7
    //this logic is used to render ball lists not only for changing collection information, but also to render ball selections for on-hand pokemon. 
    if (smallAllowedBallsList) {
        if (allowedBalls.length === 3 || allowedBalls.length === 4) {
            //As of Sept 2023 there's not a single pokemon that has a legal apriball list length of 4 in any gen, but adding logic just in case.
            if (idxOfValue === 1 || (idxOfValue === 2 && allowedBalls.length === 4)) {
                return {render: [(idxOfValue - 1),(idxOfValue),(idxOfValue + 1)], style: {}}
            } else if (idxOfValue === 0) {
                return {render: [(idxOfValue), (idxOfValue + 1)], style: {left: '21px'}}
            } else {
                return {render: [(idxOfValue - 1), (idxOfValue)], style: {right: '21px'}}
            }
        } else if (allowedBalls.length === 1) {
            return [(idxOfValue)]
        } else if (allowedBalls.length === 5 || allowedBalls.length === 6) {
            return [
                handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 2)),
                handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 1)), 
                (idxOfValue), 
                handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 1)),
                handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 2))
            ] 
        } else {
            if (idxOfValue === 0) {
                return {render: [(idxOfValue), (idxOfValue + 1)], style: {left: '21px'}}
            } else {
                return {render: [(idxOfValue - 1), (idxOfValue)], style: {right: '21px'}}
            }
        }
    }
    return [
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 3)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 2)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 1)), 
        (idxOfValue), 
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 1)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 2)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 3))
    ]
}

export {renderedBallList}
>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
