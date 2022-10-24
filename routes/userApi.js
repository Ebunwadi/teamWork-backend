import Router from 'express';
import { createUser, loginUser } from '../controllers/userApiLogic.js';

const router = Router();

router.route('/create-user').post(createUser);
router.route('/login-user').post(loginUser);

export default router;
