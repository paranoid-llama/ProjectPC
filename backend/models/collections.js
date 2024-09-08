import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {getImgLink, getPossibleEggMoves, getPossibleGender, getCollectionProgress, getAvailableHomeGames} from './../utils/schemavirtuals/collectionvirtuals.js'
import Trade from './trades.js'
import User from './users.js'
import { setPendingTrade } from '../controllers/tradecontrollers/colmanagementfuncs.js';
import { getCollectionProgressPercent, checkBadgeMilestone } from './postpremiddleware.js';
import { collectionProgressAggField } from '../controllers/searchcontroller.js';
import { postDeleteColEditTradeCol } from './postpremiddleware.js';

const opts = {toJSON: {virtuals: true}, minimize: false}

const collectionSchema = new Schema ({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {type: String, enum: {values: ['aprimon']}},
    name: {
        type: String,
        required: true
    },
    gen: {
        type: String,
        required: true
    }, 
    options: {
        _id: false,
        type: Object,
        collectionBalls: {type: Array},
        globalDefault: {
            isHA: {type: Boolean},
            emCount: {type: Number}
        },
        sorting: {
            _id: false,
            type: Object,
            collection: {_id: false, type: Object, default: {type: String}, reorder: {type: Boolean}},
            onhand: {_id: false, type: Object, default: {type: String}, reorder: {type: Boolean}, ballOrder: {type: Array}, sortFirstBy: {type: String, enum: {values: ['pokemon', 'ball']}}}
        },
        tradePreferences: {
            _id: false,
            type: Object,
            status: {
                type: String,
                enum: {
                    values: ['open', 'closed']
                }
            },
            rates: {
                _id: false,
                type: Object,
                pokemonOffers: {
                    type: [{
                        _id: false,
                        type: Object,
                        items: { //always ordered as user's item at index 0 and offer's item at index 1
                            type: [{
                                type: String
                            }],
                            validate: v => v.length === 2
                        },
                        rate: {//always ordered as user's item : offer item (index0 : index1)
                            type: [{
                                type: String
                            }],
                            validate: v => v.length === 2
                        }
                    }],
                    validate: v => v.length <= 8 //putting an arbitrary limit of 8 on allowed rate definitions of a particular type
                },
                itemOffers: {
                    type: [{
                        _id: false,
                        type: Object,
                        items: { 
                            type: [{
                                type: String
                            }],
                            validate: v => v.length === 2
                        },
                        rate: {
                            type: [{
                                type: String
                            }],
                            validate: v => v.length === 2
                        }
                    }],
                    validate: v => v.length <= 8
                } 
            },
            size: {
                type: String,
                enum: {
                    values: ['any', 'small preferred', 'small only', 'large preferred', 'large only']
                }
            },
            onhandOnly: {
                type: String,
                enum: {
                    values: ['yes', 'no', 'preferred']
                }
            },
            items: {
                type: String,
                enum: {
                    values: ['none', 'lf', 'ft', 'lf/ft']
                }
            },
            lfItems: {type: Array}, //arr of items they're looking for if they are looking for any
            ftItems: {_id: false, type: Object, minimize: false} 
            //obj of items they're offering with keys being item names. validated thru frontend. could be validated here
            //for more security but more work than is needed as of april 17 2024
        }
    },
    ownedPokemon: [{
        _id: false,
        name: String,
        displayName: String,
        natDexNum: Number,
        gen: Number,
        disabled: Boolean,
        balls: {
            _id: false,
            type: Object,
            fast: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            friend: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            heavy: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            level: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            love: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            lure: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            moon: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            beast: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            dream: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            safari: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            },
            sport: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: {type: Array, default: undefined},
                emCount: Number,
                default: Boolean,
                highlyWanted: Boolean,
                pending: Boolean
            }
        }
    }],
    onHand: [{
        name: String,
        natDexNum: Number,
        ball: String,
        gender: String,
        isHA: Boolean,
        emCount: Number,
        EMs: {type: Array, default: undefined},
        reserved: Number,
        qty: Number
    }]
}, opts)

collectionSchema.path('ownedPokemon').schema.virtual('imgLink').get(function() {
    return getImgLink(this)
})

collectionSchema.path('ownedPokemon').schema.virtual('possibleGender').get(function() {
    return getPossibleGender(this)
})

collectionSchema.path('onHand').schema.virtual('imgLink').get(function() {
    return getImgLink(this)
})

collectionSchema.virtual('availableGamesInfo').get(function() {
    if (this.gen === 'home') {
        return getAvailableHomeGames(this.ownedPokemon)
    } else {
        null
    }
})

collectionSchema.virtual('progress').get(function() {
    return getCollectionProgressPercent(this)
})

collectionSchema.virtual('eggMoveInfo').get(function() {
    if (this.gen === 'home') {
        null
    } else {
        return getPossibleEggMoves(this.ownedPokemon, this.gen)
    }
})

collectionSchema.post('findOneAndUpdate', async function(doc) {
    //logic for badges here. doc is the collection.
    if (doc) {
        const user = await User.findById(doc.owner).populate({path: 'collections', select: 'ownedPokemon'})
        const colProg = getCollectionProgressPercent(user.collections.filter(c => c._id.toString() === doc._id.toString())[0]) 
        const otherColProgs = user.collections.map(col => {return {_id: col._id, progress: getCollectionProgressPercent(col)}}).filter(col => col._id.toString() !== doc._id.toString()).map(col => col.progress)
        const badgeChange = checkBadgeMilestone(colProg, user.settings.profile.badges, otherColProgs)
        if (badgeChange === 'no-change') {return}
        else {
            user.settings.profile.badges = badgeChange
            user.save()
        }
    }
})

collectionSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const tradesThisUserMade = await Trade.find({users: {$in: doc.owner}})
        const userInfo = await User.findById(doc.owner.toString())
        const tradesWithThisCollection = tradesThisUserMade.filter(async trade => {
            const userPos = trade.users.map(user => user.toString()).indexOf(doc.owner.toString())
            const gen = trade.gen.includes('-') ? (userPos === 0 ? trade.gen.slice(0, trade.gen.indexOf('-')) : trade.gen.slice(trade.gen.indexOf('-')+1, trade.gen.length)) : trade.gen
            const editThisDoc = doc.gen === gen && !trade.deletedCollection[userPos]
            if (editThisDoc) {
                const editTradeStatus = (trade.status !== 'rejected' && trade.status !== 'completed')
                if (editTradeStatus) {
                    const latestOffer = trade.history[trade.history.length-1]
                    const editOtherCollection = trade.status === 'pending' || 
                        ((trade.status === 'initialoffer' || trade.status === 'counteroffer') && 
                            latestOffer.offerer !== userInfo.username && 
                            latestOffer.trade.offer.pokemon.map(p => p.balls.filter(ballData => ballData.onhandId !== undefined).includes(true)).includes(true)
                        )
                    if (editOtherCollection) {
                        postDeleteColEditTradeCol(trade, userPos)
                    }
                    trade.status = 'cancelled'
                    trade.closeDate = Date.now()
                }
                trade.deletedCollection = {...trade.deletedCollection, [userPos]: true}
            }
            return editThisDoc
        })
        tradesWithThisCollection.forEach(trade => {
            trade.save()
        })
    }
})

collectionSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Collection', collectionSchema)