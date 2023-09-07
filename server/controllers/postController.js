import asyncHandler from 'express-async-handler';
import Post from '../models/PostModel.js';

const getPosts = asyncHandler(async (req, res, next) => {
    const Posts = await Post.find();
    res.status(200).json({
        success: true,
        Posts: Posts
    });
});


export {getPosts};