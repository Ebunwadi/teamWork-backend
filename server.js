import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userApi from './routes/userApi.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', userApi);

const port = process.env.PORT || 5000;
export default app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
