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
    gen: {
        type: String,
        required: true
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