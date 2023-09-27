import express from 'express';
import { getChats } from '../controllers/chatController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(verifyUser, getChats);


export default router;