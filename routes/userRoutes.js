import Router from 'express';
import {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  passwordReset,
} from '../controllers/userController.js';
import validateSignUp from '../middleware/validations/validate-signup.js';
import validateLogin from '../middleware/validations/validate-login.js';
import adminAuth from '../middleware/admin-auth.js';
import jwtAuth from '../middleware/jwtAuth.js';

const router = Router();

router.post('/create-user', jwtAuth, adminAuth, validateSignUp, createUser);
router.post('/login-user', validateLogin, loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:id/:token', jwtAuth, resetPassword);
router.post('/reset-password', passwordReset);

export default router;
