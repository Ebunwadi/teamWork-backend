import Router from 'express';
import createGif from '../controllers/gifApiLogic.js';
import jwtAuth from '../middleware/jwtAuth.js';

const router = Router();

router.post('/create-gifs', jwtAuth, createGif);

export default router;
