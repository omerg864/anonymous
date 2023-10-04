import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const verifyUser = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            if (token === 'NoToken') {
                req.user = null;
                next();
            } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
            }
        } catch(error){
            console.log(error);
            req.user = null;
            next();
        }
    }
    if (!token) {
        req.user = null;
        next();
    }
});

const protectUser = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            if (token === 'NoToken') {
                res.status(401);
                throw new Error('Not Authorized');
            } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
            }
        } catch(error){
            console.log(error);
            res.status(401);
            throw new Error('Not Authorized');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not Authorized');
    }
})

const protectAdmin = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            if (token === 'NoToken') {
                res.status(401);
                throw new Error('Not Authorized');
            } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if(!req.user.admin) {
                res.status(401);
                throw new Error('Not Authorized');
            } else {
                next();
            }
            }
        } catch(error){
            console.log(error);
            res.status(401);
            throw new Error('Not Authorized');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not Authorized');
    }
})

export {verifyUser, protectUser, protectAdmin};