import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Comment from '../models/commentModel.js';
import Hashtag from '../models/hashtagModel.js';
import { POST_LIMIT } from '../utils/consts.js';

const getUserPosts = asyncHandler(async (req, res, next) => {
    let id = req.params.id;
    let self = false;
    if(!id || id == req.user._id) {
        id = req.user._id;
        self = true;
    }
    let user = await User.findById(id).populate('approved');
    if (!user) {
        res.status(400)
        throw new Error('User not found');
    }
    let posts = [];
    if(!self && !req.user.admin) {
        if(!(req.user._id in user.approved)) {
            res.status(400)
            throw new Error('Unauthorized');
        }
    } else {
        let page = req.query.page;
        posts = await Post.find({user: user._id}).populate('user', ['-password', '-__v', '-admin', '-updatedAt']).limit(POST_LIMIT).skip(POST_LIMIT * page).sort({createdAt: -1});
        for(let i = 0; i < posts.length; i++) {
            let post = posts[i];
            post = post._doc;
            post["editable"] = true;
            if(req.user._id in post.likes) {
                post["liked"] = true;
            } else {
                post["liked"] = false;
            }
            post["likes"] = post["likes"].length;
            let comments = await Comment.find({post: post._id}).count();
            post["comments"] = comments;
            delete post["__v"];
            posts[i] = post;
        }
    }
    res.status(200).json({
        success: true,
        editable: self,
        posts
    });
});

const createPost = asyncHandler(async (req, res, next) => {
    const {title, content, type, media} = req.body;
    const post = await Post.create({
        title,
        content,
        likes: [],
        type,
        media,
        user: req.user._id
    });
    res.status(200).json({
        success: true,
        post: post
    });
});


export {getUserPosts, createPost};