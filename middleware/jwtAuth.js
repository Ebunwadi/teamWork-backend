import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export default (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verifiedUser;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        status: 'error',
        error: 'Invalid Token',
      });
    }
  }

  if (!token) {
    return res.status(403).json({
      status: 'error',
      error: 'authorization denied',
    });
  }
};
