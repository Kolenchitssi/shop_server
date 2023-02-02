import { models } from '../models/models.js';
import { Request, Response } from 'express';
import { ApiError } from '../error/ApiError';

const { Type } = models;

class TypeController {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const type = await Type.create({ name });
    return res.json(type);
  }

  async getAll(req: Request, res: Response) {
    const types = await Type.findAll();
    return res.json(types);
  }
}

export default new TypeController();
