import mongoose from 'mongoose';

const messageScheme = mongoose.Schema({
    first_var: {
        type: String,
        required: true,
        unique: true
    },
    second_var: {
        type: String,
        required: true
    },
}, { timestamps: true });

export default mongoose.model('message', messageScheme);