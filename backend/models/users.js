import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import Collection from './collections.js'
import Trade from './trades.js'
import { deletedUserNotifications } from './postpremiddleware.js';
const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true}, minimize: false}

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        max: 24
    },
    password: {
        type: String,
        required: true
    },
    accountType: {type: String, enum: {values: ['regular', 'admin', 'owner']}},
    email: {
        type: String,
        required: true,
        unique: true
    },
    settings: {
        _id: false,
        profile: {
            _id: false,
            bio: {type: String, max: 300},
            badges: {
                type: [
                    {
                        type: String,
                        enum: {
                            values: [
                                'apri-novice', 'apri-amateur', 'apri-enthusiast', 'apri-expert', 'apri-master', 'apri-multigen',
                                'trader-new', 'trader-aspiring', 'trader-avid', 'trader-experienced', 'trader-veteran', 'trader-breeder'
                            ]
                        }
                    }
                ]
            },
            games: {type: Array}
        },
        privacy: {
            _id: false,
            disabledTrades: {type: Boolean},
            blockedUsers: {type: Array}
        },
        account: {
            _id: false,
            verified: {type: Boolean},
            securityQuestions: {
                type: [{
                    _id: false,
                    question: {type: String},
                    answer: {type: String}
                }],
                validate: v => v.length <= 3
            }
        },
        display: {
            _id: false,
            pokemonNames: {
                _id: false,
                general: {
                    _id: false,
                    regionalForms: {
                        type: String, 
                        enum: {
                            values: ['default', 'brackets-full-out', 'brackets-full-in', 'dash-full-out', 'dash-full-in', 'dash-short-out', 'dash-short-in']
                        }
                    },
                    originRegionalForms: {
                        type: String, 
                        enum: {
                            values: ['default', 'default-regional', 'brackets-full-out', 'brackets-full-in', 'dash-full-out', 'dash-full-in', 'dash-short-out', 'dash-short-in']
                        }
                    },
                    alternateForms: {
                        type: String, 
                        enum: {
                            values: ['default', 'brackets-full-formname-out', 'brackets-full-in', 'dash-full-out', 'dash-full-in', 'dash-short-out', 'dash-short-in']
                        }
                    }
                },
                specific: {
                    _id: false,
                    type: Object
                }
            },
            ballOrder: {
                type: [{
                    type: String,
                    enum: {
                        values: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport']
                    }
                }],
                validate: v => v.length === 11 && !v.map((vV, idx) => v.indexOf(vV) === idx).includes(false)
            },
            defaultOnhandView: {type: String, enum: {values: ['byIndividual', 'byPokemon']}}
        }
    }, 
    notifications: {
        type: [{
            type: {type: String, required: true, //object key is 'type' to denote whether its a user message/site message/trade offer update/other message
                enum: {
                    values: ['trade-offer: new', 'trade-offer: counter', 'trade-offer: accept', 'trade-offer: reject', 'trade-offer: cancel', 'system', 'site update']
                }
            }, 
            title: {type: String},
            tradeData: {_id: false, otherParticipant: {type: String}, tradeGen: {type: String}, tradeId: {type: String}},
            message: {type: String},
            unread: {type: Boolean}
        }]
    }
}, opts)

userSchema.virtual('collections', {
    ref: 'Collection',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.plugin(mongooseUniqueValidator)

userSchema.post('findOneAndDelete', async function(user) {
    if (user) {
        const allThisUsersCollections = await Collection.find({owner: user._id})
        const allThisUsersTrades = await Trade.find({users: {$in: user._id}})
        allThisUsersCollections.forEach(async(col) => {
            await Collection.findByIdAndDelete(col._id) //we do it this way so it triggers the post middleware for the collection model
        })
        allThisUsersTrades.forEach(async(trade) => {
            const userPos = trade.users.indexOf(user._id)
            // trade.users[userPos] = 'deleted'
            trade.history = trade.history.map(offer => {
                const isOfferer = user.username === offer.offerer
                const edit = isOfferer ? {offerer: 'deleted'} : {recipient: 'deleted'}
                return {...offer, ...edit}
            })
            trade.markedCompleteBy = trade.markedCompleteBy === user.username ? 'deleted' : trade.markedCompleteBy
            await trade.save()
        })
        await deletedUserNotifications(user.username)
    }
})

export default mongoose.model('User', userSchema);