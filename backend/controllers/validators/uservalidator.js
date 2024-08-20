import User from '../../models/users.js'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const usernameRegex = /^[a-zA-Z0-9\$\(\)\-\_\;\:\'\,\. ]+[a-zA-Z0-9\$\(\)\-\_\;\:\'\,\.]*$/i
const reservedWordsForUsers = ['login', 'logout', 'settings', 'deleted']

export default async function validateNewUserData(req, res, next) {
    const {username, password, email, secAnswer1, secAnswer2, secAnswer3} = req.body

    const searchUserRegex = `^${username}$`
    const usersWithThatUsername = await User.findOne({username: {$regex: new RegExp(searchUserRegex, 'i')}})
    const userIsAvailable = usersWithThatUsername === null
    const doubleSpaceMatches = [...username.matchAll(new RegExp('  ', 'gi'))].length !== 0
    const usernameFitsRequirements = (usernameRegex.test(username)) &&
        (username[0] !== ' ' && username[username.length-1] !== ' ') && !(doubleSpaceMatches) &&
        (username.length >= 4 && username.length <= 24) && userIsAvailable && !reservedWordsForUsers.includes(username.toLowerCase())

    if (!usernameFitsRequirements) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `The username did not fit site requirements. Please try again!`
        exception.status = 400
        return res.status(400).send(exception)
    }

    const passwordFitsRequirements = password.length >= 8 &&
        password !== password.toLowerCase() && password !== password.toUpperCase() &&//checks if theres at least one upper and lower case letter 
        /\d/.test(password) //checks if theres a number

    if (!passwordFitsRequirements) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `The password did not fit site requirements. Please try again!`
        exception.status = 400
        return res.status(400).send(exception)
    }

    const usersWithThatEmail = await User.findOne({email})
    const emailIsAvailable = usersWithThatEmail === null
    const emailFitsRequirements = emailRegex.test(email) && emailIsAvailable

    if (!emailFitsRequirements) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `The email is invalid. Please try again!`
        exception.status = 400
        return res.status(400).send(exception)
    }

    const atLeastOneSecQuestionAnswered = secAnswer1 !== undefined || secAnswer2 !== undefined || secAnswer3 !== undefined
    if (!atLeastOneSecQuestionAnswered) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `Every security question was left unanswered. Please try again!`
        exception.status = 400
        return res.status(400).send(exception)
    }
    
    next()
}