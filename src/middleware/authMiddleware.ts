import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IToken } from 'models/token.model.js';

dotenv.config(); //for access .env

// пробовал для типизации req
// interface IGetUserAuthInfoRequest extends Request {
//   user: IToken;
// }

export default function (req: any, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    //в хеадер помещают тип токена и потом сам токен : Bearer asafgsdfsdsasada...
    const headers = req.headers?.autorization || '';

    const token = !!headers && typeof headers === 'string' ? headers.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    if (process.env.SECRET_KEY) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY) as IToken;
      console.log('authMiddleware decoded ', decoded);

      req.user = decoded;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Пользователь не авторизован!!!' });
  }
}
