import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { models } from '../models/models.js';

import { ApiError } from '../error/ApiError.js';

const { Device, DeviceInfo } = models;

class DeviceController {
  async create(req: any, res: Response, next: NextFunction) {
    try {
      console.log(req.files);
      const { name, price, brandId, typeId } = req.body;
      let { info } = req.body;
      const { img } = req.files;
      const fileName = uuidv4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName)); // перемещаем файл в папку static
      const device = (await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      })) as any;
      if (info) {
        info = JSON.parse(info);
        info.forEach((i: any) =>
          DeviceInfo.create({
            //await не ставится специально чтобы не блокировать поток
            title: i.title,
            description: i.description,
            deviceId: device.id,
          }),
        );
      }
      return res.json(device);
    } catch (error: any) {
      next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req: any, res: Response) {
    const { brandId, typeId } = req.query; //* получаем из запроса
    let { limit, page } = req.query;

    page = page || 1;
    limit = limit || 10; //количество товаров на странице
    const offset = page * limit - limit; //отступ тоесть какое количество товаро пропустить перед показом

    let devices;
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset }); // есть  Device.findAll она такая же но не возвращает общщtе количество найденых товаров см  внизу
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      }); // есть  Device.findAll она такая же но не возвращает общщtе количество найденых товаров
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId, typeId },
        limit,
        offset,
      });
    }
    return res.json(devices);
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params; //получаем из параметров адресной строки
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    });
    return res.json(device);
  }
}

export default new DeviceController();

//*** findAndCountAll
/*
{
  "count": 5, //! общее количество
  "rows": [
      {
          "id": 3,
          "name": "Стул версаль",
          "price": 300,
          "rating": 0,
          "img": "224972d5-a274-4257-8194-494986a91fff.jpg",
          "createdAt": "2022-11-22T09:13:22.207Z",
          "updatedAt": "2022-11-22T09:13:22.207Z",
          "typeId": 1,
          "brandId": 2
      },
      {
          "id": 4,
          "name": "Стул кухоный",
          "price": 100,
          "rating": 0,
          "img": "b431f461-3991-4555-8c12-5d7a1583f7dc.jpg",
          "createdAt": "2022-11-22T09:13:56.019Z",
          "updatedAt": "2022-11-22T09:13:56.019Z",
          "typeId": 1,
          "brandId": 2
      }
  ]
}
*/

//*** findAll
/*
[
    {
        "id": 3,
        "name": "Стул версаль",
        "price": 300,
        "rating": 0,
        "img": "224972d5-a274-4257-8194-494986a91fff.jpg",
        "createdAt": "2022-11-22T09:13:22.207Z",
        "updatedAt": "2022-11-22T09:13:22.207Z",
        "typeId": 1,
        "brandId": 2
    },
    {
        "id": 4,
        "name": "Стул кухоный",
        "price": 100,
        "rating": 0,
        "img": "b431f461-3991-4555-8c12-5d7a1583f7dc.jpg",
        "createdAt": "2022-11-22T09:13:56.019Z",
        "updatedAt": "2022-11-22T09:13:56.019Z",
        "typeId": 1,
        "brandId": 2
    }
]
*/
