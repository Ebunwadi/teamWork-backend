import Router from 'express';
import {
  createGif,
  deleteGif,
  deleteFlaggedGif,
  flagGif,
  getAllGifs,
  getSingleGif,
} from '../controllers/gifController.js';
import jwtAuth from '../middleware/jwtAuth.js';
import adminAuth from '../middleware/admin-auth.js';
import { createGifComment, flagGifComment, deleteFlaggedGifComment } from '../controllers/gif.comment.controller.js';
import validateGifComment from '../middleware/validations/validate-gifComment.js';

const router = Router();

router.post('/create-gifs', jwtAuth, createGif);
router.put('/update-gifs/:gifId', jwtAuth, flagGif);
router.delete('/delete-gifs/:gifId', jwtAuth, deleteGif);
router.delete('/delete-flagged-gifs/:gifId', jwtAuth, adminAuth, deleteFlaggedGif);
router.get('/get-single-gif/:gifId', jwtAuth, getSingleGif);
router.get('/get-gifs', jwtAuth, getAllGifs);
router.post('/gif-comment/:gifId', jwtAuth, validateGifComment, createGifComment);
router.put('/flag-gif-comment/:gifId', jwtAuth, flagGifComment);
router.delete('/delete-flag-gif-comment/:gifId', jwtAuth, adminAuth, deleteFlaggedGifComment);

export default router;
