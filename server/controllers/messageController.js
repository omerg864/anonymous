import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';


// TODO: test with blocked users data
const newMessage = asyncHandler(async (req, res, next) => {
    if(!req.user){
        res.status(401);
        throw new Error('Not authorized');
    }
    const {text, chatId} = req.body;
    const sender = req.user._id;
    if(!text || !chatId){
        res.status(400);
        throw new Error('text and chatID are required');
    }
    const chat = await Chat.findById(chatId).populate('users').populate('users.blocked');
    if(!chat){
        res.status(404);
        throw new Error('Chat not found');
    }
    if(chat.users.length === 2){
        for(let i = 0; i < chat.users.length; i++){
            if(chat.users[i].blocked.includes(sender)){
                res.status(401);
                throw new Error('You are blocked by this user');
            }
        }
    }
    const newMessage = await Message.create({
        sender,
        text,
        chatId: chat._id
    });
    res.status(200).json({
        success: true,
        message: newMessage
    });
});


export {newMessage};