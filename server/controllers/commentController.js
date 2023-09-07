import asyncHandler from 'express-async-handler';
import Comment from '../models/CommentModel.js';

const getComments = asyncHandler(async (req, res, next) => {
    const Comments = await Comment.find();
    res.status(200).json({
        success: true,
        Comments: Comments
    });
});


export {getComments};