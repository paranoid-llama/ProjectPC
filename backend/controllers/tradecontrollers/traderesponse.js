import Trade from '../../models/trades.js'
import Collection from '../../models/collections.js'
import User from '../../models/users.js'

export async function respondToTrade(req, res) {
    const {response, otherUserId, offerColId, receivingColId, counterOfferData, username} = req.body
    const {id} = req.params

    const trade = await Trade.findById(id)
    if (trade === null) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find a trade with this ID!`
        exception.status = 404
        return res.status(404).send(exception)
    }
    const latestOffer = trade.history[trade.history.length-1]

    if (response === 'accept') {
        trade.status = 'pending'
        trade.history[trade.history.length-1].status = 'accepted'
        trade.markedCompleteBy = ''
        trade.save()

        const offerCol = await Collection.findById(offerColId)
        const receivingCol = await Collection.findById(receivingColId)
        if (latestOffer.trade.offer.pokemon !== undefined) {
            offerCol.onHand = offerCol.onHand.map(p => { //taking off onhand if offering an onhand
                const offeringPokemon = latestOffer.trade.offer.pokemon.filter(tradeP => tradeP.balls.filter(tradePBallData => tradePBallData.onhandId !== undefined && tradePBallData.onhandId === p._id.toString()).length !== 0).length !== 0
                if (offeringPokemon) {
                    p.qty = p.qty-1
                    if (p.qty === 0) {return undefined}
                }
                return p
            }).filter(p => p !== undefined)
            receivingCol.ownedPokemon = receivingCol.ownedPokemon.map(p => { //setting offered pokemon as pending
                if (p.disabled) {return p}
                const newBallData = {}
                Object.keys(p.balls).forEach(ball => {
                    const ballData = p.balls[ball]
                    if (ballData.disabled) {newBallData[ball] = ballData}
                    else {
                        const isBeingReceived = latestOffer.trade.offer.pokemon.filter(tradeP => (tradeP.name === p.name || tradeP.for === p.name) && tradeP.balls.filter(tradePBallData => tradePBallData.ball === ball).length !== 0).length !== 0
                        if (!isBeingReceived) {newBallData[ball] = ballData}
                        else {
                            const newSpecificBallData = ballData.isOwned ? ballData : {...ballData, pending: true}
                            if (newSpecificBallData.highlyWanted) {
                                delete newSpecificBallData.highlyWanted
                            }
                            newBallData[ball] = newSpecificBallData
                        }
                    }
                })
                return {...p, balls: newBallData}
            })
        }
        if (latestOffer.trade.receiving.items !== undefined) {
            offerCol.ownedPokemon = offerCol.ownedPokemon.map(p => { //setting received pokemon as pending
                if (p.disabled) {return p}
                const newBallData = {}
                Object.keys(p.balls).forEach(ball => {
                    const ballData = p.balls[ball]
                    if (ballData.disabled) {newBallData[ball] = ballData}
                    else {
                        const isBeingReceived = latestOffer.trade.receiving.pokemon.filter(tradeP => (tradeP.name === p.name || tradeP.for === p.name) && tradeP.balls.filter(tradePBallData => tradePBallData.ball === ball).length !== 0).length !== 0
                        if (!isBeingReceived) {newBallData[ball] = ballData}
                        else {
                            const newSpecificBallData = ballData.isOwned ? ballData : {...ballData, pending: true}
                            if (newSpecificBallData.highlyWanted) {
                                delete newSpecificBallData.highlyWanted
                            }
                            newBallData[ball] = newSpecificBallData
                        }
                    }
                })
                return {...p, balls: newBallData}
            })
            receivingCol.onHand = receivingCol.onHand.map(p => { //taking off onhand if offering an onhand
                const offeringPokemon = latestOffer.trade.receiving.pokemon.filter(tradeP => tradeP.balls.filter(tradePBallData => tradePBallData.onhandId !== undefined && tradePBallData.onhandId === p._id).length !== 0).length !== 0
                if (offeringPokemon) {
                    p.qty = p.qty-1
                    if (p.qty === 0) {return undefined}
                }
                return p
            }).filter(p => p !== undefined)
        }
        offerCol.save()
        receivingCol.save()

        const otherUser = await User.findById(otherUserId)
        otherUser.notifications.push({type: 'trade-offer: accept', tradeData: {otherParticipant: username, tradeGen: trade.gen, tradeId: trade._id}, unread: true})
        otherUser.save()

    } else if (response === 'reject') {
        trade.status = 'rejected'
        latestOffer.status = 'rejected'
        trade.closeDate = Date.now()
        trade.save()

        const otherUser = await User.findById(otherUserId)
        otherUser.notifications.push({type: 'trade-offer: reject', tradeData: {otherParticipant: username, tradeGen: trade.gen, tradeId: trade._id}, unread: true})
        otherUser.save()
    } else if (response === 'counter') {
        trade.status = 'counteroffer'
        latestOffer.status = 'countered'
        trade.history.push({...counterOfferData})
        trade.save()

        const otherUser = await User.findById(otherUserId)
        otherUser.notifications.push({type: 'trade-offer: counter', tradeData: {otherParticipant: username, tradeGen: trade.gen, tradeId: trade._id}, unread: true})
        otherUser.save()
    } else if (response === 'markAsComplete') {
        if (trade.markedCompleteBy === username) {
            trade.markedCompleteBy = ''
            trade.save()
        } else if (trade.markedCompleteBy === '') {
            trade.markedCompleteBy = username
            trade.save()
        } else {
            trade.markedCompleteBy = 'both',
            trade.status = 'completed'
            trade.closeDate = Date.now()
            trade.save()

            const offerCol = await Collection.findById(offerColId)
            const receivingCol = await Collection.findById(receivingColId)

            if (latestOffer.trade.receiving.pokemon !== undefined) {
                offerCol.ownedPokemon = offerCol.ownedPokemon.map((poke) => {
                    if (poke.disabled) {return poke}
                    const newBallData = {}
                    Object.keys(poke.balls).forEach(ball => {
                        const ballData = poke.balls[ball]
                        if (ballData.disabled) {newBallData[ball] = ballData}
                        else {
                            const ballComboTradeData = latestOffer.trade.receiving.pokemon.filter(p => (p.for === poke.name || p.name === poke.name) && (p.balls.filter(bD => bD.ball === ball).length !== 0))
                            const ballComboBeingReceived = ballComboTradeData.length !== 0 && ballData.isOwned === false
                            
                            if (ballComboBeingReceived) {
                                const ballTradeData = ballComboTradeData[0].balls.filter(bD => bD.ball === ball)[0]
                                const haData = ballTradeData.isHA !== undefined ? {isHA: ballTradeData.isHA} : {}
                                const emData = ballTradeData.emCount !== undefined && !(offerCol.gen === 'home') ? {emCount: ballTradeData.emCount, EMs: ballTradeData.EMs} : {}
                                const defaultData = ballData.default !== undefined ? {default: ballData.default} : {}
                                newBallData[ball] = {
                                    isOwned: true,
                                    ...haData,
                                    ...emData,
                                    ...defaultData
                                }
                            }
                            else {newBallData[ball] = ballData}
                        }
                    }) 
                    return {...poke, balls: newBallData}
                })
            }
            if (latestOffer.trade.offer.pokemon !== undefined) {
                receivingCol.ownedPokemon = receivingCol.ownedPokemon.map((poke) => {
                    if (poke.disabled) {return poke}
                    const newBallData = {}
                    Object.keys(poke.balls).forEach(ball => {
                        const ballData = poke.balls[ball]
                        if (ballData.disabled) {newBallData[ball] = ballData}
                        else {
                            const ballComboTradeData = latestOffer.trade.offer.pokemon.filter(p => (p.for === poke.name || p.name === poke.name) && (p.balls.filter(bD => bD.ball === ball).length !== 0))
                            const ballComboBeingReceived = ballComboTradeData.length !== 0 && ballData.isOwned === false
                            if (ballComboBeingReceived) {
                                const ballTradeData = ballComboTradeData[0].balls.filter(bD => bD.ball === ball)[0]
                                const haData = ballTradeData.isHA !== undefined ? {isHA: ballTradeData.isHA} : {}
                                const emData = ballTradeData.emCount !== undefined && !(receivingCol.gen === 'home') ? {emCount: ballTradeData.emCount, EMs: ballTradeData.EMs} : {}
                                const defaultData = ballData.default !== undefined ? {default: ballData.default} : {}
                                newBallData[ball] = {
                                    isOwned: true,
                                    ...haData,
                                    ...emData,
                                    ...defaultData
                                }
                            }
                            else {newBallData[ball] = ballData}
                        }
                    }) 
                    return {...poke, balls: newBallData}
                })
            }
            if (latestOffer.trade.offer.items !== undefined) {
                latestOffer.trade.offer.items.forEach(itemD => {
                    const itemName = itemD.name
                    const hasFtItem = offerCol.options.tradePreferences.ftItems[itemName] !== undefined
                    if (hasFtItem) {
                        const setFtItemTo0 = itemD.qty >= offerCol.options.tradePreferences.ftItems[itemName]
                        if (setFtItemTo0) {
                            delete offerCol.options.tradePreferences.ftItems[itemName]
                        } else {
                            offerCol.options.tradePreferences.ftItems[itemName] = offerCol.options.tradePreferences.ftItems[itemName] - itemD.qty
                        }
                        
                    }
                })
            }
            if (latestOffer.trade.receiving.items !== undefined) {
                latestOffer.trade.receiving.items.forEach(itemD => {
                    const itemName = itemD.name
                    const hasFtItem = receivingCol.options.tradePreferences.ftItems[itemName] !== undefined
                    if (hasFtItem) {
                        const setFtItemTo0 = itemD.qty >= receivingCol.options.tradePreferences.ftItems[itemName]
                        if (setFtItemTo0) {
                            delete receivingCol.options.tradePreferences.ftItems[itemName]
                        } else {
                            receivingCol.options.tradePreferences.ftItems[itemName] = receivingCol.options.tradePreferences.ftItems[itemName] - itemD.qty
                        }
                        
                    }
                })
            }
            offerCol.save()
            receivingCol.save()
        }
    }
    res.end()
}