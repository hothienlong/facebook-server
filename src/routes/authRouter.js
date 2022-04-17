import express from 'express';
import authController from '../controllers/auth/refreshToken';
import getLoginUrlController from '../controllers/auth/getLoginUrlController';

const router = express.Router();
router.post('/refreshToken', authController);
router.post('/getLoginUrl', getLoginUrlController);

export default router;
