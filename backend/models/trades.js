import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    status: {
        type: String, 
        required: true,
        enum: {
            values: ['pending', 'countered', 'rejected', 'accepted']
        }
    },
    offerer: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        validate: v => v.length <= 200
    },
//offer and receiving are always in the POV of the offerer. so offerer gives 'offer' and receives 'receiving', while recipient gives 'receiving' and receives 'offer'
    trade: {
        _id: false,
        type: Object,
        offer: { 
            _id: false,
            type: Object,
            value: {type: Number},
            pokemon: {
                type: [{
                    _id: false,
                    name: {type: String},
                    natDexNum: {type: Number},
                    balls: {
                        type: [{
                            ball: {
                                type: String,
                                enum: {
                                    values: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport']
                                }
                            },
                            isHA: {type: Boolean},
                            emCount: {type: Number, validate: v => v <= 4},
                            EMs: {type: Array, validate: v => v.length <= 4},
                            isMaxEMs: {type: Boolean},
                            onhandId: {type: String},
                            wanted: {type: Boolean},
                            for: {type: String}
                        }], 
                    }
                }]
            },
            items: {
                type: [{
                    _id: false,
                    name: {type: String},
                    qty: {type: Number}
                }]
            }
        },
        receiving: {
            _id: false,
            type: Object,
            value: {type: Number},
            pokemon: {
                type: [{
                    _id: false,
                    name: {type: String},
                    natDexNum: {type: Number},
                    ball: {type: String, enum: {values: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport']}},
                    isHA: {type: Boolean},
                    emCount: {type: Number, validate: v => v <= 4},
                    EMs: {type: Array, validate: v => v.length <= 4},
                    wanted: {type: Boolean},
                    for: {type: String}
                }]
            },
            items: {
                type: [{
                    _id: false,
                    name: {type: String},
                    qty: {type: Number}
                }]
            }
        }
    }
}, {timestamps: true})

function tradeUserLimit(val) {return val.length === 2}

const tradeSchema = new Schema({
    status: {
        type: String, 
        required: true,
        enum: {
            values: ['initialoffer', 'rejected', 'counteroffer', 'pending', 'completed', 'cancelled']
        }
    },
    closeDate: {type: Date},
    gen: {
        type: String,
        required: true
    },
    users: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
        validate: [tradeUserLimit, "{PATH} can't have more than 2 users!"]
    },
    markedCompleteBy: {type: String}, //when the trade is pending, this tracks which user marked it complete first
    deletedCollection: {0: {type: Boolean}, 1: {type: Boolean}}, //keep track of collection if one of them was deleted
    history: {
        type: [{
            type: offerSchema,
        }],
        // get: val => val.map(offer => {return {_id: offer._id, createdAt: offer.createdAt}})
    }
}, {timestamps: true, minimize: false})

tradeSchema.pre('save', (next) => {
    if (this === undefined) { //when its first created there is no data.
        next()
    }
    if (this.status === 'rejected' || this.status === 'completed') {
        this.closeDate = Date.now()
    }
    next()
})

export default mongoose.model('Trade', tradeSchema)