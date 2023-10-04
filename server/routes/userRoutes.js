import express from 'express';
import {getProfile, registerUser, loginUser, verifyUserEmail, toggleSavedPost, getHashtags, toggleSavedHashtag, getSavedPosts} from '../controllers/userController.js';
import {protectUser, verifyUser} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile/:id').get(verifyUser, getProfile);
router.route('/profile').get(verifyUser, getProfile);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/hashtags').get(protectUser, getHashtags);
router.route('/save/hashtag/:name').put(protectUser, toggleSavedHashtag);

router.route('/posts').get(protectUser, getSavedPosts);
router.route('/save/post/:id').put(protectUser, toggleSavedPost);

router.route('/verify/:id').get(verifyUserEmail);


export default router;