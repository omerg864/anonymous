import express from 'express';
import {getPostComments} from '../controllers/commentController.js';

const router = express.Router();

router.route('/', getPostComments);


export default router;