import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/UserModel.js';
import Chat from '../models/chatModel.js';
import { ObjectId } from 'mongoose';

const getMessages = asyncHandler(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages: messages
    });
});


const newMessage = asyncHandler(async (req, res, next) => {
    if(!req.user){
        res.status(401);
        throw new Error('Not authorized');
    }
    const {receiver, text, chatId} = req.body;
    const sender = req.user._id;
    if(!receiver || !text || !chatId){
        res.status(400);
        throw new Error('Receiver, text and chatID are required');
    }
    const receiverUser = await User.findById(receiver);
    if(!receiverUser){
        res.status(404);
        throw new Error('Receiver not found');
    }
    const user = await User.findById(sender).populate('blocked');
    if(user.blocked.includes(receiver)){
        res.status(401);
        throw new Error('You are blocked by this user');
    }
    const chat = await Chat.findById(chatId);
    const newMessage = await Message.create({
        sender,
        receiver,
        text,
        chatId: chat._id
    });
    res.status(200).json({
        success: true,
        message: newMessage
    });
});


export {getMessages, newMessage};