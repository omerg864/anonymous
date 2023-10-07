import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import { wss } from '../server.js';


// TODO: test with blocked users data
const newMessage = asyncHandler(async (req, res, next) => {
    const {text, chatId} = req.body;
    const sender = req.user._id;
    if(!text || !chatId){
        res.status(400);
        throw new Error('text and chatID are required');
    }
    const chat = await Chat.findById(chatId).populate('users');
    if(!chat){
        res.status(404);
        throw new Error('Chat not found');
    }
    if(chat.users.length === 2){
        for(let i = 0; i < chat.users.length; i++){
            if(chat.users[i].blocked.includes(sender)){
                res.status(401);
                throw new Error('You are blocked by user');
            }
        }
    }
    let found = false;
    for(let i = 0; i < chat.users.length; i++){
        if(chat.users[i]._id.equals(sender)){
            found = true;
            break;
        }
    }
    if(!found){
        res.status(401);
        throw new Error('Not authorized');
    }
    const newMessage = await Message.create({
        sender,
        text,
        chatId: chat._id
    });
    await WSsendNewMessage(newMessage, chat);
    res.status(200).json({
        success: true,
        message: newMessage
    });
});

const WSsendNewMessage = async (message, chat) => {
    wss.clients.forEach(function each(client) {
        for(let i = 0; i < chat.users.length; i++){
            if(chat.users[i]._id.equals(client.id)){
                client.send(JSON.stringify({
                    type: 'newMessage',
                    message: message,
                    chat: chat
                }));
            }
        }
    });
};


export {newMessage};