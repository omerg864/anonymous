import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/UserModel.js';
import Chat from '../models/chatModel.js';


//TODO: add approved data to check approved
const getChats = asyncHandler(async (req, res, next) => {
    if(!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }
    let chats = await Chat.find({ users: { $in: [req.user._id] } }).populate('users', ['_id', 'f_name', 'l_name', 'profile_pic', 'approved']);
    chats = await Promise.all(chats.map(async chat => {
        const lastMessage = await Message.find({ chatId: chat._id }).limit(1).sort({createdAt: -1});
        chat = chat.toObject();
        for(let i = 0; i < chat.users.length; i++) {
            if(chat.users[i]._id.toString() === req.user._id.toString()) {
                chat.users.splice(i, 1);
                break;
            }
        }
        for(let i = 0; i < chat.users.length; i++) {
            console.log(chat.users[i].f_name);
            if(req.user._id in chat.users[i].approved) {
                chat.users[i].approved = true;
            } else {
                delete chat.users[i].f_name;
                delete chat.users[i].l_name;
                delete chat.users[i].profile_pic;
                chat.users[i].approved = false;
            }
        }
        chat.lastMessage = lastMessage;
        return chat;
    }));
    res.status(200).json({
        success: true,
        userId: req.user._id,
        chats
    });
});

export {getChats};