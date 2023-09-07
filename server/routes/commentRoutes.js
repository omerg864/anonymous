import express from 'express';
import {getComments} from '../controllers/commentController.js';

const router = express.Router();

router.route('/', getComments);


export default router;