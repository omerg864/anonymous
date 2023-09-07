import express from 'express';
const router = express.Router();


router.route('/', getBanIp);


export default router;