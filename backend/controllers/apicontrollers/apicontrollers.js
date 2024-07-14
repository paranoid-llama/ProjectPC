import User from '../../models/users.js'

export async function getSession(req, res) {
    const noUser = req.session.passport === undefined
    if (noUser) {
        res.json({})
    } else {
        const userData = await User.findById(req.session.passport.user).lean().populate({path: 'collections', select: 'type gen -owner'}).select('username collections notifications.unread').exec()
        res.json(userData)
    }
}

export async function checkUsernameEmailAvailability(req, res) {
    const {username, email, checkEmailInstead} = req.query
    const usernameQuery = !checkEmailInstead && `^${username}$`
    const search = await User.find(checkEmailInstead ? {email} : {username: {$regex: new RegExp(usernameQuery, "i")}}).exec()
    const userWithThatName = Object.keys(search).length !== 0
    if (userWithThatName) {
        res.json({available: false})
    } else {
        res.json({available: true})
    }
}