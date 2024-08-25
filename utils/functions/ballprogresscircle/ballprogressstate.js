//this function sets the ball progress state from a provided list, depending on which ball. 
//used to set the state in selectors but also used elsewhere, such as displaying collection progress for search items.

const getBallProgress = (list, ball) => {
    //main purpose: show collection page rendering. this if statement is used since the show page sets the initial state after this is done which means
    //it may come out undefined - this ensures it doesnt throw an error
    if (list.length === undefined) {
        if (ball === 'total') {
            return '0/0'
        }
        return {display: '0/0', percent: 0}
    }
    if (ball === 'total') {
        let totalToCollect = 0
        let totalCollected = 0
        list.forEach(p => {
            if (p.disabled) {return}
            const ballsToCollect = Object.keys(p.balls).filter(ball => p.balls[ball].disabled !== true)
            for (let ball of ballsToCollect) {
                totalToCollect +=1
                if (p.balls[ball].isOwned === true) {
                    totalCollected+=1
                }
            }
        })
        const ballProgress = {display: `${totalCollected}/${totalToCollect}`, percent: (totalCollected/totalToCollect)*100}
        return ballProgress
    }
    const filteredList = list.filter(p => p.balls[ball] !== undefined)
    const totalToCollect = filteredList.length
    const totalCollected = filteredList.filter(p => p.balls[ball].isOwned === true).length
    const ballProgress = {display: `${totalCollected}/${totalToCollect}`, percent: (totalCollected/totalToCollect)*100}
    return ballProgress
}

export {getBallProgress}