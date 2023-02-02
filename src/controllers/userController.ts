import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

import { models } from '../models/models.js';
import { ApiError } from '../error/ApiError.js';

dotenv.config();
const { User, Basket } = models;
const secretKey = process.env.SECRET_KEY || '';

const generateJwt = (id: string, email: string, role: string) => {
  return jwt.sign({ id, email, role }, secretKey, {
    expiresIn: '24h', // время жизни токена
  });
};

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password!'));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует!'));
    }
    const hashPassword = await bcrypt.hash(password, 4); //второй параметр сколько раз будет хэшироватся пароль
    const user = (await User.create({ email, role, password: hashPassword })) as any;
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = (await User.findOne({ where: { email } })) as any;
    if (!user) {
      return next(ApiError.internal('Пользователь не найден!'));
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Неверный пароль'));
    }
    const id = user.id;
    const token = generateJwt(user.id, user.password, user.role);
    return res.json({ token });
  }

  async check(req: any, res: Response, next: NextFunction) {
    const token = generateJwt(req.user?.id, req.user?.email, req.user?.role);
    return res.json({ token });
  }
}

export default new UserController();
