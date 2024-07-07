import Trade from '../../models/trades.js'
import User from '../../models/users.js'

export async function createNewTrade(req, res) {
    const {offer, receiving, offerMessage, traderId, ownerId, traderUsername, ownerUsername, gen} = req.body
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
        history: [offerObj]
    }
    const trade = new Trade(newTradeData)
    await trade.save()

    const ownerUserData = await User.findById(ownerId)
    ownerUserData.notifications.push({type: 'trade-offer: new', tradeData: {otherParticipant: traderUsername, tradeGen: gen, tradeId: trade._id}, unread: true})
    await ownerUserData.save()

    res.json(trade._id)
}