import * as dotenv from 'dotenv';
import * as pg from 'pg';

const { Pool } = pg.default;
dotenv.config();

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: process.env.CONNECT_PASSWORD,
  port: 5432,
  database: 'teamwork',
});

export default pool;
