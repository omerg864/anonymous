import express from 'express';
import {getProfile, registerUser, loginUser, verifyUserEmail, toggleSavedPost} from '../controllers/userController.js';
import {protectUser, verifyUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile/:id').get(verifyUser, getProfile);
router.route('/profile').get(verifyUser, getProfile);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/save/:id').get(protectUser, toggleSavedPost);

router.route('/verify/:id').get(verifyUserEmail);


export default router;