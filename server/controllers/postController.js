import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Comment from '../models/commentModel.js';
import Hashtag from '../models/hashtagModel.js';
import { POST_LIMIT } from '../utils/consts.js';
import { countChar } from '../utils/globalFunctions.js';
import { addPostData } from '../utils/globalFunctions.js';
import { twitterClient } from '../config/twitter.js';

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
    }
        let page = req.query.page;
        posts = await Post.find({user: user._id}).populate('user', ['-password', '-__v', '-admin', '-updatedAt']).limit(POST_LIMIT).skip(POST_LIMIT * page).sort({createdAt: -1});
        let postsNew = await addPostData(posts, req.user._id, req.user.savedPosts);
    res.status(200).json({
        success: true,
        editable: self,
        posts: postsNew
    });
});

// TODO: add safe guards
const createPost = asyncHandler(async (req, res, next) => {
    const {content, type, media} = req.body;
    if(!content || !type) {
        res.status(400);
        throw new Error('Invalid request');
    }
    const contentWords = content.split(" ");
    let hashtags = [];
    for(let i = 0; i < contentWords.length; i++) {
        if(contentWords[i].startsWith("#") && contentWords[i].length > 1 && contentWords[i].length < 20 && countChar(contentWords[i], '#') === 1) {
            hashtags.push(contentWords[i].substring(1));
        }
    }
    const post = await Post.create({
        content,
        likes: [],
        type,
        media,
        user: req.user._id
    });
    let tweetInfo = null;
    if(post) {
        for(let i = 0; i < hashtags.length; i++) {
            let hashtag = await Hashtag.findOne({name: hashtags[i]});
            if(!hashtag) {
                hashtag = await Hashtag.create({
                    name: hashtags[i],
                    posts: [],
                    followers: 0,
                    likes: 0
                });
            }
            hashtag.posts.push(post._id);
            await hashtag.save();
        }
        if(req.user.admin){
            const twitter = twitterClient();
            tweetInfo = await twitter.v2.tweet(content);
            if(tweetInfo) {
                post.tweetId = tweetInfo.data.id;
                await post.save();
            }
        }
    }
    res.status(200).json({
        success: true,
        post: post,
        tweet: tweetInfo
    });
});


export {getUserPosts, createPost};