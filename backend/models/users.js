import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true}, minimize: false}

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
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

export default mongoose.model('User', userSchema);