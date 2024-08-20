const setPendingTrade = (offerCol, receivingCol, latestOffer, cancel=false) => {
    const data = {newOfferColOp: [], newReceivingColOp: [], newOfferColOnhand: [], newReceivingColOnhand: []}
    if (latestOffer.trade.offer.pokemon !== undefined && receivingCol !== undefined) { //receivingCol can be undefined for deleting a collection during a pending trade
        data.newReceivingColOp = receivingCol.ownedPokemon.map(p => { //setting offered pokemon as pending, or cancelling it
            if (p.disabled) {return p}
            const newBallData = {}
            Object.keys(p.balls).forEach(ball => {
                const ballData = p.balls[ball]
                if (ballData.disabled) {newBallData[ball] = ballData}
                else {
                    const isBeingReceived = latestOffer.trade.offer.pokemon.filter(tradeP => (tradeP.name === p.name || tradeP.for === p.name) && tradeP.balls.filter(tradePBallData => tradePBallData.ball === ball).length !== 0).length !== 0
                    if (!isBeingReceived) {newBallData[ball] = ballData}
                    else {
                        if (cancel) { //if cancelling the pending trade instead
                            // const newSpecificBallData = ballData.isOwned ? ballData : {...ballData, pending: undefined}
                            const copyOfBallData = {...ballData}
                            if (copyOfBallData.pending) {
                                delete copyOfBallData.pending
                            }
                            newBallData[ball] = copyOfBallData
                        } else {
                            const newSpecificBallData = ballData.isOwned ? ballData : {...ballData, pending: true}
                            if (newSpecificBallData.highlyWanted) {
                                delete newSpecificBallData.highlyWanted
                            }
                            newBallData[ball] = newSpecificBallData
                        }
                    }
                }
            })
            return {...p, balls: newBallData}
        })
        data.newReceivingColOnhand = receivingCol.onHand.map(p => { 
            const offeringPokemon = latestOffer.trade.receiving.pokemon.filter(tradeP => tradeP.balls.filter(tradePBallData => tradePBallData.onhandId !== undefined && tradePBallData.onhandId.toString() === p._id.toString()).length !== 0).length !== 0
            if (offeringPokemon) {
                if (cancel) {
                    if (p.reserved === 1) {
                        p.reserved = undefined
                    } else if (typeof p.reserved === 'number') {
                        p.reserved -= 1
                    } 
                } else {
                    if (p.reserved === undefined) {
                        p.reserved = 1
                    } else {
                        if (p.reserved < p.qty) {
                            p.reserved += 1
                        } 
                    } 
                } 
            }
            return p
        }).filter(p => p !== undefined)
    }

    if (latestOffer.trade.receiving.pokemon !== undefined && offerCol !== undefined) {
        data.newOfferColOp = offerCol.ownedPokemon.map(p => { //setting received pokemon as pending
            if (p.disabled) {return p}
            const newBallData = {}
            Object.keys(p.balls).forEach(ball => {
                const ballData = p.balls[ball]
                if (ballData.disabled) {newBallData[ball] = ballData}
                else {
                    const isBeingReceived = latestOffer.trade.receiving.pokemon.filter(tradeP => (tradeP.name === p.name || tradeP.for === p.name) && tradeP.balls.filter(tradePBallData => tradePBallData.ball === ball).length !== 0).length !== 0
                    if (!isBeingReceived) {newBallData[ball] = ballData}
                    else {
                        if (cancel) {
                            const copyOfBallData = {...ballData}
                            if (copyOfBallData.pending) {
                                delete copyOfBallData.pending
                            }
                            newBallData[ball] = copyOfBallData
                        } else {
                            const newSpecificBallData = ballData.isOwned ? ballData : {...ballData, pending: true}
                            if (newSpecificBallData.highlyWanted) {
                                delete newSpecificBallData.highlyWanted
                            }
                            newBallData[ball] = newSpecificBallData
                        }
                        
                    }
                }
            })
            return {...p, balls: newBallData}
        })
        if (cancel) {
            data.newOfferColOnhand = offerCol.onHand.map(p => { 
                const offeringPokemon = latestOffer.trade.offer.pokemon.filter(tradeP => tradeP.balls.filter(tradePBallData => tradePBallData.onhandId !== undefined && tradePBallData.onhandId.toString() === p._id.toString()).length !== 0).length !== 0
                if (offeringPokemon) {
                    if (p.reserved === 1) {
                        p.reserved = undefined
                    } else if (typeof p.reserved === 'number') {
                        p.reserved -= 1
                    } 
                }
                return p
            }).filter(p => p !== undefined)
        }
    }
    return data
}

export {setPendingTrade}