import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';

const newMessage = asyncHandler(async (req, res, next) => {
    if(!req.user){
        res.status(401);
        throw new Error('Not authorized');
    }
    const {receiver, text, chatId, group} = req.body;
    const sender = req.user._id;
    if(!text || !chatId){
        res.status(400);
        throw new Error('text and chatID are required');
    }
    const chat = await Chat.findById(chatId);
    let newMessage;
    if (!group) {
        if(!receiver){
            res.status(400);
            throw new Error('receiver is required');
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
        newMessage = await Message.create({
            sender,
            receiver,
            text,
            chatId: chat._id
        });
    } else {
        newMessage = await Message.create({
            sender,
            text,
            chatId: chat._id
        });
    }
    res.status(200).json({
        success: true,
        message: newMessage
    });
});


export {newMessage};