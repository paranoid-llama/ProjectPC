export const OHByPokemonStateUpdate = (listOfPokeBallCombo, increment, colBallData=undefined, customQty, getListOfIds = false) => {
    const changeData = {}
    let id = 0
    let closestMatch = 'none'
    //list of ids to change from first to last. primarily used for decrementing by custom quantities
    const listOfAllMatches = [] 
    const listOfHaMatches = []
    const listOfEmMatches = []
    const listOfNoneMatches = []

    listOfPokeBallCombo.forEach((pBC) => {
        if (colBallData !== undefined) {
            if (getListOfIds || (colBallData.isHA !== undefined && pBC.isHA === colBallData.isHA) && pBC.emCount === colBallData.emCount && (pBC.EMs !== undefined ? (!pBC.EMs.map(pBCEm => colBallData.EMs.includes(pBCEm)).includes(false) && pBC.EMs.length === colBallData.EMs.length) : true)) {
                //if all the peripherals match what is in the collection ball data, take and change that idx.
                if (getListOfIds) {
                    listOfAllMatches.push(pBC._id)
                } else {
                    id = pBC._id
                    changeData.remove = (pBC.qty === 1 && !increment) || customQty === 0
                    closestMatch = 'all'
                }  
            } else if (getListOfIds || (id === 0 || closestMatch === 'none' || closestMatch === 'ems') && colBallData.isHA !== undefined && pBC.isHA === colBallData.isHA) {
                //otherwise, match the isHA state of the pmnmn fdneripherals, if the mon has a hidden ability
                if (getListOfIds) {
                    listOfHaMatches.push(pBC._id)
                } else {
                   id = pBC._id
                    changeData.remove = (pBC.qty === 1 && !increment) || customQty === 0
                    closestMatch = 'ha' 
                } 
            } else if (getListOfIds || (id === 0 || closestMatch === 'none') && colBallData.emCount !== undefined && pBC.emCount === colBallData.emCount && (pBC.EMs !== undefined ? (!pBC.EMs.map(pBCEm => colBallData.EMs.includes(pBCEm)).includes(false) && pBC.EMs.length === colBallData.EMs.length) : true)) {
                //otherwise, match the emCount and EMs state of the peripherals, if the mon has egg moves
                if (getListOfIds) {
                    listOfEmMatches.push(pBC._id)
                } else {
                   id = pBC._id
                    changeData.remove = (pBC.qty === 1 && !increment) || customQty === 0
                    closestMatch = 'ems' 
                }
            } else if (getListOfIds || id === 0) {
                //if nothing else matches and theres still no match, take this onhand id
                if (getListOfIds) {
                    listOfNoneMatches.push(pBC._id)
                }
                else {
                   id = pBC._id
                    changeData.remove = (pBC.qty === 1 && !increment) || customQty === 0
                    closestMatch = 'none' 
                }    
            }
            //tier of priority:
            // 1. matches both peripherals (ha and ems)
            // 2. matches ha only
            // 3. matches em only
            // 4. matches none
            //this is the order that these presets' qty will be chosen to change
        }
    })
    if (getListOfIds) {
        return [...listOfAllMatches, ...listOfHaMatches, ...listOfEmMatches, ...listOfNoneMatches]
    }
    changeData.id = id
    //commented below since i question the need to change the reserved if it goes over the qty. 
    // **** old ****
    //can just keep it, dont think it will break anything. some people may accidentally change a qty when its reserved and want to change it back.
    // if (listOfPokeBallCombo[idx].reserved !== undefined && listOfPokeBallCombo[idx].reserved > listOfPokeBallCombo[idx].qty) {
    //     listOfPokeBallCombo[idx].reserved -= 1
    // }
   
    return changeData
}

//this function matches an onhand of a particular pokemon based on the following criteria:
// 1. if colBallData is provided (typically if that combo is owned), it matches by this tier of priority:
//      a. matches both peripherals (ha and ems)
//      b. matches ha only
//      c. matches em only
//      d. matches none
// 2. if colBallData is NOT provided or undefined, it will match this way:
//      a. matches isHA and highest em count
//      b. matches isHA only
//      c. matches em count only
//      d. matches none
//ball parameter makes sure it has to match a particular ball
export const matchOnHandInList = (listOfOnHands, colBallData=undefined, ball=undefined) => {
    let id = 0
    let closestMatch = 'none'
    let highestEmCount = 0
    listOfOnHands.forEach((pBC) => {
        if (pBC.ball === ball) {
            if (colBallData !== undefined) {
                if ((colBallData.isHA !== undefined && pBC.isHA === colBallData.isHA) && pBC.emCount === colBallData.emCount && (pBC.EMs !== undefined ? (!pBC.EMs.map(pBCEm => colBallData.EMs.includes(pBCEm)).includes(false) && pBC.EMs.length === colBallData.EMs.length) : true)) {
                    //if all the peripherals match what is in the collection ball data, take and change that idx.
                    id = pBC._id
                    closestMatch = 'all'
                } else if ((id === 0 || closestMatch === 'none' || closestMatch === 'ems') && colBallData.isHA !== undefined && pBC.isHA === colBallData.isHA) {
                    //otherwise, match the isHA state of the pmnmn fdneripherals, if the mon has a hidden ability
                    id = pBC._id
                    closestMatch = 'ha'
                } else if ((id === 0 || closestMatch === 'none') && colBallData.emCount !== undefined && pBC.emCount === colBallData.emCount && (pBC.EMs !== undefined ? (!pBC.EMs.map(pBCEm => colBallData.EMs.includes(pBCEm)).includes(false) && pBC.EMs.length === colBallData.EMs.length) : true)) {
                    //otherwise, match the emCount and EMs state of the peripherals, if the mon has egg moves
                    id = pBC._id
                    closestMatch = 'ems'
                } else if (id === 0) {
                    //if nothing else matches and theres still no match, take this onhand id
                    id = pBC._id
                    closestMatch = 'none'
                }
            } else {
                if ((pBC.isHA !== undefined && pBC.isHA) && pBC.emCount > highestEmCount) {
                    //if isHA is true and the emCount surpasses the highest em count, take that id
                    id = pBC._id
                    closestMatch = 'all'
                    highestEmCount = pBC.emCount
                } else if ((id === 0 || closestMatch === 'none' || closestMatch === 'ems') && pBC.isHA !== undefined && pBC.isHA) {
                    //otherwise, match the id if isHA is true and the mon has a hidden ability
                    id = pBC._id
                    closestMatch = 'ha'
                } else if ((id === 0 || closestMatch === 'none') && pBC.emCount !== undefined && pBC.emCount > highestEmCount) {
                    //otherwise, match the id if the mon has egg moves and the em count is higher than the highest em count
                    id = pBC._id
                    closestMatch = 'ems'
                    highestEmCount = pBC.emCount
                } else if (id === 0) {
                    //if nothing else matches and theres still no match, take this onhand id
                    id = pBC._id
                    closestMatch = 'none'
                }
            }
        }
    })
    return id
}

export const removeByPokemonOhandsFromList = (onhandList, removedOnhands) => {
    //removed onhands multiples comes in the form '{pokemon-img-link} {ball}' in array
    const pImgLinks = removedOnhands.map(p => p.slice(0, p.indexOf(' ')))
    const newOhList = onhandList.map(p => {
        const removedMon = pImgLinks.includes(p.imgLink)
        if (removedMon) {
            const removedBalls = removedOnhands.filter(p2 => p2.slice(0, p2.indexOf(' ')) === p.imgLink).map(p2 => p2.slice(p2.indexOf(' ')+1, p2.length))
            removedBalls.forEach(b => {
                p.balls[b].numTotal = 0
                p.balls[b].numNonHA = 0
                p.balls[b].reserved = 0
            })
            if (Object.values(p.balls).map(pBD => pBD.numTotal).filter(num => num !== 0).length === 0) { //indicates the mon has no more onhands and needs to be removed from the display list
                return undefined
            }
        }
        return p
    }).filter(p => p !== undefined)
    return newOhList
}