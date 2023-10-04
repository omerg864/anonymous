import express from 'express';
import {newMessage} from '../controllers/messageController.js';
import {protectUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/new').post(protectUser, newMessage);



export default router;