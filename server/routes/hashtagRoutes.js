import express from 'express';
import {getHashtag} from '../controllers/hashtagController.js';
import {verifyUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:name').get(verifyUser, getHashtag);


export default router;