import express from 'express';
import cors from 'cors';
import nocache from 'nocache';
import mongoose from 'mongoose';
import allPokemon from './utils/aprimonAPI/allpokemoninfo.js';
import {formatImportQuery, setEMQueries, formatImportedValues, setCollection, detectBadRanges} from './utils/CreateCollection/importCollection.js'
import { getPokemonGroups } from './utils/pokemongroups/getpokemongroups.js';
import { getIndividualPokemonInfo } from './utils/createCollection.js';
import { getPossibleEggMoves, getCollectionProgress } from './utils/schemavirtuals/collectionvirtuals.js';
import { sortOnHandList } from '../common/sortingfunctions/onhandsorting.mjs';
import { sortList } from '../common/sortingfunctions/customsorting.mjs';
// require('dotenv').config()
import dotenv from 'dotenv'
import lton from 'letter-to-number'
import bodyParser from 'body-parser';
import { initializePassportStrategy } from './middleware.js';
import passport from 'passport';
import bcrypt from 'bcrypt'
import session from 'express-session';
import MongoDBStore from 'connect-mongo'
dotenv.config()

function newObjectId() {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const objectId = timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
    }).toLowerCase();

    return objectId;
}

//env variables
const APIKEY = process.env.API_KEY
const SECRET = process.env.SECRET
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/ProjectPC"

//utils and classes
import catchAsync from './utils/catchAsync.js'
import CollectionClass from './utils/createCollection.js'

//models
import Collection from './models/collections.js'
import User from './models/users.js'
import Trade from './models/trades.js'

//database connection 
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//store initialization
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: SECRET,
    }
})

store.on('error', function(e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store: store,
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


const app = express();

//middleware
app.use(session(sessionConfig))
app.use(cors({ credentials: true, origin: true }))
// app.use(nocache())
app.use(express.json({ limit: '500kb' }))
app.use(bodyParser.json({ limit: '500kb' }))
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

//     next()
// })

// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// })

//passport initialization
app.use(passport.initialize())
app.use(passport.session())
initializePassportStrategy()
passport.serializeUser(function (user, cb) {
    return cb(null, user.id)
})
passport.deserializeUser(async function (id, cb) {
    return await User.findById({_id: id}).then(user => cb(null, user))
})

//routes

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
})

app.get('/search/:searchType', catchAsync(async(req, res) => {
    const {searchType} = req.params
    const {query, skip} = req.query
    const emptyQuery = query === ''
    const maxDocs = searchType === 'all' ? 5 : 10
    const searchCollections = searchType === 'all' || searchType === 'collections'
    const searchUsers = searchType === 'all' || searchType === 'users'
    const regex = new RegExp(query, 'i')
    const searchQueries = {
        collections: emptyQuery ? {} : {$or: [{name: regex}, {'owner.username': regex}, {type: regex}, {gen: regex}]},
        users: emptyQuery ? {} : {username: regex}
    }

    const queryCollectionAggregate = [
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        },
        {$match: searchQueries.collections}
    ]

    const collectionCountAggregate = [
        ...queryCollectionAggregate,
        {$count: "totalCollections"}
    ]

    const collectionAggregate = [
        ...queryCollectionAggregate,
        {$skip: skip === undefined ? 0 : parseInt(skip)},
        {$limit: maxDocs},
        {$addFields: {
            progress: {
                $concat: [
                    {$toString: {$sum: {$map: {
                        input: {$filter: {
                            input: "$ownedPokemon",
                            as: 'pokemon',
                            cond: {$not: '$$pokemon.disabled'}
                        }},
                        as: 'enabledPokemon',
                        in: {$sum: {$map: {
                            input: {$filter: {input: {$objectToArray: '$$enabledPokemon.balls'}, as: 'ballValues', cond: {$not: '$$ballValues.v.disabled'}}},
                            as: 'ballObj',
                            in: {$cond: {if: '$$ballObj.v.isOwned', then: 1, else: 0}}
                        }}}
                    }}}},
                    '/',
                    {$toString: {$sum: {$map: {
                        input: {$filter: {
                            input: "$ownedPokemon",
                            as: 'pokemon',
                            cond: {$not: '$$pokemon.disabled'}
                        }},
                        as: 'enabledPokemon',
                        in: {$sum: {$map: {
                            input: {$filter: {input: {$objectToArray: '$$enabledPokemon.balls'}, as: 'ballValues', cond: {$not: '$$ballValues.v.disabled'}}},
                            as: 'ballObj',
                            in: {$cond: {if: '$$ballObj.v', then: 1, else: 0}}
                        }}}
                    }}}}
                ]
            }
        }},
        {$project: {_id: true, name: true, 'owner.username': true, type: true, gen: true, progress: true}}
    ]
    // const searchOperations = {
    //     collections: searchCollections ? Collection.aggregate(collectionAggregate).exec : [],
    //     users: searchUsers ? User.find(searchQueries.users, '_id username').lean().populate({path: 'collections'}).exec : []
    // }

    const collectionCountStep1 = searchCollections ? await Collection.aggregate(collectionCountAggregate, {maxTimeMS: 750}) : 0

    const searchResult = {
        collections: searchCollections ? await Collection.aggregate(collectionAggregate).exec() : [],
        users: searchUsers ? await User.find(searchQueries.users, '_id username').skip(skip === undefined ? 0 : skip).limit(maxDocs).lean().populate({path: 'collections', select: 'type -_id -owner'}).exec() : [],
        collectionCount: (collectionCountStep1[0] === undefined || collectionCountStep1 === 0) ? 0 : collectionCountStep1[0].totalCollections,
        userCount: searchUsers ? await User.countDocuments(searchQueries.users, {maxTimeMS: 750}) : 0,
    }

    res.json(searchResult)
}))

app.post('/users/new', catchAsync(async(req, res) => {
    const {username, password, email, secQuestion1, secQuestion2, secQuestion3, secAnswer1, secAnswer2, secAnswer3} = req.body
    const securityQuestions = [
        secAnswer1 === undefined ? undefined : {question: secQuestion1, answer: await bcrypt.hash(secAnswer1, 11)},
        secAnswer2 === undefined ? undefined : {question: secQuestion2, answer: await bcrypt.hash(secAnswer2, 11)},
        secAnswer3 === undefined ? undefined : {question: secQuestion3, answer: await bcrypt.hash(secAnswer3, 11)}
    ].filter(item => item !== undefined)
    const settings = {
        profile: {bio: '', tags: [], games: []},
        account: {verified: false, securityQuestions},
    }
    bcrypt.hash(password, 11, async function(err, hash) {
        const newUser = new User({
            username, 
            password: hash, 
            email, 
            settings, 
            notifications: [
                {
                    type: 'site message', 
                    title: 'Welcome to Pokellections!', 
                    message: 'Welcome to Pokellections! Thank you for joining the site. We hope you enjoy aprimon collecting made easy!'
                }
            ]
        })
        await newUser.save()
        res.json(newUser._id)
    })
}))

app.post('/users/login', passport.authenticate('local'), catchAsync((req, res) => {
    res.send(req.sessionID)
}))

app.post('/users/logout', catchAsync((req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err) }
        res.end()
    })
}))

app.put('/users/settings/:settingType', catchAsync(async(req, res) => {
    const {settingType} = req.params
    const {newSettings, userID} = req.body
    const setModifier = {[`settings.${settingType}`]: newSettings}
    await User.findByIdAndUpdate({_id: userID}, {$set: setModifier})
    res.end()
}))

app.get('/collections', catchAsync(async(req, res) => {
    const collections = await Collection.find({}).populate({path: 'owner'})
    res.json(collections)
}))

app.post('/collections/pokemongroups', catchAsync(async(req, res) => {
    const {gen} = req.body
    const pokemonGroups = getPokemonGroups(gen)
    res.json(pokemonGroups)
}))

app.post('/collections/new/import', catchAsync(async(req, res) => {
    const {spreadsheetId, apiRequestQueries, collectionTypeValue} = req.body
    const {dexNum, names, balls, HA, EM1, EM2, EM3, EM4, emColors, rowStart, rawRequiredFormData} = apiRequestQueries
    const noDexNums = dexNum === undefined
    const noHAColImport = HA === undefined || typeof HA === 'object'
    const noEMsColImport = EM1 === undefined //must populate all EM fields or they don't import
    const noEMColorImport = emColors === undefined

    const missingRequiredFormData = Object.values(rawRequiredFormData).includes('') || rawRequiredFormData.ballOrder.length === 0

    if (missingRequiredFormData) {
        const requiredFields = [{display: 'Sheet Name', formKey: 'sheetName'}, {display: 'Row Span From', formKey: 'rowSpanFrom'}, {display: 'Row Span To', formKey: 'rowSpanTo'}, {display: 'Names', formKey: 'nameCol'}, {display: 'Ball Column From', formKey: 'ballColFrom'}, {display: 'Ball Column To', formKey: 'ballColTo'}, {display: 'Ball Order', formKey: 'ballOrder'}]
        const missingFields = requiredFields.filter((field) => (rawRequiredFormData[field.formKey] === '' || rawRequiredFormData[field.formKey].length === 0)).map((missingField) => missingField.display)
        if (spreadsheetId === '') {
            missingFields.unshift('Spreadsheet ID')
        }
        return res.json({missingInfo: true, missingFields})
    }

    const numBetweenBallCols = (lton(rawRequiredFormData.ballColTo.toUpperCase())-(lton(rawRequiredFormData.ballColFrom.toUpperCase())-1))
    const notLeftToRight = numBetweenBallCols < 1
    const moreThan11Balls = numBetweenBallCols > 11
    const mismatchBallColsAndOrder = numBetweenBallCols !== rawRequiredFormData.ballOrder.length

    if (mismatchBallColsAndOrder || notLeftToRight || moreThan11Balls) {
        return res.json({ballColIssue: true, type: notLeftToRight ? 'notLeftToRight' : moreThan11Balls ? 'moreThan11Balls' : mismatchBallColsAndOrder && 'mismatchBallColsAndOrder'})
    }
    //console.log(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?key=${APIKEY}dexNum: ${formatImportQuery(dexNum)} nameRange: ${names}& ballRange: ${balls.range} HArange: ${formatImportQuery(HA)} EMQueries: ${setEMQueries(EM1, EM2, EM3, EM4, formatImportQuery(HA) === '')}`)
    //console.log(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?key=${APIKEY}${formatImportQuery(dexNum)}${names}&${balls.range}${formatImportQuery(HA, EM1 === undefined)}${setEMQueries(EM1, EM2, EM3, EM4, formatImportQuery(HA) === '')}`)

    const data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?key=${APIKEY}&majorDimension=ROWS${formatImportQuery(dexNum)}${names}${formatImportQuery(HA, EM1 === undefined)}${setEMQueries(EM1, EM2, EM3, EM4, formatImportQuery(HA) === '')}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    }).then((data) => data.json())

    const ballData = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?key=${APIKEY}&majorDimension=ROWS&valueRenderOption=FORMULA&${balls.range}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    }).then((data) => data.json())

    const colorData = (typeof HA === 'object' || !noEMColorImport) && await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${APIKEY}&${balls.range}&includeGridData=TRUE&fields=sheets.data.rowData.values.userEnteredFormat(backgroundColor)`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        },
    }).then((data) => data.json())

    if (data.error !== undefined) {
        return res.json(data)
    }

    const dataRangeIssue = detectBadRanges(data)
    const ballDataRangeIssue = detectBadRanges(ballData)
    const ranges = [dexNum, names, !noHAColImport ? HA : undefined, EM1, EM2, EM3, EM4]
    const rangeNames = ['Dex Number', 'Names', 'Hidden Ability', 'Egg Move 1', 'Egg Move 2', 'Egg Move 3', 'Egg Move 4']

    if (dataRangeIssue.issue !== 'none' || ballDataRangeIssue.issue !== 'none') {
        const badRangeNames = [...dataRangeIssue.ranges.map(range => rangeNames[ranges.indexOf(range)]), ...ballDataRangeIssue.ranges.length !== 0 ? 'balls' : []]
        return res.json({rangeIssue: true, badRanges: badRangeNames})
    }

    const namesDataIdx = noDexNums ? 0 : 1
    const HADataIdx = noDexNums ? 1 : 2
    const EMDataIdxs = {
        EM1: 3 + (noDexNums ? -1 : 0) + (noHAColImport ? -1 : 0),
        EM2: 4 + (noDexNums ? -1 : 0) + (noHAColImport ? -1 : 0),
        EM3: 5 + (noDexNums ? -1 : 0) + (noHAColImport ? -1 : 0),
        EM4: 6 + (noDexNums ? -1 : 0) + (noHAColImport ? -1 : 0)
    }

    const gapRowIdxs = formatImportedValues('gapIdxs', data.valueRanges[0].values, [], noDexNums ? 'names' : 'dexNums')

    const importedDexNumArr = noDexNums ? [] : formatImportedValues('dexNum', data.valueRanges[0].values, gapRowIdxs)
    const importedNamesArr = formatImportedValues('names', data.valueRanges[namesDataIdx].values, gapRowIdxs)
    const importedBallInfoArr = formatImportedValues('balls', ballData.valueRanges[0].values, gapRowIdxs)
    const importedHAInfoArr = HA !== undefined && formatImportedValues('HA', noHAColImport ? colorData.sheets[0].data[0].rowData : data.valueRanges[HADataIdx].values, gapRowIdxs, 'none', noHAColImport ? HA : [])
    const importedEMCountInfoArr = !noEMColorImport ? formatImportedValues('emColors', colorData.sheets[0].data[0].rowData, gapRowIdxs, 'none', emColors) : undefined
    const importedEMsInfoArr = !noEMsColImport ? formatImportedValues('EMs', data.valueRanges[EMDataIdxs.EM1].values, gapRowIdxs, 'none', [], {EM2: data.valueRanges[EMDataIdxs.EM2].values, EM3: data.valueRanges[EMDataIdxs.EM3].values, EM4: data.valueRanges[EMDataIdxs.EM4].values}) : undefined
 
    const newCollection = setCollection(noDexNums ? importedNamesArr : importedDexNumArr, importedNamesArr, importedBallInfoArr, gapRowIdxs, balls.order, collectionTypeValue, rowStart, HA !== undefined ? importedHAInfoArr : undefined, noHAColImport ? 'colors' : 'col', importedEMCountInfoArr, importedEMsInfoArr)
    
    res.json(newCollection)    
}))


app.post('/collections/new', catchAsync(async(req, res) => {
    const {newCollectionInfo, type} = req.body
    //type refers to 'aprimon', 'livingdex', etc. useful for when newer types of collection are supported

    const collectionData = new CollectionClass(undefined, newCollectionInfo)
    const collection = new Collection(collectionData)
    await collection.save()

    res.json(collection._id)
}))

app.post('/collections/new/seeddb', catchAsync(async(req, res) => {
    const gens = [6, 7, 'swsh', 'bdsp', 9, 'home']
    const names = ['random sheet', 'first aprimon collection', 'we get this!', 'collecting aprimon', 'aprimon collector 1', 'aprimon collection 24', 'llamas sheet']
    const allUsers = await User.find({}).lean().populate({path: 'collections', select: 'gen'}).exec()
    const ownerIds = allUsers.map(user => user._id)

    const usernames = ['ash ketchup', 'penny', 'hihi', 'aprimon collector', 'selvt', 'paro', 'gary oak', 'misty', 'brock', 'sabrina', 'everword', 'superguy12345', 'XxpokemonCollectorxX', 'lol', 'neverAgain', 'findmyway', 'pandabear', 'pandaman', 'pirate king garon', 'aaron', 'matear', 'poalert', 'poltergeist', 'pikachu enjoyer', 'gen wunner', 'wurst', 'gutentag', 'betterman', 'the pokemon lady']
    const emails = ['gma@gmail.com', 'Durward.Aufderhar@gmail.com', 'Michaela99@gmail.com', 'Haylie4@gmail.com', 'Gonzalo_Marks79@gmail.com',  'Clare82@gmail.com', 'Kaylee8@gmail.com', 'Chaim.Gerhold34@gmail.com', 'Trycia_Hyatt90@gmail.com', 'Ezra_Buckridge@gmail.com', 'Zachary42@gmail.com', 'Neha_Goodwin@gmail.com', 'Amira.Legros@gmail.com', 'Audie37@outlook.com', 'Jodie.Jakubowski10@outlook.com', 'Dale43@outlook.com', 'Karina29@outlook.com', 'Torrey_Dickens26@outlook.com', 'Cathrine.Stoltenberg24@outlook.com', 'Kaitlyn.Hills34@outlook.com', 'Emily.Ondricka@outlook.com', 'Destiney78@outlook.com', 'Ottis_Bode17@outlook.com', 'Abdiel.Zieme@outlook.com', 'Omari_Lowe@outlook.com', 'Joanne.Dooley@outlook.com', 'Orin.Stark77@outlook.com', 'Mikayla.Wilderman1@outlook.com', 'Kristy.Runolfsdottir85@outlook.com', 'Marquis17@outlook.com', 'Sherwood.Borer@outlook.com', 'Susan_Armstrong73@outlook.com', 'Verna20@outlook.com']
    for (let i=0; i < 100; i++) {
        const newOwner = ownerIds[Math.floor(Math.random() * ownerIds.length)]
        const genObj = {gen: ''}
        for (let gen of gens) {
            const newGen = gens[Math.floor(Math.random() * gens.length)]
            if (allUsers.filter(userD => userD._id === newOwner)[0].collections.filter(col => col.gen === newGen).length !== 0) {return}
            genObj.gen = newGen
        }
        if (genObj.gen === '') {return}
        const isHARand = Math.floor(Math.random()*2)
        const emCountRand = Math.floor(Math.random()*5)
        const newCollectionInfo = {
            gen: genObj.gen,
            collectionName: names[Math.floor(Math.random() * names.length)],
            owner: ownerIds[Math.floor(Math.random() * ownerIds.length)],
            options: {
                collectingBalls: genObj.gen === 6 ? ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'dream', 'safari', 'sport'] : ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'],
                globalDefaults: {isHA: isHARand === 0 ? true : false, emCount: emCountRand},
                sorting: {collection: {reorder: false, default: 'NatDexNumL2H'}, onhand: {reorder: true, default: 'NatDexNumL2H', ballOrder: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'], sortFirstBy: 'pokemon'}},
                tradePreferences: {status: 'open', rates: {pokemonOffers: [{items: ['On-Hand HA Aprimon', 'HA Aprimon'], rate: [2, 1]}], itemOffers: []}, size: 'small preferred', onhandOnly: 'no', items: 'none', lfItems: [], ftItems: {}}
            }
        }
        const collectionData = new CollectionClass(undefined, newCollectionInfo)
        const collection = new Collection(collectionData)
        await collection.save()
    }

    // for (let user of usernames) {
    //     const securityQuestions = [{question: 'hi there!', answer: 'duh'}]
    //     const randEmail = emails[usernames.indexOf(user)]
    //     const settings = {
    //         profile: {bio: '', tags: [], games: []},
    //         account: {verified: false, securityQuestions},
    //     }
    //     bcrypt.hash('12345', 11, async function(err, hash) {
    //         const newUser = new User({username: user, password: hash, email: randEmail, settings})
    //         await newUser.save()
    //     })
    // }

    res.end()
}))

app.post('/trades/new', catchAsync(async(req, res) => {
    const {offer, receiving, offerMessage, traderId, ownerId, traderUsername, ownerUsername, gen} = req.body
    const offerObj = {
        status: 'pending',
        offerer: traderUsername,
        recipient: ownerUsername,
        comment: offerMessage,
        trade: {
            offer,
            receiving
        }
    }
    const newTradeData = {
        status: 'initialoffer',
        gen,
        users: [traderId, ownerId],
        history: [offerObj]
    }
    const trade = new Trade(newTradeData)
    await trade.save()

    const ownerUserData = await User.findById(ownerId)
    ownerUserData.notifications.push({type: 'trade-offer: new', tradeData: {otherParticipant: traderUsername, tradeGen: gen, tradeId: trade._id}, unread: true})
    await ownerUserData.save()

    res.json(trade._id)
}))

app.get('/trades/:id', catchAsync(async(req, res) => {
    const {getFullCollectionData} = req.query
    const latestOfferData = {}
    const trade = await Trade.findById(req.params.id).lean()
        .populate({path: 'users', select: 'username collections notifications.tradeData.tradeId', populate: {path: 'collections', select: '_id name type gen'}})
        .then(data => { //bandaid solution to what should be solved through database queries - couldnt find how to do this.
            data.history = data.history.map((offer, idx) => {
                const isLatestOffer = idx+1 === data.history.length
                if (isLatestOffer) {
                    latestOfferData.data = offer
                }
                return {_id: offer._id, createdAt: offer.createdAt}
            })
            data.users.notifications = data.users.map(userData => { //this part is used to see if theres any pending notifications
                if (userData.notifications === undefined) {return userData}
                userData.notifications = userData.notifications.filter(nData => nData.tradeData.tradeId === req.params.id)
                return userData
            })
            return data
        })

    //another bandaid solution to what should be solved through database queries
    const crossGenTrade = trade.gen.includes('-')
    const newUsersArr = trade.users.map((userData, userIdx) => {
        const genRef = crossGenTrade ? (
            userIdx === 0 ? trade.gen.slice(0, trade.gen.indexOf('-')) : trade.gen.slice(trade.gen.indexOf('-')+1)
        ) : trade.gen
        const tradeCollectionData = userData.collections.filter(col => col.gen === genRef)[0]
        return {...userData, tradeCollection: tradeCollectionData}
    })
    const modifiedTradeData = {...trade, users: newUsersArr}

    if (getFullCollectionData === 'true') {
        const user0CollectionData = await Collection.findById(newUsersArr[0].tradeCollection._id).populate({path: 'owner'})
        const user1CollectionData = await Collection.findById(newUsersArr[1].tradeCollection._id).populate({path: 'owner'})
        res.json({tradeData: modifiedTradeData, latestOfferData: latestOfferData.data, user0CollectionData, user1CollectionData})
    } else {
        res.json({tradeData: modifiedTradeData, latestOfferData: latestOfferData.data}) 
    }
    
}))

app.get('/trades/:id/offer/:offerIdx', catchAsync(async(req, res) => {
    const {id, offerIdx} = req.params
    const offerData = await Trade.findById(id, 'history').lean()
    res.json(offerData.history[offerIdx])
}))

app.put('/trades/:id', catchAsync(async(req, res) => {
    const {response, otherUserId, offerColId, receivingColId, counterOfferData, username} = req.body
    const {id} = req.params

    const trade = await Trade.findById(id)
    const latestOffer = trade.history[trade.history.length-1]

    if (response === 'accept') {
        trade.status = 'pending'
        trade.history[trade.history.length-1].status = 'accepted'
        trade.markedCompleteBy = ''
        trade.save()

        const offerCol = await Collection.findById(offerColId)
        const receivingCol = await Collection.findById(receivingColId)
        if (latestOffer.trade.offer.pokemon !== undefined) {
            offerCol.onHand = offerCol.onHand.map(p => { //taking off onhand if offering an onhand
                const offeringPokemon = latestOffer.trade.offer.pokemon.filter(tradeP => tradeP.balls.filter(tradePBallData => tradePBallData.onhandId !== undefined && tradePBallData.onhandId === p._id.toString()).length !== 0).length !== 0
                if (offeringPokemon) {
                    p.qty = p.qty-1
                    if (p.qty === 0) {return undefined}
                }
                return p
            }).filter(p => p !== undefined)
            receivingCol.ownedPokemon = receivingCol.ownedPokemon.map(p => { //setting offered pokemon as pending
                if (p.disabled) {return p}
                const newBallData = {}
                Object.keys(p.balls).forEach(ball => {
                    const ballData = p.balls[ball]
                    if (ballData.disabled) {newBallData[ball] = ballData}
                    else {
                        const isBeingReceived = latestOffer.trade.offer.pokemon.filter(tradeP => (tradeP.name === p.name || tradeP.for === p.name) && tradeP.balls.filter(tradePBallData => tradePBallData.ball === ball).length !== 0).length !== 0
                        if (!isBeingReceived) {newBallData[ball] = ballData}
                        else {
                            const newSpecificBallData = ballData.isOwned ? ballData : {...ballData, pending: true}
                            if (newSpecificBallData.highlyWanted) {
                                delete newSpecificBallData.highlyWanted
                            }
                            newBallData[ball] = newSpecificBallData
                        }
                    }
                })
                return {...p, balls: newBallData}
            })
        }
        if (latestOffer.trade.receiving.items !== undefined) {
            offerCol.ownedPokemon = offerCol.ownedPokemon.map(p => { //setting received pokemon as pending
                if (p.disabled) {return p}
                const newBallData = {}
                Object.keys(p.balls).forEach(ball => {
                    const ballData = p.balls[ball]
                    if (ballData.disabled) {newBallData[ball] = ballData}
                    else {
                        const isBeingReceived = latestOffer.trade.receiving.pokemon.filter(tradeP => (tradeP.name === p.name || tradeP.for === p.name) && tradeP.balls.filter(tradePBallData => tradePBallData.ball === ball).length !== 0).length !== 0
                        if (!isBeingReceived) {newBallData[ball] = ballData}
                        else {
                            const newSpecificBallData = ballData.isOwned ? ballData : {...ballData, pending: true}
                            if (newSpecificBallData.highlyWanted) {
                                delete newSpecificBallData.highlyWanted
                            }
                            newBallData[ball] = newSpecificBallData
                        }
                    }
                })
                return {...p, balls: newBallData}
            })
            receivingCol.onHand = receivingCol.onHand.map(p => { //taking off onhand if offering an onhand
                const offeringPokemon = latestOffer.trade.receiving.pokemon.filter(tradeP => tradeP.balls.filter(tradePBallData => tradePBallData.onhandId !== undefined && tradePBallData.onhandId === p._id).length !== 0).length !== 0
                if (offeringPokemon) {
                    p.qty = p.qty-1
                    if (p.qty === 0) {return undefined}
                }
                return p
            }).filter(p => p !== undefined)
        }
        offerCol.save()
        receivingCol.save()

        const otherUser = await User.findById(otherUserId)
        otherUser.notifications.push({type: 'trade-offer: accept', tradeData: {otherParticipant: username, tradeGen: trade.gen, tradeId: trade._id}, unread: true})
        otherUser.save()

    } else if (response === 'reject') {
        trade.status = 'rejected'
        latestOffer.status = 'rejected'
        trade.closeDate = Date.now()
        trade.save()

        const otherUser = await User.findById(otherUserId)
        otherUser.notifications.push({type: 'trade-offer: reject', tradeData: {otherParticipant: username, tradeGen: trade.gen, tradeId: trade._id}, unread: true})
        otherUser.save()
    } else if (response === 'counter') {
        trade.status = 'counteroffer'
        latestOffer.status = 'countered'
        trade.history.push({...counterOfferData})
        trade.save()

        const otherUser = await User.findById(otherUserId)
        otherUser.notifications.push({type: 'trade-offer: counter', tradeData: {otherParticipant: username, tradeGen: trade.gen, tradeId: trade._id}, unread: true})
        otherUser.save()
    } else if (response === 'markAsComplete') {
        if (trade.markedCompleteBy === username) {
            trade.markedCompleteBy = ''
            trade.save()
        } else if (trade.markedCompleteBy === '') {
            trade.markedCompleteBy = username
            trade.save()
        } else {
            trade.markedCompleteBy = 'both',
            trade.status = 'completed'
            trade.closeDate = Date.now()
            trade.save()

            const offerCol = await Collection.findById(offerColId)
            const receivingCol = await Collection.findById(receivingColId)

            if (latestOffer.trade.receiving.pokemon !== undefined) {
                offerCol.ownedPokemon = offerCol.ownedPokemon.map((poke) => {
                    if (poke.disabled) {return poke}
                    const newBallData = {}
                    Object.keys(poke.balls).forEach(ball => {
                        const ballData = poke.balls[ball]
                        if (ballData.disabled) {newBallData[ball] = ballData}
                        else {
                            const ballComboTradeData = latestOffer.trade.receiving.pokemon.filter(p => (p.for === poke.name || p.name === poke.name) && (p.balls.filter(bD => bD.ball === ball).length !== 0))
                            const ballComboBeingReceived = ballComboTradeData.length !== 0 && ballData.isOwned === false
                            
                            if (ballComboBeingReceived) {
                                const ballTradeData = ballComboTradeData[0].balls.filter(bD => bD.ball === ball)[0]
                                const haData = ballTradeData.isHA !== undefined ? {isHA: ballTradeData.isHA} : {}
                                const emData = ballTradeData.emCount !== undefined ? {emCount: ballTradeData.emCount, EMs: ballTradeData.EMs} : {}
                                const defaultData = ballData.default !== undefined ? {default: ballData.default} : {}
                                newBallData[ball] = {
                                    isOwned: true,
                                    ...haData,
                                    ...emData,
                                    ...defaultData
                                }
                            }
                            else {newBallData[ball] = ballData}
                        }
                    }) 
                    return {...poke, balls: newBallData}
                })
            }
            if (latestOffer.trade.offer.pokemon !== undefined) {
                receivingCol.ownedPokemon = receivingCol.ownedPokemon.map((poke) => {
                    if (poke.disabled) {return poke}
                    const newBallData = {}
                    Object.keys(poke.balls).forEach(ball => {
                        const ballData = poke.balls[ball]
                        if (ballData.disabled) {newBallData[ball] = ballData}
                        else {
                            const ballComboTradeData = latestOffer.trade.offer.pokemon.filter(p => (p.for === poke.name || p.name === poke.name) && (p.balls.filter(bD => bD.ball === ball).length !== 0))
                            const ballComboBeingReceived = ballComboTradeData.length !== 0 && ballData.isOwned === false
                            if (ballComboBeingReceived) {
                                const ballTradeData = ballComboTradeData[0].balls.filter(bD => bD.ball === ball)[0]
                                const haData = ballTradeData.isHA !== undefined ? {isHA: ballTradeData.isHA} : {}
                                const emData = ballTradeData.emCount !== undefined ? {emCount: ballTradeData.emCount, EMs: ballTradeData.EMs} : {}
                                const defaultData = ballData.default !== undefined ? {default: ballData.default} : {}
                                newBallData[ball] = {
                                    isOwned: true,
                                    ...haData,
                                    ...emData,
                                    ...defaultData
                                }
                            }
                            else {newBallData[ball] = ballData}
                        }
                    }) 
                    return {...poke, balls: newBallData}
                })
            }
            if (latestOffer.trade.offer.items !== undefined) {
                latestOffer.trade.offer.items.forEach(itemD => {
                    const itemName = itemD.name
                    const hasFtItem = offerCol.options.tradePreferences.ftItems[itemName] !== undefined
                    if (hasFtItem) {
                        const setFtItemTo0 = itemD.qty >= offerCol.options.tradePreferences.ftItems[itemName]
                        if (setFtItemTo0) {
                            delete offerCol.options.tradePreferences.ftItems[itemName]
                        } else {
                            offerCol.options.tradePreferences.ftItems[itemName] = offerCol.options.tradePreferences.ftItems[itemName] - itemD.qty
                        }
                        
                    }
                })
            }
            if (latestOffer.trade.receiving.items !== undefined) {
                latestOffer.trade.receiving.items.forEach(itemD => {
                    const itemName = itemD.name
                    const hasFtItem = receivingCol.options.tradePreferences.ftItems[itemName] !== undefined
                    if (hasFtItem) {
                        const setFtItemTo0 = itemD.qty >= receivingCol.options.tradePreferences.ftItems[itemName]
                        if (setFtItemTo0) {
                            delete receivingCol.options.tradePreferences.ftItems[itemName]
                        } else {
                            receivingCol.options.tradePreferences.ftItems[itemName] = receivingCol.options.tradePreferences.ftItems[itemName] - itemD.qty
                        }
                        
                    }
                })
            }
            offerCol.save()
            receivingCol.save()
        }
    }
    res.end()
}))

app.get('/collections/:id', catchAsync(async(req, res) => {
    const collection = await Collection.findById(req.params.id).populate({path: 'owner'})
    res.json(collection)
}))

app.get('/users/:username', catchAsync(async(req, res) => {
    const user = await User.find({username: req.params.username}).populate({path: 'collections'})
    res.json(user[0])
}))

app.get('/users/:username/trades', catchAsync(async(req, res) => {
    const user = await User.find({username: req.params.username})
    const allTheirTrades = await Trade.find({'users[1]': user._id, 'users[0]': user._id}).select('-history').populate({path: 'users', select: 'username'})

    res.json({user: user[0], trades: allTheirTrades})
}))

app.put('/users/:username/read-notification', catchAsync(async(req, res) => {
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
}))

app.get('/username/availability', catchAsync(async(req, res) => {
    const {username, email, checkEmailInstead} = req.query
    const search = await User.find(checkEmailInstead ? {email} : {username}).exec()
    const userWithThatName = Object.keys(search).length !== 0
    if (userWithThatName) {
        res.json({available: false})
    } else {
        res.json({available: true})
    }
}))

app.put('/collections/:id/edit', catchAsync(async(req, res) => {
    const changedField = Object.keys(req.body)[2]
    const newValueOfChangedField = Object.values(req.body)[2]
    const {pokename, ballname, idOfPokemon, onhandPokemon, otherFieldsData} = req.body //idofpokemon is only for onhand pokemon
    const {id, ownerid} = req.params

    if (onhandPokemon === true) {
        const setModifier = { $set: {
            [`onHand.$.${changedField}`]: newValueOfChangedField
        }}
        await Collection.updateOne({
            _id: id,
            'onHand._id': idOfPokemon
            }, setModifier
        )
    } else {
        if (changedField === 'isOwned' && newValueOfChangedField === true) {
            const setDefaults = otherFieldsData !== undefined
            const otherSetModifiers = {}
            if (setDefaults) {
                const fieldsChanged = Object.keys(otherFieldsData)
                for (let field of fieldsChanged) {
                    otherSetModifiers[`ownedPokemon.$.balls.${ballname}.${field}`] = otherFieldsData[field]
                }
            }
            const setModifier = { $set: {
                [`ownedPokemon.$.balls.${ballname}.${changedField}`]: newValueOfChangedField,
                ...otherSetModifiers
            }, $unset: {
                [`ownedPokemon.$.balls.${ballname}.highlyWanted`]: "",
                [`ownedPokemon.$.balls.${ballname}.pending`]: ""
            }}

            await Collection.updateOne({
                _id: id, 
                "ownedPokemon.name": pokename
                }, setModifier
            )
        } else {
            const setModifier = { $set: {
                [`ownedPokemon.$.balls.${ballname}.${changedField}`]: newValueOfChangedField
            }}

            await Collection.updateOne({
                _id: id, 
                "ownedPokemon.name": pokename
                }, setModifier
            )
        }
    }
    res.end()
}))

app.put('/collections/:id/edit/bulkedit', catchAsync(async(req, res) => {
    const {bulkEdit, idOfPokemon, onhandPokemon} = req.body
    const {id} = req.params

    if (onhandPokemon === true) {
        await Collection.updateOne({
            _id: id,
            "onHand._id": idOfPokemon
            }, { 
                $set: {['onHand.$']: bulkEdit} 
            }
        )
    } else {}

    res.end()
}))

app.put('/collections/:id/edit/tagedit', catchAsync(async(req, res) => {
    const {tag, activeTag, pokename, ballname, isDefaultModifier} = req.body
    const {id} = req.params

    //currently only highlyWanted and pending tags available
    const otherTag = tag === 'highlyWanted' ? 'pending' : 'highlyWanted'

    const setModifier = tag !== activeTag ? activeTag !== 'none' ? 
        { $set: {
            [`ownedPokemon.$.balls.${ballname}.${tag}`]: true
        }, $unset: {
            [`ownedPokemon.$.balls.${ballname}.${otherTag}`]: ""
        }} : { $set: {
            [`ownedPokemon.$.balls.${ballname}.${tag}`]: true
        }} :
        { $unset: {
            [`ownedPokemon.$.balls.${ballname}.${tag}`]: ""
        }}

    const setModifierDefault = tag !== activeTag ? activeTag !== 'none' ? 
        { $set: {
            [`ownedPokemon.$.balls.${tag}.default`]: true
        }, $unset: {
            [`ownedPokemon.$.balls.${activeTag}.default`]: ""
        }} : { $set: {
            [`ownedPokemon.$.balls.${tag}.default`] : true
        }} : { $unset: {
            [`ownedPokemon.$.balls.${tag}.default`] : ""
        }}
    
    if (isDefaultModifier) {
        await Collection.updateOne({
            _id: id,
            "ownedPokemon.name": pokename
        }, setModifierDefault)
    } else {
        await Collection.updateOne({
            _id: id,
            "ownedPokemon.name": pokename
        }, setModifier)
    }

    res.end()
}))

app.put('/collections/:id/edit/addonhand', catchAsync(async(req, res) => {
    const {newOnHand} = req.body
    const {id} = req.params

    const collection = await Collection.findById(id)
    collection.onHand.push(newOnHand)
    const onhandSortingOptions = collection.options.sorting.onhand
    if (onhandSortingOptions.reorder === true) {
        collection.onHand = sortOnHandList(onhandSortingOptions.sortFirstBy, onhandSortingOptions.default, onhandSortingOptions.ballOrder, collection.onHand)
    }
    
    collection.save()

    res.end()
}))

app.put('/collections/:id/edit/ownedpokemonedit', catchAsync(async(req, res) => {
    //this route handles all scope changes (including ball scope changes) and custom sorting
    const {id} = req.params
    const {getPokemonInfo, newPokemon, gen, ballScope, newOwnedCollectionList, updateEggMoves, newCollectingBalls} = req.body

    if (getPokemonInfo) {
        const newPokemonArr = getIndividualPokemonInfo(gen, newPokemon, ballScope)
        res.json(newPokemonArr)
    } else {
        const collection = await Collection.findById(id)
        collection.ownedPokemon = newOwnedCollectionList
        if (newCollectingBalls !== undefined) {
            //note: you cannot reference a subdoc when updating data this way, only top level docs. 
            collection.options = {...collection.options, collectingBalls: newCollectingBalls}
        }
        collection.save()
        if (updateEggMoves && gen !== 'home') {
            const updatedEggMoveInfo = getPossibleEggMoves(newOwnedCollectionList, gen)
            res.json(updatedEggMoveInfo)
        } else if (updateEggMoves && gen === 'home') { 
            res.json({})
        } else {
            res.end()
        }
        
    }
}))

app.put('/collections/:id/edit/optionsedit', catchAsync(async(req, res) => {
    //update this route so it sorts the list on its own
    const {id} = req.params
    const {optionType, listType, data, sortedList, newRates, newPreferences, lfItems, ftItems, name, globalDefault} = req.body
    if (optionType === 'sort') {
        const setListModifier = sortedList !== undefined ? listType === 'collection' ? {'ownedPokemon': sortedList} : {'onHand': sortedList} : {}
        await Collection.updateOne({_id: id}, { $set: {[`options.sorting.${listType}`]: data, ...setListModifier} })
        res.end()
    } else if (optionType === 'rates') {
        await Collection.updateOne({_id: id}, { $set: {'options.tradePreferences.rates': newRates} })
        res.end()
    } else if (optionType === 'preferences') {
        await Collection.updateOne({_id: id}, { $set: {'options.tradePreferences': newPreferences} })
        res.end()
    } else if (optionType === 'items') {
        await Collection.updateOne({_id: id}, { $set: {'options.tradePreferences.lfItems': lfItems, 'options.tradePreferences.ftItems': ftItems} })
        res.end()
    } else if (optionType === 'name') {
        const otherSetModifier = globalDefault !== undefined ? { $set: {'options.globalDefaults': globalDefault} } : {}
        await Collection.updateOne({_id: id}, { $set: {'name': name}, ...otherSetModifier })
        res.end()
    } else if (optionType === 'globalDefault') {
        await Collection.updateOne({_id: id}, { $set: {'options.globalDefaults': globalDefault} })
    }
}))

app.delete('/collections/:id/edit/deleteonhand', catchAsync(async(req, res) => {
    const {pokemonId} = req.body
    const {id} = req.params
    await Collection.updateOne({
        _id: id
        }, {
            $pull: {"onHand": {"_id": pokemonId}}
        }, 
        { multi: true }
    )
    res.end()
}))

app.get('/api/session', catchAsync(async(req, res) => {
    const noUser = req.session.passport === undefined
    if (noUser) {
        res.json({})
    } else {
        const userData = await User.findById(req.session.passport.user).lean().populate({path: 'collections', select: 'type gen -owner'}).select('username collections notifications.unread').exec()
        res.json(userData)
    }
}))

app.put('/addtolist', async(req, res) => {
    const pokename = 'love'
    const ballname = 'moon'
    const setModifier = { $set: {
        [`ownedPokemon.$.balls.${ballname}.isHA`]: true
    }}
    const collection = await Collection.updateOne({
        _id: '64ea6ad589ae773b4001ec34', 
        "ownedPokemon.name": pokename
        }, setModifier
    )
    res.send('okay, updated pokemon!')
})

app.put('/addonhand', async(req, res) => {
    const id = '64fcbebe0a34c290b2956527'
    const newOnHand = {
        name: 'Charmander',
        natDexNum: 4,
        ball: 'heavy',
        gender: 'female',
        isHA: true,
        emCount: 4,
        EMs: ['Counter', 'Belly Drum', 'Iron Tail', 'Metal Claw'],
        qty: 1,
        _id: newObjectId()
    }
    const collection = await Collection.findById(id)
    collection.onHand.push(newOnHand)
    await collection.save()
    res.send('okay, added on-hand!')
})

app.get('/', (req, res) => {
    res.send('HOME PAGE')
})

// port/server
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('LISTENING ON PORT 3000')
})