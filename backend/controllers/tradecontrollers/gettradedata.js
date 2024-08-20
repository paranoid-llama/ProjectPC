import Trade from '../../models/trades.js'
import Collection from '../../models/collections.js'

export async function getTradeData(req, res) {
    const {getFullCollectionData} = req.query
    const latestOfferData = {}
    const trade = await Trade.findById(req.params.id).lean()
        .populate({path: 'users', select: 'username collections notifications.tradeData.tradeId', populate: {path: 'collections', select: '_id name type gen'}})
        .then(data => { //bandaid solution to what should be solved through database queries - couldnt find how to do this.
            data.history = data.history.map((offer, idx) => {
                const isLatestOffer = idx+1 === data.history.length
                if (isLatestOffer) {
                    latestOfferData.data = offer
                }
                return {_id: offer._id, createdAt: offer.createdAt, offerer: offer.offerer}
            })
            data.users = data.users.map(userData => { //this part is used to see if theres any pending notifications
                if (userData.notifications === undefined) {return userData}
                userData.notifications = userData.notifications.filter(nData => nData.tradeData.tradeId === req.params.id)
                return userData
            })
            if (data.users.length === 1) { 
                //very bandaid solution to reacting to deleted users. populate doesnt return null for userIds they cant find, so im
                //just setting it myself.
                const userPos = data.history[0].offerer === data.users[0].username ? 0 : 1
                if (userPos === 0) {
                    data.users = [data.users[0], null]
                } else {
                    data.users = [null, data.users[0]]
                }
            }
            return data
        })
    //another bandaid solution to what should be solved through database queries/aggregation
    const crossGenTrade = trade.gen.includes('-')
    const newUsersArr = trade.users.map((userData, userIdx) => {
        if (userData === null) {return userData}
        // if (userData)
        const genRef = crossGenTrade ? (
            userIdx === 0 ? trade.gen.slice(0, trade.gen.indexOf('-')) : trade.gen.slice(trade.gen.indexOf('-')+1)
        ) : trade.gen
        const tradeCollectionData = userData.collections.filter(col => col.gen === genRef)[0]
        return {...userData, tradeCollection: tradeCollectionData}
    })
    const modifiedTradeData = {...trade, users: newUsersArr}

    if (getFullCollectionData === 'true') {
        const user0CollectionData = newUsersArr[0] === null ? {} : await Collection.findById(newUsersArr[0].tradeCollection._id).populate({path: 'owner'})
        const user1CollectionData = newUsersArr[1] === null ? {} : await Collection.findById(newUsersArr[1].tradeCollection._id).populate({path: 'owner'})
        res.json({tradeData: modifiedTradeData, latestOfferData: latestOfferData.data, user0CollectionData, user1CollectionData})
    } else {
        res.json({tradeData: modifiedTradeData, latestOfferData: latestOfferData.data}) 
    }
}

export async function getOfferData(req, res) {
    const {id, offerIdx} = req.params
    const offerData = await Trade.findById(id, 'history').lean()
    if (offerData === null) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find a trade with this ID!`
        exception.status = 404
        return res.status(404).send(exception)
    }
    res.json(offerData.history[offerIdx])
}