import Router from 'express';
import {
  createCategory,
  viewAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllArticlesInCategory,
} from '../controllers/categoryController.js';
import jwtAuth from '../middleware/jwtAuth.js';
import adminAuth from '../middleware/admin-auth.js';
import validateCategory from '../middleware/validations/validate-category.js';

const router = Router();

router.post('/create-category', jwtAuth, adminAuth, validateCategory, createCategory);
router.put('/update-category/:id', jwtAuth, adminAuth, validateCategory, updateCategory);
router.delete('/delete-category/:id', jwtAuth, adminAuth, deleteCategory);
router.get('/get-category/:id', jwtAuth, getCategory);
router.get('/get-all-categories', jwtAuth, viewAllCategories);
router.get('/get-all-articles-in-category/:id', jwtAuth, getAllArticlesInCategory);

export default router;
