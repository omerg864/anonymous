import express from 'express';
import {getReports} from '../controllers/reportController.js';

const router = express.Router();

router.route('/', getReports);


export default router;