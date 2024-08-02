import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
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
            tags: {
                type: [
                    {type: String}
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
            }
        }
    }, 
    notifications: {
        type: [{
            type: {type: String, required: true, //object key is 'type' to denote whether its a user message/site message/trade offer update/other message
                enum: {
                    values: ['trade-offer: new', 'trade-offer: counter', 'trade-offer: accept', 'trade-offer: reject', 'site message']
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

export default mongoose.model('User', userSchema);