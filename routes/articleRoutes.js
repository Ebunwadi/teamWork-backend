import Router from 'express';
import {
  createArticle,
  updateArticle,
  deleteArticle,
  deleteFlaggedArticle,
  flagArticle,
  getAllArticles,
  getArticle,
} from '../controllers/articleController.js';
import { createArticleComment, flagArticleComment, deleteFlaggedArticleComment } from '../controllers/article.comment.controller.js';
import jwtAuth from '../middleware/jwtAuth.js';
import adminAuth from '../middleware/admin-auth.js';
import { validateArticle, validateEditArticle, validateArticleComment } from '../middleware/validations/validate-article.js';

const router = Router();

router.post('/create-articles', jwtAuth, validateArticle, createArticle);
router.put('/edit-flag-articles/:id', jwtAuth, flagArticle);
router.put('/edit-articles/:id', jwtAuth, validateEditArticle, updateArticle);
router.delete('/delete-article/:id', jwtAuth, deleteArticle);
router.delete('/delete-flagged-article/:id', jwtAuth, adminAuth, deleteFlaggedArticle);
router.get('/get-article/:id', jwtAuth, getArticle);
router.get('/get-all-articles', jwtAuth, getAllArticles);
router.post('/article-comment/:id', jwtAuth, validateArticleComment, createArticleComment);
router.put('/flag-article-comment/:id', jwtAuth, flagArticleComment);
router.delete('/delete-flag-article-comment/:id', jwtAuth, adminAuth, deleteFlaggedArticleComment);

export default router;
