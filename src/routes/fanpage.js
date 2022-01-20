import express from 'express';
import getPostEngagementController from '../controllers/fanpage/getPostEngagementController';

const router = express.Router();

router.get('/getPostEngagement', getPostEngagementController);

export default router;
