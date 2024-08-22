import User from '../../models/users.js'
import bcrypt from 'bcrypt'

export async function editUserSettings(req, res) {
    const {settingType, username} = req.params
    const {newSettings, miscData} = req.body
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
    if (settingType === 'blockUser') { //this is only when blocking/unblocking a specific user from their profile, not from the settings (which can only unblock users)
        if (username === newSettings) {
            const exception = new Error()
            exception.name = 'Bad Request'
            exception.message = `You cannot block yourself!`
            exception.status = 400
            return res.status(400).send(exception)
        }
        const userIsBlocked = user.settings.privacy.blockedUsers.includes(newSettings) //newSettings refers to the user in this case
        const blockUserSearch = await User.findOne({username: {$regex: new RegExp(`^${newSettings}$`, 'i')}})
        if (blockUserSearch === null) {
            const exception = new Error()
            exception.name = 'Not Found'
            exception.message = `Could not find the user to block with this username!`
            exception.status = 404
            return res.status(404).send(exception)
        }
        if (userIsBlocked) {
            user.settings.privacy.blockedUsers = user.settings.privacy.blockedUsers.filter(user => user !== newSettings)
        } else {
            user.settings.privacy.blockedUsers = [...user.settings.privacy.blockedUsers, newSettings]
        }
    } else {
        user.settings[settingType] = newSettings
    }
    await user.save()
    res.end()
}

export async function changeUserPassword(req, res) {
    const {username} = req.params
    const {currPassword, newPassword} = req.body
    if (!currPassword || !newPassword || typeof currPassword !== 'string' || typeof newPassword !== 'string') {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `One or more inputs were invalid. Try again!`
        exception.status = 400
        return res.status(400).send(exception)
    }
    const passwordFitsRequirements = newPassword.length >= 8 &&
        newPassword !== newPassword.toLowerCase() && newPassword !== newPassword.toUpperCase() &&//checks if theres at least one upper and lower case letter 
        /\d/.test(newPassword) //checks if theres a number
    if (!passwordFitsRequirements) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `The password did not fit site requirements. Please try again!`
        exception.status = 400
        return res.status(400).send(exception)
    }
    const user = await User.findOne({username: {$regex: new RegExp(`^${username}$`, 'i')}})
    if (!bcrypt.compareSync(currPassword, user.password)) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = `The password was incorrect!`
        exception.status = 403
        return res.status(403).send(exception)
    }
    bcrypt.hash(newPassword, 11, async function(err, hash) {
        user.password = hash
        await user.save()
        res.end()
    })
}

export async function readUserNotification(req, res) {
    const {noteId, tradeId} = req.body
    const userRegex = `^${req.params.username}$`
    const user = await User.findOne({username: {$regex: new RegExp(userRegex, 'i')}})
    user.notifications.forEach((noti) => {
        if (tradeId !== undefined) {
            if (noti.type.includes('trade-offer')) {
                const isTradeOffer = noti.tradeData.tradeId === tradeId
                if (isTradeOffer) {
                    noti.unread = false
                }
            }
        } else {
            const isNotification = noti._id.toString() === noteId
            if (isNotification) {
                noti.unread = false
            }
        }
    })
    await user.save()
    res.end()
}