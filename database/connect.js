import * as dotenv from 'dotenv';
import * as pg from 'pg';

const { Pool } = pg.default;
dotenv.config();

const client = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: process.env.CONNECT_PASSWORD,
  port: 5432,
  database: 'teamwork',
});

// var client = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "team",
//   password: "osemudiame1",
//   port: 5000,
// });;
client.connect(function(err) {
if (err) {
  return console.error("could not connect to postgres", err);
}
client.query('SELECT NOW() AS "theTime"', function(err, result) {
  if (err) {
    return console.error("error running query", err);
  }
  console.log("Database Connected");
});
});

export default client;
