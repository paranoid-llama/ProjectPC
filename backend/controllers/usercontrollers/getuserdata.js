import User from '../../models/users.js'
import Trade from '../../models/trades.js'

export async function getUser(req, res) {
    const userRegex = `^${req.params.username}$`
    const user = await User.findOne({username: {$regex: new RegExp(userRegex, 'i')}}).populate({path: 'collections'})
    if (user === null) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = "Could not find a user with this username!"
        exception.status = 404
        return res.status(404).send(exception)
    }
    res.json(user)
}

export async function getUserTrades(req, res) {
    const userRegex = `^${req.params.username}$`
    const user = await User.find({username: {$regex: new RegExp(userRegex, 'i')}})
    const allTheirTrades = await Trade.find({'users[1]': user._id, 'users[0]': user._id}).select('-history').populate({path: 'users', select: 'username'})

    res.json({user: user[0], trades: allTheirTrades})
}