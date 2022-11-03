import Router from 'express';
import { createUser, loginUser } from '../controllers/userApiLogic.js';
import validateSignUp from '../middleware/validations/validate-signup.js';
import validateLogin from '../middleware/validations/validate-login.js';
import adminAuth from '../middleware/admin-auth.js';
import verify from '../middleware/verify.js';

const router = Router();

router.post('/create-user', verify, adminAuth, validateSignUp, createUser);
router.post('/login-user', validateLogin, loginUser);

export default router;
