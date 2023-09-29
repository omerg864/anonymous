import mongoose from 'mongoose';

const messageScheme = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    text: {
        type: String,
        required: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    }
},  { timestamps: true });

export default mongoose.model('Message', messageScheme);