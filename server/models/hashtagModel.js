import mongoose from 'mongoose';

const hashtagScheme = mongoose.Schema({
    likes: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    followers: {
        type: Number,
        required: true
    },
    posts: {
        type: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        required: false
    },
});

export default mongoose.model('Hashtag', hashtagScheme);