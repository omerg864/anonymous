import express from 'express';
import {getProfile, registerUser, loginUser, verifyUserEmail, toggleSavedPost, getHashtags, toggleSavedHashtag} from '../controllers/userController.js';
import {protectUser, verifyUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile/:id').get(verifyUser, getProfile);
router.route('/profile').get(verifyUser, getProfile);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/hashtags').put(protectUser, getHashtags);
router.route('/save/hashtag/:name').get(protectUser, toggleSavedHashtag);

router.route('/save/post/:id').put(protectUser, toggleSavedPost);

router.route('/verify/:id').get(verifyUserEmail);


export default router;