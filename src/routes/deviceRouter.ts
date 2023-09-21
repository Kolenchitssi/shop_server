import { Router } from 'express';
const router = Router();

import deviceController from '../controllers/deviceController.js';
import checkRole from '../middleware/checkRoleMiddleware.js';

router.post('/', checkRole('ADMIN'), deviceController.create);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);
router.delete('/:id', checkRole('ADMIN'), deviceController.delete); //? need id or id get from body

export default router;
