import express from 'express';
const router = express.Router();

import mapRoomData from '../../controllers/OTA/mapRoom.js';
import mapRateData from '../../controllers/OTA/mapRatePlan.js';
import rateRuleUpdate from '../../controllers/OTA/patchRateRules.js';


/////////////////////////////////////////////////////////
router.patch("/api/mapRoomType", mapRoomData);
router.patch("/api/mapRatePlan", mapRateData);
router.patch("/api/patchRateRule", rateRuleUpdate);


export default router;