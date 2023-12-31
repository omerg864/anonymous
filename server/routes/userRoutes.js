import express from 'express';
import {getProfile, registerUser, loginUser, verifyUserEmail, 
    toggleSavedPost, getHashtags, toggleSavedHashtag, getSavedPosts
    , getGroups, toggleJoinedGroup, banUser, getBannedUsers} from '../controllers/userController.js';
import {protectAdmin, protectUser, verifyUser} from '../middleware/authMiddleware.js';
import { get } from 'mongoose';

const router = express.Router();

router.route('/profile/:id').get(verifyUser, getProfile);
router.route('/profile').get(verifyUser, getProfile);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/hashtags').get(protectUser, getHashtags);
router.route('/save/hashtag/:name').put(protectUser, toggleSavedHashtag);

router.route('/posts').get(protectUser, getSavedPosts);
router.route('/save/post/:id').put(protectUser, toggleSavedPost);

router.route('/groups').get(protectUser, getGroups);
router.route('/join/group/:id').put(protectUser, toggleJoinedGroup);

router.route('/ban').put(protectAdmin, banUser);
router.route('/ban').get(protectAdmin, getBannedUsers);

router.route('/verify/:id').get(verifyUserEmail);


export default router;