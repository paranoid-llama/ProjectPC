import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    _id: false,
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
        validate: v => v.length <= 150
    },
//offer and receiving are always in the POV of the offerer. so offerer gives 'offer' and receives 'receiving', while recipient gives 'receiving' and receives 'offer'
    trade: {
        _id: false,
        type: Object,
        offer: { 
            _id: false,
            type: Object,
            pokemon: {
                type: [{
                    _id: false,
                    name: {type: String},
                    natDexNum: {type: Number},
                    ball: {type: String, enum: {values: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport']}},
                    isHA: {type: Boolean},
                    emCount: {type: Number},
                    EMs: {type: Array, validate: v => v.length <= 4}
                }]
            },
            items: {
                type: [{
                    _id: false,
                    itemName: {type: String},
                    stock: {type: Number}
                }]
            }
        },
        receiving: {
            _id: false,
            type: Object,
            pokemon: {
                type: [{
                    _id: false,
                    name: {type: String},
                    natDexNum: {type: Number},
                    ball: {type: String, enum: {values: ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport']}},
                    isHA: {type: Boolean},
                    emCount: {type: Number},
                    EMs: {type: Array, validate: v => v.length <= 4}
                }]
            },
            items: {
                type: [{
                    _id: false,
                    itemName: {type: String},
                    stock: {type: Number}
                }]
            }
        }
    }
}, {timestamps: true})

function tradeUserLimit(val) {
    return val.length === 2
}

const tradeSchema = new Schema({
    status: {
        type: String, 
        required: true,
        enum: {
            values: ['initial offer', 'rejected', 'counteroffer', 'pending', 'completed']
        }
    },
    closeDate: {type: String},
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
    history: {
        type: [{
            type: offerSchema,
            required: true
        }]
    }
})

tradeSchema.pre('save', (next) => {
    if (this.status === 'rejected' || this.status === 'completed') {
        this.closeDate = Date.now()
    }
    next()
})

export default mongoose.model('Trade', tradeSchema)