import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

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
})

export {verifyUser};