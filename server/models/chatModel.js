import mongoose from 'mongoose';

const chatScheme = mongoose.Schema({
    users:{
        type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
        required: true
    },
},  { timestamps: true });

export default mongoose.model('Chat', chatScheme);