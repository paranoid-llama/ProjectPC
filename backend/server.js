import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {formatImportQuery, setEMQueries, formatImportedValues, setCollection} from './utils/CreateCollection/importCollection.js'
// require('dotenv').config()
import dotenv from 'dotenv'
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

//utils and classes
import catchAsync from './utils/catchAsync.js'
import CollectionClass from './utils/createCollection.js'

//models
import Collection from './models/collections.js'
import User from './models/users.js'

//database connection
mongoose.connect("mongodb://127.0.0.1:27017/ProjectPC", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

//middleware
app.use(cors())
app.use(express.json())

//routes

app.get('/message', (req, res) => {
    res.json({ message: "Hello from server!" });
})

app.post('/users/new', catchAsync(async(req, res) => {
    const user = new User({username: 'llama', password: 'rfgwgw', email: 'fgwfgvw'})
    await user.save()
    res.send('ok, made new user!')
}))

app.get('/collections', catchAsync(async(req, res) => {
    const collections = await Collection.find({}).populate({path: 'owner'})
    res.json(collections)
}))

app.post('/collections/new/import', catchAsync(async(req, res) => {
    const {spreadsheetId, apiRequestQueries, collectionTypeValue} = req.body
    const {dexNum, names, balls, HA, EM1, EM2, EM3, EM4, emColors} = apiRequestQueries
    const noDexNums = dexNum === undefined
    const noHAColImport = HA === undefined || typeof HA === 'object'
    const noEMsColImport = EM1 === undefined //must populate all EM fields or they don't import
    const noEMColorImport = emColors === undefined
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
    const importedHAInfoArr = HA !== undefined && formatImportedValues('HA', noHAColImport ? colorData.sheets[0].data[0].rowData : data.valueRanges[HADataIdx].values, gapRowIdxs, 'none', noHAColImport && HA)
    const importedEMCountInfoArr = !noEMColorImport && formatImportedValues('emColor', colorData.sheets[0].data[0].rowData, gapRowIdxs, 'none', emColors)
    const importedEMsInfoArr = !noEMsColImport && formatImportedValues('EMs', data.valueRanges[EMDataIdxs.EM1], gapRowIdxs, 'none', [], {EM2: data.valueRanges[EMDataIdxs.EM2], EM3: data.valueRanges[EMDataIdxs.EM3], EM4: data.valueRanges[EMDataIdxs.EM4]})
    // console.log(HA)
    // console.log(importedHAInfoArr)
    const newCollection = setCollection(noDexNums ? importedNamesArr : importedDexNumArr, importedNamesArr, importedBallInfoArr, gapRowIdxs, balls.order, collectionTypeValue, HA !== undefined ? importedHAInfoArr : undefined, noHAColImport ? 'colors' : 'col', importedEMCountInfoArr, importedEMsInfoArr)
    // console.log(data.valueRanges[ballsDataIdx].values)

    // console.log(data.valueRanges[1].values)

    res.json(newCollection)
}))


app.post('/collections/new', catchAsync(async(req, res) => {
    const {gen, includeBabyMon, includeIncenseMon, owner, interchangeableAltForms} = req.body
    const collectionData = new CollectionClass(gen, includeBabyMon, includeIncenseMon, owner, interchangeableAltForms)
    const collection = new Collection(collectionData)
    await collection.save()
    res.end()
}))

app.get('/collections/:id', catchAsync(async(req, res) => {
    const collection = await Collection.findById(req.params.id).populate({path: 'owner'})
    res.json(collection)
}))

app.put('/collections/:id/edit', catchAsync(async(req, res) => {
    const changedField = Object.keys(req.body)[2]
    const newValueOfChangedField = Object.values(req.body)[2]
    const {pokename, ballname, idOfPokemon, onhandPokemon} = req.body //idofpokemon is only for onhand pokemon
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
            const setModifier = { $set: {
                [`ownedPokemon.$.balls.${ballname}.${changedField}`]: newValueOfChangedField
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
    collection.save()

    res.end()
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