import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true}}

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
        required: true
    }
}, opts)

userSchema.virtual('collections', {
    ref: 'Collection',
    localField: '_id',
    foreignField: 'owner'
})

export default mongoose.model('User', userSchema);