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
    const user = new User({username: 'paranoid-llama', password: 'rgdbdfbnasuia', email: 'qwqfafasfewwe'})
    await user.save()
    res.send('ok, made new user!')
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
    await User.findByIdAndUpdate({_id: newCollectionInfo.owner}, {$push: {'collections': collection._id}})

    res.json(collection._id)
}))

app.post('/collections/new/seeddb', catchAsync(async(req, res) => {
    const gens = [6, 7, 'swsh', 'bdsp', 9]
    const names = ['random sheet', 'first aprimon collection', 'we get this!', 'collecting aprimon', 'aprimon collector 1', 'aprimon collection 24', 'llamas sheet']
    const allUsers = await User.find({}).exec()
    const ownerIds = allUsers.map(user => user._id)

    const usernames = ['ash ketchup', 'penny', 'hihi', 'aprimon collector', 'selvt', 'paro', 'gary oak', 'misty', 'brock', 'sabrina', 'everword', 'superguy12345', 'XxpokemonCollectorxX', 'lol', 'neverAgain', 'findmyway', 'pandabear', 'pandaman', 'pirate king garon', 'aaron', 'matear', 'poalert', 'poltergeist', 'pikachu enjoyer', 'gen wunner', 'wurst', 'gutentag', 'betterman', 'the pokemon lady']

    for (let i=0; i < 100; i++) {
        const gen = gens[Math.floor(Math.random() * gens.length)]
        const isHARand = Math.floor(Math.random()*2)
        const emCountRand = Math.floor(Math.random()*5)
        const newCollectionInfo = {
            gen: gen,
            collectionName: names[Math.floor(Math.random() * names.length)],
            owner: ownerIds[Math.floor(Math.random() * ownerIds.length)],
            options: {
                collectingBalls: gen === 6 ? ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'dream', 'safari', 'sport'] : ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'],
                globalDefaults: {isHA: isHARand === 0 ? true : false, emCount: emCountRand},
                sortingOptions: {collection: {reorder: false, default: 'NatDexNumL2H'}, onhand: {reorder: true, default: 'NatDexNumL2H', ballOrder: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'], sortFirstBy: 'pokemon'}},
                tradePreferences: {status: 'open', rates: {pokemonOffers: [{items: ['On-Hand HA Aprimon', 'HA Aprimon'], rate: [2, 1]}], itemOffers: []}, size: 'small preferred', onhandOnly: 'no', items: 'none', lfItems: [], ftItems: {}}
            }
        }
        const collectionData = new CollectionClass(undefined, newCollectionInfo)
        const collection = new Collection(collectionData)
        await collection.save()
    }

    // for (let user of usernames) {
    //     bcrypt.hash('12345', 11, async function(err, hash) {
    //         const newUser = new User({username: user, password: hash, email: 'rhuvrh8hif'})
    //         await newUser.save()
    //     })
    // }

    res.end()
}))

app.get('/collections/:id', catchAsync(async(req, res) => {
    const collection = await Collection.findById(req.params.id).populate({path: 'owner'})
    res.json(collection)
}))

app.get('/users/:id', catchAsync(async(req, res) => {
    const user = await User.findById(req.params.id).populate({path: 'collections'})
    res.json(user)
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
    const onhandSortingOptions = collection.options.sortingOptions.onhand
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
        if (updateEggMoves) {
            const updatedEggMoveInfo = getPossibleEggMoves(newOwnedCollectionList, gen)
            res.json(updatedEggMoveInfo)
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
        const userData = await User.findById(req.session.passport.user).lean().populate({path: 'collections', select: 'type gen -owner'}).select('username collections').exec()
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