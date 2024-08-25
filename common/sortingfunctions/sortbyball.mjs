const sortByBallLogic = (a, b, ballOrder) => {
    const aBallIdx = ballOrder.indexOf(a.ball)
    const bBallIdx = ballOrder.indexOf(b.ball)
    if (aBallIdx < bBallIdx) {
        return -1
    }
    if (aBallIdx > bBallIdx) {
        return 1
    } 
    return 0
}

//we dont need a sortbyball function on its own since this is only used for onhandsorting, which uses other sorting functions.

export {sortByBallLogic}