import { DateTime } from 'luxon';
import pool from '../database/connect.js';

export const createArticleComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { id } = req.params;
    const createdOn = DateTime.now().toJSDate();
    const userId = req.user.userid;

    const articles = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
    if (articles.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        error: 'article with the specified ID NOT found',
      });
    }
    await pool.query(`INSERT INTO article_comment (comments, created_at, article_id, user_id) 
        VALUES ($1, $2, $3, $4) RETURNING *`, [comment, createdOn, id, userId]);

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'comment successfully created',
        createdOn,
        articleTitle: articles.rows[0].title,
        comment,
        userId,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

// flag a comment
export const flagArticleComment = async (req, res) => {
  const { id } = req.params;
  const { isFlagged } = req.body;
  const articleComment = await pool.query('SELECT * FROM article_comment WHERE id = $1', [id]);
  if (articleComment.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'comment with the specified article id NOT found',
    });
  }

  if (isFlagged) {
    await pool.query('UPDATE article_comment set is_flagged = $1 WHERE id = $2', [isFlagged, id]);
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'comment successfully flagged',
      },
    });
  }
};

// admin can delete a comment flagged as inappropriate
export const deleteFlaggedArticleComment = async (req, res) => {
  const { id } = req.params;
  const articleComment = await pool.query('SELECT * FROM article_comment WHERE id = $1', [id]);
  if (articleComment.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'there is no comment on this article',
    });
  }

  await pool.query('DELETE FROM article_comment WHERE id = $1', [id]);
  return res.status(202).json({
    status: 'success',
    data: {
      message: 'comment successfully deleted',
    },
  });
};
