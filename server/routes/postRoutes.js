import express from 'express';
import { createPost, getUserPosts, deletePost, toggleLikePost } from '../controllers/postController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id').get(protectUser, getUserPosts);
router.route('/').get(protectUser, getUserPosts);

router.route('/:id/delete').delete(protectUser, deletePost);

router.route('/like/:id').put(protectUser, toggleLikePost);

router.route('/new').post(protectUser, createPost);


export default router;