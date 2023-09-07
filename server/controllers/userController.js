import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

const getUsers = asyncHandler(async (req, res, next) => {
    const Users = await User.find();
    res.status(200).json({
        success: true,
        Users: Users
    });
});


export {getUsers};