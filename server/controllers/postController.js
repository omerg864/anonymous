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

const deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(!post) {
        res.status(400);
        throw new Error('Post not found');
    }
    if(post.user != req.user._id && !req.user.admin) {
        res.status(400);
        throw new Error('Unauthorized');
    }
    await Comment.deleteMany({post: post._id});
    if(post.tweetId) {
        const twitter = twitterClient();
        await twitter.v2.deleteTweet(post.tweetId);
    }
    await post.remove();
    res.status(200).json({
        success: true
    });
});

const toggleLikePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(!post) {
        res.status(400);
        throw new Error('Post not found');
    }
    let liked = false;
    for(let i = 0; i < post.likes.length; i++) {
        if(post.likes[i].toString() == req.user._id.toString()) {
            liked = true;
            break;
        }
    }
    if(liked) {
        post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
        post.likes.push(req.user._id);
    }
    await post.save();
    res.status(200).json({
        success: true,
        liked: !liked,
        likes: post.likes.length
    });
});


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


export {getUserPosts, createPost, deletePost, toggleLikePost};