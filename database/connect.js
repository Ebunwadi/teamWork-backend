import * as dotenv from 'dotenv';
import * as pg from 'pg';

const { Pool } = pg.default;
dotenv.config();

// const pool = new Pool({
//   host: 'localhost',
//   user: 'postgres',
//   password: process.env.CONNECT_PASSWORD,
//   port: 5432,
//   database: 'teamwork',
// });

const pool = new Pool({
  host: process.env.RENDER_HOST,
  user: 'ebube',
  password: process.env.RENDER_PASSWORD,
  port: 5432,
  database: 'teamwork_fcgt',
  ssl: true,
});
export default pool;
