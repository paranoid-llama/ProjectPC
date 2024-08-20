import User from '../../models/users.js'
import bcrypt from 'bcrypt'

export async function createNewUser(req, res) {
    const {username, password, email, secQuestion1, secQuestion2, secQuestion3, secAnswer1, secAnswer2, secAnswer3} = req.body
    const securityQuestions = [
        secAnswer1 === undefined ? undefined : {question: secQuestion1, answer: await bcrypt.hash(secAnswer1, 11)},
        secAnswer2 === undefined ? undefined : {question: secQuestion2, answer: await bcrypt.hash(secAnswer2, 11)},
        secAnswer3 === undefined ? undefined : {question: secQuestion3, answer: await bcrypt.hash(secAnswer3, 11)}
    ].filter(item => item !== undefined)
    const settings = {
        profile: {bio: '', badges: [], games: []},
        privacy: {disabledTrades: false, blockedUsers: []},
        account: {verified: false, securityQuestions},
        display: {pokemonNames: {general: {regionalForms: 'default', originRegionalForms: 'default', alternateForms: 'default'}, specific: {}}}
    }
    bcrypt.hash(password, 11, async function(err, hash) {
        const newUser = new User({
            username, 
            password: hash, 
            email, 
            settings, 
            notifications: [
                {
                    type: 'system', 
                    title: 'Welcome to Pokellections!', 
                    message: 'Welcome to Pokellections! Thank you for joining the site. We hope you enjoy aprimon collecting made easy!',
                    unread: true
                }
            ]
        })
        await newUser.save()
        res.json(newUser._id)
    })
}