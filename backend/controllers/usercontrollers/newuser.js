import User from '../../models/users.js'
import Collection from '../../models/collections.js'
import bcrypt from 'bcrypt'
import { apriballs } from '../../common/infoconstants/miscconstants.mjs'
import { getCollectionProgressPercent } from '../../models/postpremiddleware.js'
import { checkBadgeMilestone } from '../../models/postpremiddleware.js'

export async function createNewUser(req, res) {
    const {username, password, email, secQuestion1, secQuestion2, secQuestion3, secAnswer1, secAnswer2, secAnswer3, addCollection, collectionData} = req.body
    const securityQuestions = [
        secAnswer1 === undefined ? undefined : {question: secQuestion1, answer: await bcrypt.hash(secAnswer1, 11)},
        secAnswer2 === undefined ? undefined : {question: secQuestion2, answer: await bcrypt.hash(secAnswer2, 11)},
        secAnswer3 === undefined ? undefined : {question: secQuestion3, answer: await bcrypt.hash(secAnswer3, 11)}
    ].filter(item => item !== undefined)
    const settings = {
        profile: {bio: '', badges: [], games: []},
        privacy: {disabledTrades: false, blockedUsers: []},
        account: {verified: false, securityQuestions},
        display: {pokemonNames: {general: {regionalForms: 'default', originRegionalForms: 'default', alternateForms: 'default'}, specific: {}}, ballOrder: apriballs, defaultOnhandView: 'byIndividual'}
    }
    bcrypt.hash(password, 11, async function(err, hash) {
        const newUser = new User({
            username, 
            password: hash, 
            accountType: 'regular',
            email, 
            settings, 
            notifications: [
                {
                    type: 'system', 
                    title: 'Welcome to Pokellections!', 
                    message: `Welcome to Pokellections! Thank you for joining the site; we hope you enjoy! You can click on the icon next to your profile picture on the top right to get started on an aprimon collection!`,
                    unread: true
                }
            ]
        })
        await newUser.save()
        if (addCollection) {
            const saveToDatabase = {...collectionData, owner: newUser._id, ownedPokemon: collectionData.ownedPokemon.map(p => {return {...p, imgLink: undefined, possibleGender: undefined}}), onHand: collectionData.onHand.map(p => {return {...p, imgLink: undefined}}), availableGamesInfo: undefined, eggMoveInfo: undefined, progress: undefined}
            const collection = new Collection(saveToDatabase)
            await collection.save()

            const colProg = getCollectionProgressPercent(collection)
            const badgeChange = checkBadgeMilestone(colProg, [], [])
            if (badgeChange !== 'no-change') {
                newUser.settings.profile.badges = badgeChange
                await newUser.save()
            }
        }
        res.json(newUser._id)
    })
}