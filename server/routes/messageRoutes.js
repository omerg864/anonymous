import express from 'express';
import {newMessage} from '../controllers/messageController.js';
import {verifyUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/new').post(verifyUser, newMessage);



export default router;