import express from 'express';
import { getPosts } from '../controllers/postController.js';

const router = express.Router();

router.route('/', getPosts);


export default router;