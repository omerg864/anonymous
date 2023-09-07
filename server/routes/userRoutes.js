import express from 'express';
const router = express.Router();


router.route('/', getUser);


export default router;