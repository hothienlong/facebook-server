import express from 'express';
import authController from '../controllers/auth/refreshToken';
import getLoginUrlController from '../controllers/auth/getLoginUrlController';
import accessTokenController from '../controllers/auth/accessTokenController';

const router = express.Router();
router.post('/refreshToken', authController);
router.post('/getLoginUrl', getLoginUrlController);
router.get('/accessToken', accessTokenController);

export default router;
