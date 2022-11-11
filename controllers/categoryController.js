import pool from '../database/connect.js';

// admin can create a category
export const createCategory = async (req, res) => {
  const { categoryName } = req.body;
  const category = await pool.query('SELECT * FROM category WHERE category_name=$1', [categoryName]);
  if (category.rows.length > 0) {
    return res.status(400).json({
      status: 'error',
      data: {
        message: 'Category already exists',
      },
    });
  }

  await pool.query('INSERT INTO category (category_name) VALUES ($1)', [categoryName]);
  return res.status(201).json({
    status: 'success',
    data: {
      message: 'Category Successfully created',
    },
  });
};

// employees can view all categories
export const viewAllCategories = async (req, res) => {
  const categories = await pool.query('SELECT * FROM category');
  res.status(200).json({
    status: 'success',
    data: categories.rows,
  });
};

// employees can get a single category
export const getCategory = async (req, res) => {
  const categoryId = req.params.id;
  const category = await pool.query('SELECT * FROM category WHERE id = $1', [categoryId]);
  if (category.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'Category with the specified categoryId NOT found',
    });
  }
  return res.status(200).json({
    status: 'success',
    data: category.rows[0],
  });
};

// admin can delete a category
export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const category = await pool.query('SELECT * FROM category WHERE id = $1', [categoryId]);
  if (category.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'Category with the specified categoryId NOT found',
    });
  }
  await pool.query('DELETE FROM category WHERE id = $1', [categoryId]);
  return res.status(202).json({
    status: 'success',
    message: 'Category succesfully deleted',
  });
};

// admin can update a category
export const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { categoryName } = req.body;
  const category = await pool.query('SELECT * FROM category WHERE id = $1', [categoryId]);
  if (category.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'Category with the specified categoryId NOT found',
    });
  }
  await pool.query('UPDATE category SET category_name = $1 WHERE id = $2', [categoryName, categoryId]);
  return res.status(201).json({
    status: 'success',
    message: 'Category succesfully updated',
  });
};
