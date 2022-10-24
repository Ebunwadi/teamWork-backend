import Router from 'express';
import createUser from '../controllers/userApiLogic.js';

const router = Router();

router.route('/create-user').post(createUser);

export default router;
