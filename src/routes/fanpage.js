import express from 'express';
import getPostEngagementController from '../controllers/fanpage/getPostEngagementController';
import getListFanpagesManagementController from '../controllers/fanpage/getListFanpagesManagementController';

const router = express.Router();

router.get('/getPostEngagement', getPostEngagementController);
router.get('/getListFanpagesManagement', getListFanpagesManagementController);

export default router;
