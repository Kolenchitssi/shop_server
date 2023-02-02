import { Request, Response } from 'express';

import { models } from '../models/models.js';
import { ApiError } from '../error/ApiError.js';

const { Brand } = models;

class BrandController {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    return res.json(brand);
  }

  async getAll(req: Request, res: Response) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }
}

export default new BrandController();
