import express from 'express';
import { getChats, searchChat } from '../controllers/chatController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id').get(verifyUser, searchChat);

router.route('/').get(verifyUser, getChats);


export default router;