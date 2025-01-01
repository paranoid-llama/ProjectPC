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

const renderedBallList = (allowedBalls, currBall, positioning=21) => {
    const idxOfValue = allowedBalls.indexOf(currBall)
    const smallAllowedBallsList = allowedBalls.length < 7
    //this logic is used to render ball lists not only for changing collection information, but also to render ball selections for on-hand pokemon. 
    if (smallAllowedBallsList) {
        if (allowedBalls.length === 3 || allowedBalls.length === 4) {
            //As of Sept 2023 there's not a single pokemon that has a legal apriball list length of 4 in any gen, but adding logic just in case.
            if (idxOfValue === 1 || (idxOfValue === 2 && allowedBalls.length === 4)) {
                return {render: [(idxOfValue - 1),(idxOfValue),(idxOfValue + 1)], style: {}}
            } else if (idxOfValue === 0) {
                return {render: [(idxOfValue), (idxOfValue + 1)], style: {left: `${positioning}px`}}
            } else {
                return {render: [(idxOfValue - 1), (idxOfValue)], style: {right: `${positioning}px`}}
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
                return {render: [(idxOfValue), (idxOfValue + 1)], style: {left: `${positioning}px`}}
            } else {
                return {render: [(idxOfValue - 1), (idxOfValue)], style: {right: `${positioning}px`}}
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

const renderBallListDragVer = (allowedBalls, currBall) => {
    const idxOfValue = allowedBalls.indexOf(currBall)
    const smallAllowedBallsList = allowedBalls.length < 7
    if (smallAllowedBallsList) {
        const smallerAllowedBallsList = allowedBalls.length < 5
        if (smallerAllowedBallsList) {
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
            } else {
                if (idxOfValue === 0) {
                    return {render: [(idxOfValue), (idxOfValue + 1)], style: {left: '21px'}}
                } else {
                    return {render: [(idxOfValue - 1), (idxOfValue)], style: {right: '21px'}}
                }
            }
        }
        return [
            handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 2)),
            handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 1)), 
            (idxOfValue), 
            handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 1)),
            handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 2))
        ] 
    }
    const valuesBefore = allowedBalls.length === 8 ? [] : [handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 8)), handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 7))]
    const valuesAfter = allowedBalls.length === 8 ? [] : [handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 7)), handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 8))]
    return [
        ...valuesBefore,
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 6)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 5)), 
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 4)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 3)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 2)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue - 1)), 
        (idxOfValue), 
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 1)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 2)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 3)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 4)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 5)),
        handleIfOverOrUnderListLength(allowedBalls, (idxOfValue + 6)),
        ...valuesAfter,
    ]
}

//below functions for allowedBalls.length < 7
const getCenterOffset = (imgWidth, gapWidth, allowedBalls, selectedBall) => {
    const isCentered = allowedBalls.length === 1 || allowedBalls.length === 0 || allowedBalls.length === 3 && allowedBalls.indexOf(selectedBall) === 1 ||
        allowedBalls.length === 5 && allowedBalls.indexOf(selectedBall) === 2
    if (isCentered) {
        return 0
    }
    const position = allowedBalls.indexOf(selectedBall)+1
    const positionModifier = allowedBalls.length/2 > position ? 1 : -1
    if (allowedBalls.length % 2 === 0) {
        const positionFromCenter = positionModifier === 1 ? (allowedBalls.length/2 - position) + 1 : (position - allowedBalls.length/2)
        const baseDistance = imgWidth/2 + gapWidth/2
        const positionDistance = (positionFromCenter-1)*(imgWidth+gapWidth)
        return positionModifier*(baseDistance + positionDistance)
    } else {
        const centerPosition = allowedBalls.length === 5 ? 3 : allowedBalls.length === 7 ? 4 :  1
        const positionFromCenter = (centerPosition === 3 || centerPosition === 4) ? positionModifier === 1 ? centerPosition - position : position - centerPosition : 1
        return positionModifier*positionFromCenter*(imgWidth+gapWidth)
    }
}

const getConstantBallBoundaries = (imgWidth, gapWidth, allowedBalls, selectedBall) => {
    const ballBoundaries = {}
    if (allowedBalls.length % 2 !== 0) {
        allowedBalls.forEach((b, idx) => {
            const centerBall = allowedBalls.length === 1 || allowedBalls.length === 0 || 
                allowedBalls.length === 3 && idx === 1 || 
                allowedBalls.length === 5 && idx === 2 ||
                allowedBalls.length === 7 && idx === 3
            if (centerBall) {
                ballBoundaries[b] = [{min: imgWidth/2, max: -1*imgWidth/2}]
            } else {
                const centerPosition = allowedBalls.length === 3 ? 2 : allowedBalls.length === 7 ? 4 : 3
                const positionModifier = (allowedBalls.length)/2 > idx ? 1 : -1 //positionModifier === 1 indicates its in the first half of the list
                const baseOffset = imgWidth/2
                const multiplier = positionModifier === 1 ? centerPosition - (idx+1) : (idx+1) - centerPosition
                const finalMin = positionModifier*multiplier*(imgWidth+gapWidth) + positionModifier*baseOffset + (positionModifier === 1 ? 0 : imgWidth)
                const finalMax = positionModifier*multiplier*(imgWidth+gapWidth) + positionModifier*baseOffset - (positionModifier === 1 ? imgWidth : 0)
                ballBoundaries[b] = [{min: finalMin, max: finalMax}]
            }
        })  
    } else {
        if (allowedBalls.length === 0) {return ballBoundaries}
        const centerIdxs = (allowedBalls.length-1)/2
        allowedBalls.forEach((b, idx) => {
            const positionModifier = centerIdxs > idx ? 1 : -1
            const initMinPositionModifier = positionModifier === 1 ? -1*(gapWidth/2) : (gapWidth/2 + imgWidth)
            const initMaxPositionModifier = positionModifier === 1 ? -1*(gapWidth/2 + imgWidth) : (gapWidth/2)
            const multiplier = positionModifier === 1 ? centerIdxs - idx + 0.5 : idx - centerIdxs + 0.5
            const finalMin = positionModifier*multiplier*(imgWidth+gapWidth) + initMinPositionModifier
            const finalMax = positionModifier*multiplier*(imgWidth+gapWidth) + initMaxPositionModifier
            ballBoundaries[b] = [{min: finalMin, max: finalMax}]
        }) 
    }
    return ballBoundaries
}

export {renderedBallList, renderBallListDragVer, getCenterOffset, getConstantBallBoundaries}
