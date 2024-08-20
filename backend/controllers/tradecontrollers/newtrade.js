import Trade from '../../models/trades.js'
import Collection from '../../models/collections.js'
import User from '../../models/users.js'
import { getOnhandIdsToReserve } from './collectioneditposttraderes.js'

export async function createNewTrade(req, res) {
    const {offer, receiving, offerMessage, traderId, ownerId, traderUsername, ownerUsername, gen, traderColId} = req.body
    const offerObj = {
        status: 'pending',
        offerer: traderUsername,
        recipient: ownerUsername,
        comment: offerMessage,
        trade: {
            offer,
            receiving
        }
    }
    const newTradeData = {
        status: 'initialoffer',
        gen,
        users: [traderId, ownerId],
        deletedCollection: {0: false, 1: false},
        history: [offerObj]
    }
    const trade = new Trade(newTradeData)
    await trade.save()

    const ownerUserData = await User.findById(ownerId)
    ownerUserData.notifications.push({type: 'trade-offer: new', tradeData: {otherParticipant: traderUsername, tradeGen: gen, tradeId: trade._id}, unread: true})
    if (ownerUserData.notifications.length > 40) {
        ownerUserData.notifications.shift()
    }
    await ownerUserData.save()

    const traderColData = await Collection.findById(traderColId)
    const onhandIdsToReserve = getOnhandIdsToReserve(offer.pokemon)
    if (onhandIdsToReserve.length !== 0) {
        traderColData.onHand = traderColData.onHand.map(onhandP => {
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
        await traderColData.save()
    }

    res.json(trade._id)
}