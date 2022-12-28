import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import pool from '../database/connect.js';

export const createUser = async (req, res) => {
  const {
    firstName, lastName, email, password, gender, jobRole, department, address, isAdmin,
  } = req.body;

  const checkUser = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (checkUser.rows.length !== 0) {
    return res.status(401).json({
      status: 'error',
      error: 'User already registered',
    });
  }

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, gender, job_role, department, address, is_admin) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [firstName, lastName, email, hashedPassword, gender, jobRole, department, address, isAdmin],
  );

  const userId = newUser.rows[0].id;

  const payload = {
    userId,
    email,
    isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '72h' });
  return res.status(201).json({
    status: 'success',
    data: {
      message: 'Account created successfully',
      token,
      payload,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (user.rows.length === 0) {
    return res.status(401).json({
      status: 'error',
      error: 'invalid email',
    });
  }

  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) {
    return res.status(401).json({
      status: 'error',
      error: 'invalid password',
    });
  }

  const userId = user.rows[0].id;
  const isAdmin = user.rows[0].is_admin;

  const payload = {
    userId,
    email,
    isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '72h' });
  return res.status(201).json({
    status: 'success',
    data: {
      message: 'succesfully logged in',
      token,
      payload,
    },
  });
};

// forgot password functionality
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        error: 'Email doesnt exist',
      });
    }
    const userId = user.rows[0].id;
    const isAdmin = user.rows[0].is_admin;
    const firstName = user.rows[0].first_name;

    const payload = {
      userId,
      email,
      isAdmin,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
    const link = `https://ebubeproject.onrender.com/api/v1/auth/reset-password/${userId}/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ebuwonders.ep@gmail.com',
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: 'ebuwonders.ep@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `hello ${firstName}, you requested a change in your passowrd
      you can reset it using this ${link}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
    console.log(link);
  } catch (error) {
    console.log(error);
  }
};

export const resetPassowrd = async (req, res) => {
  const { id } = req.params;
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (user.rows.length === 0) {
    return res.status(401).json({
      status: 'error',
      error: 'User does not exist',
    });
  }
  res.redirect('localhost:3000/reset-password');
};

export const passwordReset = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (user.rows.length === 0) {
    return res.status(401).json({
      status: 'error',
      error: 'User does not exist',
    });
  }

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(`UPDATE users SET password = $1 WHERE id = ${id}`, [hashedPassword]);
    return res.status(201).json({
      status: 'success',
      data: {
        message: 'Password successfully updated',
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 'Something Went Wrong' });
  }
};
