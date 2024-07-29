import User from '../../models/users.js'

export async function editUserSettings(req, res) {
    const {settingType, username} = req.params
    const {newSettings} = req.body
    const usernameSearchRegex =  `^${username}$`
    // const setModifier = {[`settings.${settingType}`]: newSettings}
    const user = await User.findOne({username: {$regex: new RegExp(usernameSearchRegex, 'i')}})
    if (user === null) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find a user with this username!`
        exception.status = 404
        return res.status(404).send(exception)
    }
    user.settings[settingType] = newSettings
    await user.save()
    res.end()
}

export async function readUserNotification(req, res) {
    const {noteId, tradeId} = req.body
    const userRegex = `^${req.params.username}$`
    const user = await User.findOne({username: {$regex: new RegExp(userRegex, 'i')}})
    user.notifications.forEach((noti) => {
        if (tradeId !== undefined) {
            if (noti.type.includes('trade-offer')) {
                const isTradeOffer = noti.tradeData.tradeId === tradeId
                if (isTradeOffer) {noti.unread = false}
            }
        } else {
            const isNotification = noti._id === noteId
            if (isNotification) {noti.unread = false}
        }
    })
    user.save()
    res.end()
}