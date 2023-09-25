import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';
import Post from '../models/PostModel.js';
import Comment from '../models/CommentModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { emailRegex, passwordRegex } from '../utils/regex.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

const registerUser = asyncHandler(async (req, res, next) => {
    const {f_name, l_name, email, password, gender, address, dob } = req.body;
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
    });
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


const getProfile = asyncHandler(async (req, res, next) => {
    let id = req.params.id;
    let self = false;
    if(!id || id == req.user._id) {
        id = req.user._id;
        self = true;
    }
    let user = await User.findById(id).populate('savedPosts').populate('groups').populate('blocked').populate('approved');
    if (!user) {
        res.status(400)
        throw new Error('User not found');
    }
    let posts = [];
    if(!self) {
        if(!(req.user._id in user.approved)) {
            res.status(400)
            throw new Error('Unauthorized');
        }
        delete user._doc["savedPosts"];
        delete user._doc["groups"];
        delete user._doc["blocked"];
        delete user._doc["approved"];
    } else {
        posts = await Post.find({user: req.user._id}).populate('user', ['-password', '-__v', '-admin', '-updatedAt']).sort({createdAt: -1});
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
    delete user._doc["password"];
    delete user._doc["admin"];
    delete user._doc["__v"];
    delete user._doc["updatedAt"];
    res.status(200).json({
        success: true,
        editable: self,
        user: user,
        posts
    });
});


export {getProfile, registerUser, loginUser};