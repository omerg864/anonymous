import asyncHandler from 'express-async-handler';
import Hashtag from '../models/hashtagModel.js';
import { addPostData } from '../utils/globalFunctions.js';

const getHashtag = asyncHandler(async (req, res, next) => {
    const name = req.params.name;
    const hashtag = await Hashtag.findOne({name: name}).populate('posts');
    if(!hashtag) {
        res.status(404);
        throw new Error('Hashtag not found');
    }
    let posts;
    if (req.user) {
        posts = await addPostData(hashtag.posts, req.user._id, req.user.savedPosts);
    } else {
        posts = await addPostData(hashtag.posts);
    }
    delete hashtag["__v"];
    hashtag.posts = [];
    res.status(200).json({
        success: true,
        hashtag: hashtag,
        posts: posts
    });
});


export {getHashtag};