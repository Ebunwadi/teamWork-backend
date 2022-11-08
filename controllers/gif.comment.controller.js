import { DateTime } from 'luxon';
import pool from '../database/connect.js';

const createGifComment = async (req, res) => {
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
    console.log(error);
    return res.status(500).send({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

export default createGifComment;
