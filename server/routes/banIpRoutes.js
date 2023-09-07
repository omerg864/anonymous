import express from 'express';
import {getBanIps} from '../controllers/banIpController.js';

const router = express.Router();

router.route('/').get(getBanIps);


export default router;