import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';

const getPostComments = asyncHandler(async (req, res, next) => {
    const Comments = await Comment.find();
    res.status(200).json({
        success: true,
        Comments: Comments
    });
});


export {getPostComments};