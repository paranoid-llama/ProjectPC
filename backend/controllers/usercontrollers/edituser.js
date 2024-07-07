import User from '../../models/users.js'

export async function editUserSettings(req, res) {
    const {settingType} = req.params
    const {newSettings, userID} = req.body
    const setModifier = {[`settings.${settingType}`]: newSettings}
    await User.findByIdAndUpdate({_id: userID}, {$set: setModifier})
    res.end()
}

export async function readUserNotification(req, res) {
    const {noteId, tradeId} = req.body
    const user = await User.findOne({username: req.params.username})
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