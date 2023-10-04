import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import { CHAT_LIMIT } from '../utils/consts.js';


//TODO: add approved data to check approved
const getChats = asyncHandler(async (req, res, next) => {
    let page = parseInt(req.query.page);
    if(!page) {
        page = 0;
    }
    const search = req.query.search;
    let chats;
    if(search) {
        chats = await Chat.find({ users: { $in: [req.user._id] } , name: { $regex: search, $options: 'i' } }).limit(CHAT_LIMIT).skip(CHAT_LIMIT * page).populate('users', ['_id', 'f_name', 'l_name', 'profile_pic', 'approved']);
    } else {
        chats = await Chat.find({ users: { $in: [req.user._id] } }).limit(CHAT_LIMIT).skip(CHAT_LIMIT * page).populate('users', ['_id', 'f_name', 'l_name', 'profile_pic', 'approved']);
    }
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
            if(req.user._id in chat.users[i].approved) {
                chat.users[i].approved = true;
            } else {
                delete chat.users[i].f_name;
                delete chat.users[i].l_name;
                delete chat.users[i].profile_pic;
                chat.users[i].approved = false;
            }
        }
        if(lastMessage.length > 0) {
            chat.lastMessage = lastMessage[0];
        }
        return chat;
    }));
    chats = chats.filter(chat => {
        return chat.lastMessage;
    });
    res.status(200).json({
        success: true,
        userId: req.user._id,
        chats
    });
});

// for private chat
const searchChat = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const otherUser = await User.findById(id);
    if(!otherUser){
        res.status(404);
        throw new Error('User not found');
    }
    let chat;
    let chats = await Chat.find({users: {$in: [req.user._id]}});
        chats = chats.filter(chatTemp => {
            return chatTemp.users.length === 2;
        });
        chats = chats.filter(chatTemp => {
            for(let i = 0; i < chatTemp.users.length; i++) {
                if(id === chatTemp.users[i].toString()){
                    return true;
                }
            }
            return false;
        })
        if(!chats.length){
            chat = await Chat.create({
                users:[req.user._id, otherUser._id]
            });
        } else {
            chat = chats[0];
        }
    res.status(200).json({
        success: true,
        chatId: chat._id
    });
});

export {getChats, searchChat};