import express from 'express';
import {getReports, createReport} from '../controllers/reportController.js';
import { protectAdmin, protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protectAdmin, getReports);
router.route('/').post(protectUser, createReport);


export default router;