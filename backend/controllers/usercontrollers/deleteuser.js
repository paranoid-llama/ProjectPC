import User from '../../models/users.js'
import bcrypt from 'bcrypt'

export async function deleteUser(req, res) {
    const {username} = req.params
    const {inputPassword} = req.body
    const usernameSearchRegex =  `^${username}$`
    const user = await User.findOne({username: {$regex: new RegExp(usernameSearchRegex, 'i')}})
    if (user === null) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find a user with this username!`
        exception.status = 404
        return res.status(404).send(exception)
    }
    if (!inputPassword || typeof inputPassword !== 'string') {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `One or more inputs were invalid. Try again!`
        exception.status = 400
        return res.status(400).send(exception)
    }
    if (!bcrypt.compareSync(inputPassword, user.password)) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = `The password was incorrect!`
        exception.status = 403
        return res.status(403).send(exception)
    }
    req.logout(function(err) {
        if (err) { return next(err) }
    })
    await User.findByIdAndDelete(user._id)
    res.end()
}