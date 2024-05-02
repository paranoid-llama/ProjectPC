import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {getImgLink, getPossibleEggMoves, getPossibleGender} from './../utils/schemavirtuals/collectionvirtuals.js'

const opts = {toJSON: {virtuals: true}}

const collectionSchema = new Schema ({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
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
                            type: String 
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
            ftItems: {_id: false, type: Object} //obj of items they're offering with keys being item names. validated thru frontend. could be validated here
                                                //for more security but more work than is needed as of april 17 2024
        }
    },
    trades: {
        type: [{type: Schema.Types.ObjectId}],
        ref: "Trades"
    },
    ownedPokemon: [{
        _id: false,
        name: String,
        displayName: String,
        natDexNum: Number,
        gen: Number,
        balls: {
            _id: false,
            type: Object,
            fast: {
                _id: false,
                disabled: Boolean,
                isOwned: Boolean,
                isHA: Boolean,
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
                EMs: Array,
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
        EMs: Array,
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

collectionSchema.virtual('eggMoveInfo').get(function() {
    return getPossibleEggMoves(this.ownedPokemon, this.gen)
})


collectionSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Collection', collectionSchema)