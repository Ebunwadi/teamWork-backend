import { DateTime } from 'luxon';
import pool from '../database/connect.js';

export const createGifComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { gifId } = req.params;
    const createdOn = DateTime.now().toJSDate();
    const userId = req.user.userid;

    const gif = await pool.query('SELECT * FROM gifs WHERE id = $1', [gifId]);
    if (gif.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        error: 'Gif with the specified ID NOT found',
      });
    }
    await pool.query(`INSERT INTO gif_comment (comments, created_at, gif_id, user_id) 
        VALUES ($1, $2, $3, $4)`, [comment, createdOn, gifId, userId]);

    return res.status(201).json({
      status: 'success',
      data: {
        message: 'comment successfully created',
        createdOn,
        gifTitle: gif.rows[0].title,
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
export const flagGifComment = async (req, res) => {
  const { gifId } = req.params;
  const { isFlagged } = req.body;
  const gifComment = await pool.query('SELECT * FROM gif_comment WHERE gif_id = $1', [gifId]);
  if (gifComment.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'comment with the specified gifId NOT found',
    });
  }

  if (isFlagged) {
    await pool.query('UPDATE gif_comment set is_flagged = $1 WHERE gif_id = $2', [isFlagged, gifId]);
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'comment successfully flagged',
      },
    });
  }
};

// admin can delete a comment flagged as inappropriate
export const deleteFlaggedGifComment = async (req, res) => {
  const { gifId } = req.params;
  const gifComment = await pool.query('SELECT * FROM gif_comment WHERE gif_id = $1', [gifId]);
  if (gifComment.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'there is no comment on this gif',
    });
  }

  await pool.query('DELETE FROM gif_comment WHERE gif_id = $1', [gifId]);
  return res.status(202).json({
    status: 'success',
    data: {
      message: 'comment successfully deleted',
    },
  });
};
