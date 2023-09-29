import express from 'express';
import {getProfile, registerUser, loginUser, verifyUserEmail} from '../controllers/userController.js';
import {verifyUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile/:id').get(verifyUser, getProfile);
router.route('/profile').get(verifyUser, getProfile);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/verify/:id').get(verifyUserEmail);


export default router;