import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { IToken } from 'models/token.model.js';

dotenv.config(); //for access .env

function checkRole(role: string) {
  return function (req: any, res: Response, next: NextFunction) {
    console.log('checkRoleMiddleware req', req);
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      //в хеадер помещают тип токена и потом сам токен : Bearer asafgsdfsdsasada...
      const headers = req.headers.autorization;
      const token = !!headers && typeof headers === 'string' ? headers.split(' ')[1] : null;

      if (!token) {
        return res.status(401).json({ message: 'Пользователь не авторизован!' });
      }
      const decoded = process.env.SECRET_KEY && (jwt.verify(token, process.env.SECRET_KEY) as IToken);
      if (decoded && decoded?.role !== role) {
        return res.status(403).json({ message: 'Нет доступа!' });
      }
      if (decoded && decoded?.role === role) {
        req.user = decoded;
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Пользователь не авторизован!!!' });
    }
  };
}

export default checkRole;
