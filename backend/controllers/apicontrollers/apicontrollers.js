import User from '../../models/users.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()
import { sendForgotPasswordEmail } from '../../emails/gmailSender.js';

const jwtSecret = process.env.JWT_SECRET

export async function getSession(req, res) {
    const noUser = req.session === undefined || req.session.passport === undefined
    if (noUser) {
        res.json({})
    } else {
        const userData = await User.findById(req.session.passport.user).lean().populate({path: 'collections', select: 'type gen -owner'}).select('username collections notifications.unread settings.privacy.blockedUsers settings.display').exec()
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

export async function generateForgotPwTokenAndSendEmail(req, res) {
    const {email} = req.body
    const userData = await User.findOne({email: email})
    if (userData === null) {
        res.end()//no error handling here purposefully
    } else {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 10), //exp in 10 minutes
            data: email
        }, jwtSecret); 

        const handleEmailResponse = (sent) => {
            if (sent) {
                res.json({error: false})
            }
            if (!sent) {
                res.json({error: true})
            }
        }

        await sendForgotPasswordEmail(email, token, handleEmailResponse)
    }
}

export async function passJWTTokenToResetPassword(req, res) {
    const {token} = req.query
    if (!(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/.test(token))) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `Invalid Token.`
        exception.status = 400
        return res.status(400).send(exception)
    }
    jwt.verify(token, jwtSecret, (err, result) => {
        if (err) {
            const exception = new Error()
            exception.name = 'Bad Request'
            exception.message = `Invalid Token.`
            exception.status = 400
            return res.status(400).send(exception)
        } else {
            return res.json({data: result.data})
        }
    })
}

export async function resetPasswordWithJwt(req, res) {
    const {token} = req.query
    const {newPassword} = req.body

    const handleChangePassword = async(email) => {
        const user = await User.findOne({email})
        bcrypt.hash(newPassword, 11, async function(err, hash) {
            user.password = hash
            await user.save()
            res.end()
        })
    }

    jwt.verify(token, jwtSecret, (err, result) => {
        if (err) {
            const exception = new Error()
            exception.name = 'Forbidden'
            exception.message = `Token Expired.`
            exception.status = 403
            return res.status(403).send(exception)
        } else {
            const email = result.data
            handleChangePassword(email)
        }
    })
}