import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userApi from './routes/userApi.js';
import adminAuth from './middleware/admin-auth.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', adminAuth, userApi);

const port = process.env.PORT || 5000;
export default app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
