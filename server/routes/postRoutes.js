import express from 'express';
import { createPost } from '../controllers/postController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/new').post(verifyUser, createPost);


export default router;