import express from 'express';
import {createGroup} from '../controllers/groupController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protectUser, createGroup);


export default router;