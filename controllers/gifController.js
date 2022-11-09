import * as dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import pool from '../database/connect.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// create gif
export const createGif = async (req, res) => {
  const { title } = req.body;
  const { image } = req.files;

  try {
    if (!image) return res.status(404).json({ message: 'you need to upload a gif' });
    if (!title) return res.status(400).json({ message: 'gif caption is required' });
    const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
      folder: 'gifs',
    });
    const { secure_url: secureUrl, public_id: publicId, created_at: createdOn } = result;
    const userId = req.user.userid;
    const gifDB = await pool.query(
      `INSERT INTO gifs (title, image_url, created_on, public_id, user_id) 
          VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, secureUrl, createdOn, publicId, userId],
    );

    return res.status(201).json({
      status: 'sucess',
      data: {
        gifId: gifDB.rows[0].id,
        message: 'GIF image successfully posted.',
        createdOn,
        title,
        imageUrl: secureUrl,
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

// delete gif
export const deleteGif = async (req, res) => {
  try {
    const { gifId } = req.params;
    const gifDB = await pool.query('SELECT * FROM gifs WHERE id = $1', [gifId]);
    if (gifDB.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        error: 'there is no gif with this id',
      });
    }

    if (gifDB.rows[0].user_id !== req.user.userid) {
      return res.status(403).json({
        status: 'error',
        message: 'You cannot delete a Gif you didnt post',
      });
    }

    await cloudinary.v2.uploader.destroy(gifDB.rows[0].public_id);

    await pool.query('DELETE FROM gifs WHERE id = $1', [gifId]);
    return res.status(202).json({
      status: 'success',
      data: {
        message: 'Gif successfully deleted',
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

// get all gifs
export const getAllGifs = async (req, res) => {
  const gifs = await pool.query('SELECT * FROM gifs ORDER BY created_on DESC');
  res.status(200).json({
    status: 'success',
    data: gifs.rows,
  });
};

// get one gif
export const getSingleGif = async (req, res) => {
  const { gifId } = req.params;
  const gif = await pool.query('SELECT * FROM gifs WHERE id = $1', [gifId]);
  if (gif.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'Gif with the specified gifId NOT found',
    });
  }
  return res.status(200).json({
    status: 'success',
    data: gif.rows[0],
  });
};

// flag a gif
export const flagGif = async (req, res) => {
  const { gifId } = req.params;
  const { isFlagged } = req.body;
  const gif = await pool.query('SELECT * FROM gifs WHERE id = $1', [gifId]);
  if (gif.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'Gif with the specified gifId NOT found',
    });
  }

  if (isFlagged) {
    await pool.query('UPDATE gifs set is_flagged = $1 WHERE id = $2', [isFlagged, gifId]);
    return res.status(200).json({
      status: 'success',
      data: {
        message: 'Gif successfully flagged',
      },
    });
  }
};

// admin can delete a gif flagged as inappropriate
export const deleteFlaggedGif = async (req, res) => {
  const { gifId } = req.params;
  const gif = await pool.query('SELECT * FROM gifs WHERE id = $1', [gifId]);
  if (gif.rows.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'there is no gif with this id',
    });
  }

  if (gif.rows[0].is_flagged === true) {
    await cloudinary.v2.uploader.destroy(gif.rows[0].public_id);

    await pool.query('DELETE FROM gifs WHERE id = $1', [gifId]);
    return res.status(202).json({
      status: 'success',
      data: {
        message: 'Gif successfully deleted',
      },
    });
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'you cannot delete this Gif',
    });
  }
};
