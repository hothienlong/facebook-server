import express from 'express';
import connectFacebookController from '../controllers/influencers/connectFacebookController';

const router = express.Router();

router.post('/connectFacebook', connectFacebookController);

export default router;
