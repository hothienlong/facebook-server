import express from 'express';
import authController from '../controllers/auth/refreshToken';

const router = express.Router();
router.post('/refreshToken', authController);

export default router;
