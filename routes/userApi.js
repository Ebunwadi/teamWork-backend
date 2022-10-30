import Router from 'express';
import { createUser, loginUser } from '../controllers/userApiLogic.js';
import validateSignUp from '../middleware/validations/validate-signup.js';
import validateLogin from '../middleware/validations/validate-login.js';
import adminAuth from '../middleware/admin-auth.js';

const router = Router();

router.route('/create-user').post(adminAuth, validateSignUp, createUser);
router.route('/login-user').post(validateLogin, loginUser);

export default router;
