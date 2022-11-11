import { DateTime } from 'luxon';
import pool from '../database/connect.js';

// create article
export const createArticle = async (req, res) => {
  const userId = req.user.userid;
  const { title, article, categoryId } = req.body;
  const createdOn = DateTime.now().toJSDate();

  const category = await pool.query(`SELECT * FROM category WHERE id = ${categoryId}`);
  if (category.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'Category with the specified categoryId NOT found',
    });
  }
  const articles = await pool.query(`INSERT INTO articles (title, article, created_at, category_id, user_id) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`, [title, article, createdOn, categoryId, userId]);
  return res.status(201).json({
    status: 'sucess',
    data: {
      message: 'Article successfully posted',
      articleId: articles.rows[0].id,
      createdOn,
      title,
      userId,
    },
  });
};

// get all articles
export const getAllArticles = async (req, res) => {
  const articles = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
  return res.status(200).json({
    status: 'Success',
    data: articles.rows,
  });
};

// get a single article
export const getArticle = async (req, res) => {
  const { id } = req.params;
  const article = await pool.query(`SELECT * FROM articles WHERE id = ${id}`);
  if (article.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'Article with the specified articleId NOT found',
    });
  }
  return res.status(200).json({
    status: 'success',
    data: article.rows[0],
  });
};

// delete an article
export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  const articles = await pool.query(`SELECT * FROM articles WHERE id = ${id}`);
  if (articles.rowCount === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'article not found',
    });
  }
  if (articles.rows[0].user_id !== req.user.userid) {
    return res.status(403).json({
      status: 'error',
      message: 'You cannot delete this article',
    });
  }

  await pool.query(`DELETE FROM articles WHERE id = ${id}`);
  return res.status(202).json({
    status: 'success',
    data: {
      message: 'Article succesfully deleted',
    },
  });
};

// edit an article
export const updateArticle = async (req, res) => {
  const { id } = req.params;

  const articles = await pool.query(`SELECT * FROM articles WHERE id = ${id}`);
  if (articles.rowCount === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'article doesnt exist',
    });
  }
  if (articles.rows[0].user_id !== req.user.userid) {
    return res.status(403).json({
      status: 'error',
      message: 'You cannot edit this article',
    });
  }
  const { title, article } = req.body;
  await pool.query(`UPDATE articles SET title = $1, article = $2 WHERE id = ${id}`, [title, article]);
  return res.status(201).json({
    status: 'success',
    data: {
      message: 'Article successfully updated',
      title,
      article,
    },
  });
};

// get all articles in a category
export const getAllArticlesInCategory = async (req, res) => {
  const { id } = req.params;
  const article = await pool.query(`SELECT * FROM articles WHERE category_id = ${id}`);
  if (article.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'No articles in the specified Category',
    });
  }
  return res.status(200).json({
    status: 'success',
    data: article.rows,
  });
};

// flag an article
export const flagArticle = async (req, res) => {
  const { id } = req.params;
  const { isFlagged } = req.body;
  const articles = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
  if (articles.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'article with the specified id NOT found',
    });
  }

  if (isFlagged) {
    await pool.query('UPDATE articles set is_flagged = $1 WHERE id = $2', [isFlagged, id]);
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'article successfully flagged',
      },
    });
  }
};

// admin can delete an article flagged as inappropriate
export const deleteFlaggedArticle = async (req, res) => {
  const { id } = req.params;
  const articles = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
  if (articles.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'there is no article with this id',
    });
  }
  await pool.query('DELETE FROM articles WHERE id = $1', [id]);
  return res.status(202).json({
    status: 'success',
    data: {
      message: 'flagged article successfully deleted',
    },
  });
};
