const setOnHandReserved = (onHand, onhandIdsToReserve) => {
    return onHand.map(onhandP => {
        const isReserved = onhandIdsToReserve.includes(onhandP._id.toString())
        if (isReserved && onhandP.reserved !== onhandP.qty) {
            if (onhandP.reserved === undefined) {
                onhandP.reserved = 1
            } else {
                onhandP.reserved += 1
            }
        }
        return onhandP
    })
}

const removeOnHandReserved = (onHand, previouslyReservedOnHandIds) => {
    return onHand.map(onhandP => { 
        const removeReserved = previouslyReservedOnHandIds.includes(onhandP._id.toString()) 
        if (removeReserved && onhandP.reserved !== undefined) {
            if (onhandP.reserved === 1) {
                onhandP.reserved = undefined //deletes property when saved by mongoose
            }
            else {
                onhandP.reserved -= 1
            }
        }
        return onhandP
    })
}

const getOnhandIdsToReserve = (pokemonListTradeFormat) => {
    return pokemonListTradeFormat === undefined ? [] : pokemonListTradeFormat.map(p => {
        return p.balls.map(pBallData => {
            const isOnHand = pBallData.onhandId !== undefined 
            return isOnHand ? pBallData.onhandId : undefined
        }).filter(ohId => ohId !== undefined)
    }).flat()
}

export {setOnHandReserved, removeOnHandReserved, getOnhandIdsToReserve}