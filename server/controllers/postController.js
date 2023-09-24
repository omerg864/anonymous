import asyncHandler from 'express-async-handler';
import Post from '../models/PostModel.js';

const getMyPosts = asyncHandler(async (req, res, next) => {
    const posts = await Post.find({user: req.user._id});
    res.status(200).json({
        success: true,
        posts
    });
});

const createPost = asyncHandler(async (req, res, next) => {
    const {title, content, type, media} = req.body;
    const post = await Post.create({
        title,
        content,
        likes: 0,
        type,
        media,
        user: req.user._id
    });
    res.status(200).json({
        success: true,
        post: post
    });
});


export {getMyPosts, createPost};