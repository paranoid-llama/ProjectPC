import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// require('dotenv').config()
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import { initializePassportStrategy } from './middleware.js';
import passport from 'passport';
import session from 'express-session';
import MongoDBStore from 'connect-mongo'
import jwt from 'jsonwebtoken'
import { apriballs } from './common/infoconstants/miscconstants.mjs';
import bcrypt from 'bcrypt'
// import './services/getGmailService.js'
dotenv.config()

//env variables

const SECRET = process.env.SECRET
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/ProjectPC"
const frontendUrl = process.env.FRONTEND_URL || true

//utils and classes
import catchAsync from './utils/catchAsync.js'
import CollectionClass from './utils/createCollection.js'

//models
import Collection from './models/collections.js'
import User from './models/users.js'
import Trade from './models/trades.js'

//routes
import {router as collectionRoutes} from './routes/collectionroutes.js';
import {router as userRoutes} from './routes/userroutes.js';
import {router as tradeRoutes} from './routes/traderoutes.js'
import {router as apiRoutes} from './routes/apiroutes.js'
import {router as searchRoutes} from './routes/searchroutes.js'

//database connection 
mongoose.connect(dbUrl, {})

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
app.use(cors({ credentials: true, origin: frontendUrl }))

// app.use(nocache())
app.use(express.json({ limit: '500kb' }))
app.use(bodyParser.json({ limit: '500kb' }))
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Origin', frontendUrl);

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
app.use('/collections', collectionRoutes)
app.use('/users', userRoutes)
app.use('/trades', tradeRoutes)
app.use('/api', apiRoutes)
app.use('/search', searchRoutes)

app.post('/collections/new/seeddb', catchAsync(async(req, res) => {
    const gens = [6, 7, 'swsh', 'bdsp', 9, 'home']
    const names = ['random sheet', 'first aprimon collection', 'we get this!', 'collecting aprimon', 'aprimon collector 1', 'aprimon collection 24', 'llamas sheet']

    const usernames = ['ash ketchup', 'hihi', 'aprimon collector', 'selvt', 'paro', 'gary oak', 'misty', 'brock', 'sabrina', 'everword', 'superguy12345', 'XxpokemonCollectorxX', 'lol', 'neverAgain', 'findmyway', 'pandabear', 'pandaman', 'pirate king garon', 'aaron', 'matear', 'poalert', 'poltergeist', 'pikachu enjoyer', 'gen wunner', 'wurst', 'gutentag', 'betterman', 'the pokemon lady']
    const emails = ['gma@gmail.com', 'Michaela99@gmail.com', 'Haylie4@gmail.com', 'Gonzalo_Marks79@gmail.com',  'Clare82@gmail.com', 'Kaylee8@gmail.com', 'Chaim.Gerhold34@gmail.com', 'Trycia_Hyatt90@gmail.com', 'Ezra_Buckridge@gmail.com', 'Zachary42@gmail.com', 'Neha_Goodwin@gmail.com', 'Amira.Legros@gmail.com', 'Audie37@outlook.com', 'Jodie.Jakubowski10@outlook.com', 'Dale43@outlook.com', 'Karina29@outlook.com', 'Torrey_Dickens26@outlook.com', 'Cathrine.Stoltenberg24@outlook.com', 'Kaitlyn.Hills34@outlook.com', 'Emily.Ondricka@outlook.com', 'Destiney78@outlook.com', 'Ottis_Bode17@outlook.com', 'Abdiel.Zieme@outlook.com', 'Omari_Lowe@outlook.com', 'Joanne.Dooley@outlook.com', 'Orin.Stark77@outlook.com', 'Mikayla.Wilderman1@outlook.com', 'Kristy.Runolfsdottir85@outlook.com', 'Marquis17@outlook.com', 'Sherwood.Borer@outlook.com', 'Susan_Armstrong73@outlook.com', 'Verna20@outlook.com']
    
    // for (let i=0; i < 100; i++) {
    //     const allUsers = await User.find({}).lean().populate({path: 'collections', select: 'gen'}).exec()
    //     const ownerIds = allUsers.map(user => user._id)
    //     const newOwner = ownerIds[Math.floor(Math.random() * ownerIds.length)]
    //     const newOwnerCollections = allUsers.filter(userD => userD._id === newOwner)[0].collections
    //     const genObj = {gen: ''}
    //     for (let i=0; i < 5; i++) {
    //         const newGen = gens[Math.floor(Math.random(gens.length)*gens.length)]
    //         if (newOwnerCollections.filter(col => col.gen === newGen).length !== 0) {return}
    //         genObj.gen = newGen
    //         break;
    //     }
    //     if (genObj.gen === '') {return}
    //     const isHARand = Math.floor(Math.random()*2)
    //     const emCountRand = Math.floor(Math.random()*5)
    //     const newCollectionInfo = {
    //         gen: genObj.gen,
    //         collectionName: names[Math.floor(Math.random() * names.length)],
    //         owner: ownerIds[Math.floor(Math.random() * ownerIds.length)],
    //         options: {
    //             collectingBalls: genObj.gen === 6 ? ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'dream', 'safari', 'sport'] : ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'],
    //             globalDefaults: {isHA: isHARand === 0 ? true : false, emCount: emCountRand},
    //             sorting: {collection: {reorder: false, default: 'NatDexNumL2H'}, onhand: {reorder: true, default: 'NatDexNumL2H', ballOrder: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'], sortFirstBy: 'pokemon'}},
    //             tradePreferences: {status: 'open', rates: {pokemonOffers: [{items: ['On-Hand HA Aprimon', 'HA Aprimon'], rate: [2, 1]}], itemOffers: []}, size: 'small preferred', onhandOnly: 'no', items: 'none', lfItems: [], ftItems: {}}
    //         }
    //     }
    //     const collectionData = new CollectionClass(undefined, newCollectionInfo)
    //     const collection = new Collection(collectionData)
    //     await collection.save()
    // }

    // const token = jwt.sign({
    //     exp: Math.floor(Date.now() / 1000) + (60 * 5),
    //     data: 'foobar'
    //   }, 'secret');
    // const verified = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjQzNDgwNTQsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE3MjQzNDc3NTR9.7nALgltPzkhZlvIL4gR7O5P0-pmxPiiSS8AsN-tf8pA', 'secret')
    // console.log(verified)

    // for (let user of usernames) {
    //     const securityQuestions = [{question: 'hi there!', answer: 'duh'}]
    //     const randEmail = emails[usernames.indexOf(user)]
    //     const settings = {
    //         profile: {bio: '', badges: [], games: []},
    //         privacy: {disabledTrades: false, blockedUsers: []},
    //         account: {verified: false, securityQuestions},
    //         display: {pokemonNames: {general: {regionalForms: 'default', originRegionalForms: 'default', alternateForms: 'default'}, specific: {}}, ballOrder: apriballs}
    //     }
    //     bcrypt.hash('12345', 11, async function(err, hash) {
    //         const newUser = new User({username: user, password: hash, accountType: 'regular', email: randEmail, settings})
    //         await newUser.save()
    //     })
    // }

    res.end()
}))

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).send(err)
})

// port/server
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('LISTENING ON PORT 3000')
})