import Router from 'express';
import {
  createGif,
  deleteGif,
  getAllGifs,
  getSingleGif,
} from '../controllers/gifController.js';
import jwtAuth from '../middleware/jwtAuth.js';

const router = Router();

router.post('/create-gifs', jwtAuth, createGif);
router.delete('/delete-gifs/:gifId', jwtAuth, deleteGif);
router.get('/get-single-gif/:gifId', jwtAuth, getSingleGif);
router.get('/get-gifs', jwtAuth, getAllGifs);

export default router;
