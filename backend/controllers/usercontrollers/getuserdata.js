import User from '../../models/users.js'
import Trade from '../../models/trades.js'

export async function getUser(req, res) {
    const user = await User.find({username: req.params.username}).populate({path: 'collections'})
    res.json(user[0])
}

export async function getUserTrades(req, res) {
    const user = await User.find({username: req.params.username})
    const allTheirTrades = await Trade.find({'users[1]': user._id, 'users[0]': user._id}).select('-history').populate({path: 'users', select: 'username'})

    res.json({user: user[0], trades: allTheirTrades})
}