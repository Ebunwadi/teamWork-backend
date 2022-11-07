import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fileupload from 'express-fileupload';
import userApi from './routes/userApi.js';
import gifApi from './routes/gifApi.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(fileupload({ useTempFiles: true }));
app.use(cors());

app.use('/api/v1/auth', userApi);
app.use('/api/v1/auth', gifApi);

const port = process.env.PORT || 5000;
export default app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
