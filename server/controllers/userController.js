import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { emailRegex, passwordRegex } from '../utils/regex.js';
import { sendMail } from '../utils/globalFunctions.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

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


const getProfile = asyncHandler(async (req, res, next) => {
    let id = req.params.id;
    let self = false;
    if(!id || id == req.user._id) {
        id = req.user._id;
        self = true;
    }
    let user;
    try {
        user = await User.findById(id).populate('savedPosts').populate('groups').populate('blocked').populate('approved');
    } catch (err) {
        res.status(400);
        throw new Error('User not found');
    }
    if (!user) {
        console.log("User not found");
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


export {getProfile, registerUser, loginUser, verifyUserEmail};