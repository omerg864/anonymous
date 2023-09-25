import mongoose from 'mongoose';

const postScheme = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
        required: false
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: false
    }
}, { timestamps: true });

export default mongoose.model('Post', postScheme);