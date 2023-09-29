import mongoose from 'mongoose';

const userScheme = mongoose.Schema({
    f_name: {
        type: String,
        required: true
    },
    l_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    ban: {
        type: Boolean,
        required: false
    },
    resetToken: {
        type: String,
        required: false
    },
    profile_pic: {
        type: String,
        required: false
    },
    savedPosts: {
        type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        required: false
    },
    groups: {
        type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Group' }],
        required: false
    },
    blocked: {
        type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
        required: false
    },
    approved: {
        type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
        required: false
    }
}, { timestamps: true });

export default mongoose.model('User', userScheme);