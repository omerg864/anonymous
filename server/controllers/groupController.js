import asyncHandler from 'express-async-handler';
import Group from '../models/GroupModel.js';

const getGroups = asyncHandler(async (req, res, next) => {
    const Groups = await Group.find();
    res.status(200).json({
        success: true,
        Groups: Groups
    });
});


export {getGroups};