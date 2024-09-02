import passport from "passport";
import LocalStrategy from "passport-local"
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import User from "./models/users.js";
import Collection from './models/collections.js'
import Trade from './models/trades.js'
import { collectionSubTypes } from "./common/infoconstants/miscconstants.mjs";

const initializePassportStrategy = () => passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await User.findOne({$or: [{username}, {email: username}]})
            if (!user) {return done(null, false)}
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false) }
            return done(null, user)
        } catch (e) {
            return done(e)
        }
    }
))

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        const exception = new Error()
        exception.name = 'Unauthorized'
        exception.message = 'You must be logged in to perform this action!'
        exception.status = 401
        return res.status(401).send(exception)
    }
    next()
}

const isSiteOwner = async(req, res, next) => {
    const isSiteOwner = req.user !== undefined && req.user.accountType === 'owner'
    if (!isSiteOwner) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = "You aren't allowed to perform this action!"
        exception.status = 403
        return res.status(403).send(exception)
    }
    next()
}

const isCollectionOwner = async(req, res, next) => {
    const { id } = req.params
    const collection = await Collection.findById(id)
    const isCollectionOwner = collection.owner.toString() === req.user._id.toString()
    if (!isCollectionOwner) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = "You must be the collection's owner to perform this action!"
        exception.status = 403
        return res.status(403).send(exception)
    }
    next()
}

const isTheUser = (req, res, next) => {
    const { username } = req.params
    const isTheUser = username === req.user.username
    if (!isTheUser) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = "You must be the user to perform this action!"
        exception.status = 403
        return res.status(403).send(exception)
    }
    next()
}

const isValidId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = "Invalid ID. Double-check to ensure it's correct!"
        exception.status = 400
        return res.status(400).send(exception)
    }
    next()
}

const isValidOnHandId = (req, res, next) => {
    const {editType, pokemonId, idOfPokemon} = req.body //single value update uses "idOfPokemon" while delete on hand uses "pokemonId". probably should have it uniform.
    const actualId = (editType !== undefined && editType === 'singleValue' && idOfPokemon !== undefined) ? idOfPokemon : pokemonId 
    if (Array.isArray(actualId)) {//batch deletes
        const validId = actualId.map(id => mongoose.Types.ObjectId.isValid(id))
        if (validId.includes(false)) {
            const exception = new Error()
            exception.name = 'Bad Request'
            exception.message = "One of the On-Hands have an invalid On-Hand ID!"
            exception.status = 400
            return res.status(400).send(exception)
        }
    } else {
        if (actualId !== undefined && !mongoose.Types.ObjectId.isValid(actualId)) { 
            const exception = new Error()
            exception.name = 'Bad Request'
            exception.message = "Invalid On-Hand ID!"
            exception.status = 400
            return res.status(400).send(exception)
        } 
    }
    
    next()
}

const usernameRegex = /^[a-zA-Z0-9\$\(\)\-\_\;\:\'\,\. ]+[a-zA-Z0-9\$\(\)\-\_\;\:\'\,\.]*$/i
const reservedWordsForUsernames = ['new', 'login', 'logout', 'settings']

const isValidUsername = (req, res, next) => {
    const { username } = req.params
    const usernameFitsRegexAndLength = usernameRegex.test(username) && username.length >= 4 && username.length <= 24 && !reservedWordsForUsernames.includes(username)
    if (!usernameFitsRegexAndLength) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = "The provided username does not fit requirements. Double-check that it's spelled correctly!"
        exception.status = 400
        return res.status(400).send(exception)
    }
    next()
}

const tradeExists = async(req, res, next) => {
    const {id} = req.params
    const trade = await Trade.findById(id)
    if (!trade) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find a trade with this ID!`
        exception.status = 404
        return res.status(404).send(exception)
    }
    next()
}

const canOfferTrade = async(req, res, next) => {
    const {traderId, ownerId, traderUsername, ownerUsername, gen} = req.body
    if (!mongoose.Types.ObjectId.isValid(traderId) || !mongoose.Types.ObjectId.isValid(ownerId)) {
        const bothIdsInvalid = !mongoose.Types.ObjectId.isValid(traderId) && !mongoose.Types.ObjectId.isValid(ownerId)
        const justTraderIdInvalid = !mongoose.Types.ObjectId.isValid(traderId) 
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `Invalid ${bothIdsInvalid ? 'Trader/Recipient' : justTraderIdInvalid ? 'Trader' : 'Recipient'} ID.`
        exception.status = 400
        return res.status(400).send(exception)
    }
    const traderData = await User.findById(traderId).populate({path: 'collections', select: 'gen'})
    const ownerData = await User.findById(ownerId).populate({path: 'collections', select: 'gen options'})
    if (traderData === null || ownerData === null) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find ${traderData === null && ownerData === null ? 'either' : traderData === null ? 'trader' : 'recipient'} user's data.`
        exception.status = 404
        return res.status(404).send(exception)
    }
    if (traderData.username !== traderUsername || ownerData.username !== ownerUsername) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `The usernames inputted did not match what we found in the database.`
        exception.status = 400
        return res.status(400).send(exception)
    }
    const stringTradeGen = typeof gen === 'string'
    const validTradeGen = stringTradeGen && ((collectionSubTypes.aprimon.value.includes(isNaN(parseInt(gen)) ? gen : parseInt(gen))) || 
        (gen.includes('-') && 
            collectionSubTypes.aprimon.value.includes(isNaN(parseInt(gen.slice(0, gen.indexOf('-')))) ? gen.slice(0, gen.indexOf('-')) : parseInt(gen.slice(0, gen.indexOf('-')))) &&
            collectionSubTypes.aprimon.value.includes(isNaN(parseInt(gen.slice(gen.indexOf('-')+1, gen.length))) ? gen.slice(gen.indexOf('-')+1, gen.length) : parseInt(gen.slice(gen.indexOf('-')+1, gen.length)))
        ))
    if (!validTradeGen) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `The input trade generation does not follow server's format.`
        exception.status = 400
        return res.status(400).send(exception)
    }
    const traderGenCol = gen.includes('-') ? gen.slice(0, gen.indexOf('-')) : gen
    const ownerGenCol = gen.includes('-') ? gen.slice(gen.indexOf('-')+1, gen.length) : gen
    const traderHasColOfGen = traderData.collections.filter(traderCol => traderCol.gen === traderGenCol).length !== 0
    const ownerHasColOfGen = ownerData.collections.filter(ownerCol => ownerCol.gen === ownerGenCol).length !== 0
    if (!traderHasColOfGen || !ownerHasColOfGen) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `Could not detect a collection with the right generation in ${!traderHasColOfGen && !ownerHasColOfGen ? 'either' : !traderHasColOfGen ? 'the trader' : 'the recipient'} user's data.`
        exception.status = 400
        return res.status(400).send(exception)
    }
    const gensCanTradeWithEachOther = gen.includes('-') ? (gen.includes('home') && (!gen.includes('7') && !gen.includes('6'))) : true
    if (!gensCanTradeWithEachOther) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `The generations that were selected cannot trade with each other!`
        exception.status = 400
        return res.status(400).send(exception)
    }
    const ownerTradeStatusOpen = ownerData.collections.filter(ownerCol => ownerCol.gen === ownerGenCol)[0].options.tradePreferences.status === 'open'
    if (!ownerTradeStatusOpen) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = `The other collection has their trade status closed!`
        exception.status = 403
        return res.status(403).send(exception)
    }
    if (ownerData.settings.privacy.disabledTrades) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = `This user has trades disabled!`
        exception.status = 403
        return res.status(403).send(exception)
    }
    const traderIsBlockedByOwner = ownerData.settings.privacy.blockedUsers.includes(traderData.username)
    if (traderIsBlockedByOwner) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = `You were blocked by this user and cannot trade with them!`
        exception.status = 403
        return res.status(403).send(exception)
    }
    next()
}

const canRespondToTrade = async(req, res, next) => {
    const { id } = req.params
    const {response} = req.body
    const tradeData = await Trade.findById(id)
    if (tradeData === null) {
        const exception = new Error()
        exception.name = 'Not Found'
        exception.message = `Could not find a trade with this ID!`
        exception.status = 404
        return res.status(404).send(exception)
    }
    const tradeIsOver = tradeData.status === 'completed' || tradeData.status === 'rejected' || tradeData.status === 'cancelled'
    if (tradeIsOver) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = `This trade is over already and cannot be updated!`
        exception.status = 403
        return res.status(403).send(exception)
    }
    const isTradeParticipant = tradeData.users.map(userIds => userIds.toString()).includes(req.user._id.toString())
    if (!isTradeParticipant) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = `You are not one of the participants in this trade!`
        exception.status = 403
        return res.status(403).send(exception)
    }
    const isOfferedUser = tradeData.history[tradeData.history.length-1].recipient === req.user.username
    const cannotCancel = (response === 'cancel' && isOfferedUser && tradeData.status !== 'pending' )
    const cannotRespond = (tradeData.status !== 'pending' && !isOfferedUser && response !== 'cancel')
    if (cannotRespond || cannotCancel) {
        const exception = new Error()
        exception.name = 'Forbidden'
        exception.message = cannotRespond ? `You cannot reply to this offer! You have to wait for the recipient to respond!` : 'You cannot cancel the trade! The other user is awaiting a response!'
        exception.status = 403
        return res.status(403).send(exception)
    }
    next()
}

export {initializePassportStrategy, 
    isLoggedIn, 
    isSiteOwner,
    isCollectionOwner, 
    isTheUser, 
    canOfferTrade, 
    canRespondToTrade, 
    isValidId, 
    isValidOnHandId, 
    isValidUsername, 
    tradeExists
}