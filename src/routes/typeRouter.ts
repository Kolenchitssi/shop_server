import { Router } from 'express';
const router = Router();

import typeController from '../controllers/typeController.js';
import checkRole from '../middleware/checkRoleMiddleware.js';

router.post('/', checkRole('ADMIN'), typeController.create);
router.get('/', typeController.getAll);
router.delete('/:id', checkRole('ADMIN'), typeController.delete); //? need id or id get from body

export default router;
