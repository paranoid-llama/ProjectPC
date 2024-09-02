import User from "../../../models/users.js";

export default async function sendNotifications(req, res) {
    const {title, message, username, overrideNotiType} = req.body

    const notiType = overrideNotiType ? overrideNotiType : !username ? 'site update' : 'system'

    if (username) {
        const userRegex = `^${username}$`
        const user = await User.findOne({username: {$regex: new RegExp(userRegex, 'i')}})
        if (!user) {
            const exception = new Error()
            exception.name = 'Not Found'
            exception.message = "Could not find a user with this username!"
            exception.status = 404
            return res.status(404).send(exception)
        }
        user.notifications.push({type: notiType, title, message, unread: true})
        if (user.notifications.length > 40) {
            user.notifications.shift()
        }
        await user.save()
        res.end()
    } else {
        const allUsers = await User.find({})
        allUsers.forEach((user) => {
            user.notifications.push({type: notiType, title, message, unread: true})
            if (user.notifications.length > 40) {
                user.notifications.shift()
            }
            user.save()
        })
        res.end()
    }
}