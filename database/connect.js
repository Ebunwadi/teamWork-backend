import { Pool } from 'pg';

require('dotenv').config();

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: process.env.CONNECT_PASSWORD,
  port: 5432,
  database: 'teamwork',
});

export default pool;
