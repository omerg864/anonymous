import express from 'express';
const router = express.Router();


router.route('/', getComment);


export default router;