import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fileupload from 'express-fileupload';
import userRoutes from './routes/userRoutes.js';
import gifRoutes from './routes/gifRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(fileupload({ useTempFiles: true }));
app.use(cors());

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/auth', gifRoutes);
app.use('/api/v1/auth', articleRoutes);
app.use('/api/v1/auth', categoryRoutes);

const port = process.env.PORT || 5000;
export default app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
