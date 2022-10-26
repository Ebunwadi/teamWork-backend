// CREATE DATABASE teamwork;

// CREATE TABLE users (
//     userId serial PRIMARY KEY,
//     firstName VARCHAR (50) NOT NULL,
//     lastName VARCHAR (50) NOT NULL,
//     email VARCHAR (50) UNIQUE NOT NULL,
//     password VARCHAR (255) NOT NULL,
//     gender VARCHAR (50) NOT NULL,
//     jobRole VARCHAR (50) NOT NULL,
//     department VARCHAR (50) NOT NULL,
//     address VARCHAR (50) NOT NULL,
//     isAdmin BOOLEAN
// );
import pool from './connect.js';

export default () => {
  const createGenresTable = async () => {
    try {
      await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL NOT NULL PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          gender VARCHAR(255),
          jobRole VARCHAR(255),
          department VARCHAR(255),
          is_admin BOOLEAN NOT NULL DEFAULT false,
          address VARCHAR(255),
          created_at  DATE NOT NULL,
          updated_at  DATE NOT NULL);
      `);
    } catch (error) {
      console.log(error);
    }
  };
  createGenresTable();
};
