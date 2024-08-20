import Collection from './collections.js'
import User from './users.js'
import { setPendingTrade } from '../controllers/tradecontrollers/colmanagementfuncs.js'

export const postDeleteColEditTradeCol = async (trade, userPos) => {
    const latestOffer = trade.history[trade.history.length-1]
    const otherUser = await User.findById(trade.users.filter((id, idx) => idx !== userPos)[0]).populate({path: 'collections', select: 'gen'})
    const otherUserCol = await Collection.findById(otherUser.collections.filter(col => {
        const userPos = trade.users.indexOf(otherUser._id)
        const gen = trade.gen.includes('-') ? (userPos === 0 ? trade.gen.slice(0, trade.gen.indexOf('-')) : trade.gen.slice(trade.gen.indexOf('-')+1, trade.gen.length)) : trade.gen
        return gen === col.gen
    })[0]._id)
    const otherUserOfferRef = latestOffer.offerer === otherUser.username ? 'offerer' : 'recipient'
    const {
        newOfferColOp, 
        newReceivingColOp, 
        newOfferColOnhand, 
        newReceivingColOnhand} = setPendingTrade(otherUserOfferRef === 'offerer' ? otherUserCol : undefined, otherUserOfferRef === 'recipient' ? otherUserCol : undefined, latestOffer, true)
    otherUserCol.ownedPokemon = otherUserOfferRef === 'offerer' ? newOfferColOp : newReceivingColOp
    otherUserCol.onHand = otherUserOfferRef === 'offerer' ? newOfferColOnhand : newReceivingColOnhand   
    otherUserCol.save()  

    otherUser.notifications.filter(noti => noti.tradeData === undefined ? true : noti.tradeData.tradeId.toString() !== trade._id.toString())
    otherUser.notifications.push({type: 'trade-offer: cancel', tradeData: {otherParticipant: latestOffer.offerer === otherUser.username ? latestOffer.recipient : latestOffer.offerer, tradeGen: trade.gen, tradeId: trade._id}, unread: true})
    if (otherUser.notifications.length > 40) {
        otherUser.notifications.shift()
    }   
    otherUser.save()
}


export const deletedUserNotifications = async (deletedUsername) => {
    const allAffectedUsers = await User.find({$or: [{'settings.privacy.blockedUsers': deletedUsername}, {'notifications.tradeData.otherParticipant': deletedUsername}]})
    allAffectedUsers.forEach(async(user) => {
        user.settings.privacy.blockedUsers = user.settings.privacy.blockedUsers.filter(username => username !== deletedUsername)
        user.notifications = user.notifications.map(noti => {
            const affectedNotification = noti.type.includes('trade-offer') && noti.tradeData !== undefined && noti.tradeData.otherParticipant === deletedUsername
            if (affectedNotification) {
                noti.tradeData.otherParticipant = 'deleted'
            } 
            return noti
        })
        await user.save()
    })
} 