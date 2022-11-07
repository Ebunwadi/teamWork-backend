import * as dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import pool from '../database/connect.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const createGif = async (req, res) => {
  const { title } = req.body;
  const { image } = req.files;

  try {
    if (!image) return res.status(404).json({ message: 'you need to upload a gif' });
    if (!title) return res.status(400).json({ message: 'gif caption is required' });
    const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
      folder: 'gifs',
    });
    const { secure_url: secureUrl, public_id: publicId, created_at: createdOn } = result;
    const postedBy = req.user.email;
    const gifDB = await pool.query(
      `INSERT INTO gifs (title, image_url, created_on, public_id, posted_by) 
          VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, secureUrl, createdOn, publicId, postedBy],
    );
    console.log(gifDB.rows);
    return res.status(201).json({
      status: 'sucess',
      data: {
        gifId: gifDB.rows[0].id,
        message: 'GIF image successfully posted.',
        createdOn,
        title,
        imageUrl: secureUrl,
        postedBy,
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

export default createGif;
