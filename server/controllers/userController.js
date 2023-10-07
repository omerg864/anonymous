import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Hashtag from '../models/hashtagModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { emailRegex, passwordRegex } from '../utils/regex.js';
import { sendMail } from '../utils/globalFunctions.js';
import { addPostData } from '../utils/globalFunctions.js';
import Group from '../models/groupModel.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

const getHashtags = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('saveHashtags');
    let hashtags = user.saveHashtags;
    if(!hashtags) {
        hashtags = [];
    }
    hashtags = hashtags.map((hashtag) => {
        return {
            ...hashtag._doc,
            saved: true
        }
    });
    hashtags = hashtags.map((hashtag) => {
        hashtags.posts = hashtag.posts.length;
    });
    res.status(200).json({
        success: true,
        hashtags: hashtags
    });
});

const toggleSavedHashtag = asyncHandler(async (req, res, next) => {
    const name = req.params.name;
    if(!name) {
        res.status(400);
        throw new Error('Hashtag not found');
    }
    let hashtag = await Hashtag.findOne({name: name});
    if(!hashtag) {
        hashtag = await Hashtag.create({
            name: name,
            posts: [],
            likes: 0,
            followers: 0
        });
    }
    if(hashtag._id.toString() in req.user.savedHashtags) {
        // remove hashtag from user
        req.user.savedHashtags = req.user.savedHashtags.filter((id) => id != hashtag._id.toString());
        hashtag.followers -= 1;
    } else {
        req.user.savedHashtags.push(hashtag._id.toString());
        hashtag.followers += 1;
    }
    await req.user.save();
    await hashtag.save();
    res.status(200).json({
        success: true,
        message: 'Hashtag save change successfully'
    });
});

const getSavedPosts = asyncHandler(async (req, res, next) => {
    let posts = [];
    for(let i = 0; i < req.user.savedPosts.length; i++) {
        const post = await Post.findById(req.user.savedPosts[i]);
        posts.push(post);
    }
    posts = await addPostData(posts, req.user._id, req.user.savedPosts);
    res.status(200).json({
        success: true,
        posts: posts
    });
});


const registerUser = asyncHandler(async (req, res, next) => {
    const {f_name, l_name, email, password, gender, address, dob, location } = req.body;
    let dobObj = new Date(dob);
    if(dobObj == "Invalid Date") {
        res.status(400)
        throw new Error('Invalid date of birth');
    }
    if (!emailRegex.test(email)) {
        res.status(400)
        throw new Error('Invalid email');
    }
    if (!passwordRegex.test(password)) {
        res.status(400)
        throw new Error('Invalid password');
    }
    const userExists = await User.findOne({ "email" : { $regex : new RegExp(email, "i") } });
    if (userExists) {
        res.status(400)
        throw new Error('User with that email already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        f_name,
        l_name,
        email,
        password: hashedPassword,
        gender,
        address,
        dob: dobObj,
        admin: false,
        verified: false,
        location: {
            type: "Point",
            coordinates: [location.longitude, location.latitude]
        }
    });
    sendMail(email, 'Anonymous Email Verification', 
    'please verify your email by clicking on the link below\n' + `${process.env.CLIENT_URL}/?id=${user._id}#verify`);
    res.status(201).json({
        success: true,
        message: 'User created successfully'
    });
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    let user = await User.findOne({ "email" : { $regex : new RegExp(`^${email}$`, 'i') } });
    if (!user) {
        res.status(400)
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400)
        throw new Error('Invalid email or password');
    }
    if(!user.verified) {
        res.status(400)
        throw new Error('Please verify your email');
    }
    const token = generateToken(user._id);
    delete user._doc["password"]
    delete user._doc["createdAt"]
    delete user._doc["updatedAt"]
    delete user._doc["__v"]
    delete user._doc["_id"]
    delete user._doc["admin"]
    res.status(200).json({
        success: true,
        user: {
            ...user._doc,
            token: token
        }
    });
});

const toggleSavedPost = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const user = await User.findById(req.user._id);
    if(!postId) {
        res.status(400);
        throw new Error('Post not found');
    }
    const post = Post.findById(postId);
    if(!post) {
        res.status(400);
        throw new Error('Post not found');
    }
    let saved = false;
    for(let i = 0; i < user.savedPosts.length; i++) {
        if(user.savedPosts[i].toString() === postId) {
            saved = true;
            break;
        }
    }

    if(saved) {
        user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);
    } else {
        user.savedPosts.push(postId);
    }
    await user.save();
    res.status(200).json({
        success: true,
        saved: !saved
    });
});

const getGroups = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('groups');
    let groups = user.groups;
    if(!groups) {
        groups = [];
    }
    groups = groups.map((group) => {
        return {
            ...group._doc,
            saved: true
        }
    });
    groups = groups.map((group) => {
        if(req.user._id.toString() == group.owner) {
            group.owner = true;
        } else {
            group.owner = false;
        }
        return group;
    });
    res.status(200).json({
        success: true,
        groups: groups
    });
});

const toggleJoinedGroup = asyncHandler(async (req, res, next) => {
    const groupId = req.params.id;
    const user = await User.findById(req.user._id);
    if(!groupId) {
        res.status(400);
        throw new Error('Group not found');
    }
    const group = Group.findById(groupId);
    if(!group) {
        res.status(400);
        throw new Error('Group not found');
    }
    if(groupId in user.groups) {
        user.groups = user.groups.filter((id) => id != groupId);
        group.members -= 1;
    } else {
        user.groups.push(groupId);
        group.members += 1;
    }
    await user.save();
    await group.save();
    res.status(200).json({
        success: true,
        message: 'Group join change successfully'
    });
});

const banUser = asyncHandler(async (req, res, next) => {
    const {id, reason } = req.body;
    const user = await User.findById(id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    user.ban = true;
    user.banReason = reason;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User banned successfully'
    });
});


const getProfile = asyncHandler(async (req, res, next) => {
    let id = req.params.id;
    let self = false;
    if(!id || id == req.user._id) {
        id = req.user._id;
        self = true;
    }
    if(!id) {
        res.status(400);
        throw new Error('User not found');
    }
    let user;
    try {
        user = await User.findById(id).populate('savedPosts').populate('groups').populate('blocked').populate('approved');
    } catch (err) {
        res.status(400);
        throw new Error('User not found');
    }
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    if(!self && !req.user.admin) {
        if(!(req.user._id in user.approved)) {
            res.status(401);
            throw new Error('Unauthorized');
        }
        delete user._doc["savedPosts"];
        delete user._doc["groups"];
        delete user._doc["blocked"];
        delete user._doc["approved"];
    }
    delete user._doc["password"];
    delete user._doc["admin"];
    delete user._doc["__v"];
    delete user._doc["updatedAt"];
    res.status(200).json({
        success: true,
        editable: self,
        user: user,
    });
});

const verifyUserEmail = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user) {
        res.status(400);
        throw new Error('User not found');
    }
    user.verified = true;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User verified successfully'
    });
});


export {getProfile, registerUser, loginUser, verifyUserEmail, toggleSavedPost, getHashtags, toggleSavedHashtag, getSavedPosts, getGroups, toggleJoinedGroup, banUser};