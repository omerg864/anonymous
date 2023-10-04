import express from 'express';
import { getChats, searchChat } from '../controllers/chatController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id').get(protectUser, searchChat);

router.route('/').get(protectUser, getChats);


export default router;