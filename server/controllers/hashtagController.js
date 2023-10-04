import asyncHandler from 'express-async-handler';
import Hashtag from '../models/hashtagModel.js';

const getHashtags = asyncHandler(async (req, res, next) => {
    const Hashtags = await Hashtag.find();
    res.status(200).json({
        success: true,
        Hashtags: Hashtags
    });
});


export {getHashtags};