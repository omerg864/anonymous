import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';

const getMessages = asyncHandler(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages: messages
    });
});


export {getMessages};