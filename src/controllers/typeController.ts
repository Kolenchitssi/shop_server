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

  // todo check working
  async delete(req: Request, res: Response) {
    // const { id } = req.params; //получаем из параметров адресной строки //? need id or id get from body

    const { id } = req.body;
    const result = await Type.destroy({ where: { id } }); // Delete everyone where id===id
    // or
    // const result = await Type.destroy({ where: { name, } }); // Delete everyone where named
    return res.json(result);
  }

  async getAll(req: Request, res: Response) {
    const types = await Type.findAll();
    return res.json(types);
  }
}

export default new TypeController();
