import express from 'express';
import authController from '../controllers/auth/refreshToken';
import getLoginUrlController from '../controllers/auth/getLoginUrlController';
import accessTokenController from '../controllers/auth/accessTokenController';
import logoutController from '../controllers/auth/logoutController';

const router = express.Router();
router.post('/refreshToken', authController);
router.post('/getLoginUrl', getLoginUrlController);
router.get('/accessToken', accessTokenController);
router.post('/logout', logoutController);

export default router;
