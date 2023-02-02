import { Router } from 'express';
const router = Router();

import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.get('/auth2', (req, res) => {
  res.json({ body: 'all working' });
});

// router.delete("/login");

export default router;
