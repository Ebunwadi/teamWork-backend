import Router from 'express';
import {
  createGif,
  deleteGif,
  getAllGifs,
  getSingleGif,
} from '../controllers/gifController.js';
import jwtAuth from '../middleware/jwtAuth.js';
import createGifComment from '../controllers/gif.comment.controller.js';
import validateGifComment from '../middleware/validations/validate-gifComment.js';

const router = Router();

router.post('/create-gifs', jwtAuth, createGif);
router.delete('/delete-gifs/:gifId', jwtAuth, deleteGif);
router.get('/get-single-gif/:gifId', jwtAuth, getSingleGif);
router.get('/get-gifs', jwtAuth, getAllGifs);
router.post('/gif-comment/:gifId/comment', jwtAuth, validateGifComment, createGifComment);

export default router;
