import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fileupload from 'express-fileupload';
import userRoutes from './routes/userRoutes.js';
import gifRoutes from './routes/gifRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// parse incoming request with json payload
app.use(express.json());

// middleware to upload files(files were uploaded to cloudinary)
app.use(fileupload({ useTempFiles: true }));

// allows unfettered access between client and server
app.use(cors());

// api routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/auth', gifRoutes);
app.use('/api/v1/auth', articleRoutes);
app.use('/api/v1/auth', categoryRoutes);

// postman api documentation route
app.get('/', (req, res) => {
  const url = 'https://documenter.getpostman.com/view/10653175/2s8YeprsYk';
  res.redirect(url);
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
export default app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
