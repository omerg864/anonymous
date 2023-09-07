import express from 'express';
import {getGroups} from '../controllers/groupController.js';

const router = express.Router();

router.route('/', getGroups);


export default router;