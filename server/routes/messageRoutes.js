import express from 'express';
import {getMessages, newMessage} from '../controllers/messageController.js';
import {verifyUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/new').post(verifyUser, newMessage);

router.route('/').get(getMessages);


export default router;