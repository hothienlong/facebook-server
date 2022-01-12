import express from 'express';
import updateInfluencerController from '../controllers/influencers/updateInfluencerController';

const router = express.Router();

router.post('/updateInfluencer', updateInfluencerController);

export default router;
