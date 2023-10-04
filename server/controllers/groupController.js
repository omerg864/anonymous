import asyncHandler from 'express-async-handler';
import Group from '../models/groupModel.js';

const createGroup = asyncHandler(async (req, res, next) => {
    const {title, description} = req.body;
    if(!title) {
        res.status(400);
        throw new Error('Invalid name');
    }
    let group = await Group.create({
        title,
        description,
        members: 1,
        owner: req.user._id
    });
    req.user.groups.push(group._id);
    await req.user.save();
    res.status(200).json({
        success: true,
        group
    });
});


export {createGroup};