import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../database/connect.js';

const createUser = async (req, res) => {
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
    `INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address, isAdmin) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [firstName, lastName, email, hashedPassword, gender, jobRole, department, address, isAdmin],
  );

  const userid = newUser.rows[0].userid;

  const payload = {
    userid,
    email,
    isAdmin,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' });
  return res.status(201).json({
    status: 'success',
    data: {
      message: 'Account created successfully',
      token,
      payload,
    },
  });
};

export default createUser;
