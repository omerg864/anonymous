import express from 'express';
import { createPost, getUserPosts } from '../controllers/postController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id').get(verifyUser, getUserPosts);
router.route('/').get(verifyUser, getUserPosts);

router.route('/new').post(verifyUser, createPost);


export default router;