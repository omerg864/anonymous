import express from 'express';
import {getUsers, registerUser, loginUser} from '../controllers/userController.js';

const router = express.Router();

router.route('/', getUsers);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);


export default router;