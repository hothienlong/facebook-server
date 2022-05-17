import express from 'express';
import authController from '../controllers/auth/refreshToken';
import getLoginUrlController from '../controllers/auth/getLoginUrlController';
import accessTokenController from '../controllers/auth/accessTokenController';
import longLivedAccessTokenController from '../controllers/auth/longLivedAccessTokenController';
import logoutController from '../controllers/auth/logoutController';

const router = express.Router();
router.post('/refreshToken', authController);
router.post('/getLoginUrl', getLoginUrlController);
router.get('/accessToken', accessTokenController);
// cho app (ngoài ra còn có cho page, cho user)
// cho user phải thông qua sdk
router.get('/longLivedAccessToken', longLivedAccessTokenController);
router.post('/logout', logoutController);

export default router;
