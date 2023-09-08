import mongoose from 'mongoose';

const groupScheme = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    open: {
        type: Boolean,
        required: true
    },
    members: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Group', groupScheme);