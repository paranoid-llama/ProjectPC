import User from '../../models/users.js'

export async function userLogin(req, res) {
    res.send(req.sessionID)
}

export async function userLogout(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err) }
        res.end()
    })
}