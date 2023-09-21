import { Router } from 'express';
// 2й вариант
// import express from 'express';
// const router = express.Router();
import brandController from '../controllers/brandController.js';
import checkRole from '../middleware/checkRoleMiddleware.js';

const router = Router();

router.post('/', checkRole('ADMIN'), brandController.create);
router.get('/', brandController.getAll);
router.delete('/:id', checkRole('ADMIN'), brandController.delete);

export default router;
