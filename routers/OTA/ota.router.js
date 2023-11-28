import express from 'express';
const router = express.Router();

import mapRoomData from '../../controllers/OTA/mapRoom.js';
import mapRateData from '../../controllers/OTA/mapRatePlan.js';
import rateRuleUpdate from '../../controllers/OTA/patchRateRules.js';
import getChannelLogs from '../../controllers/OTA/MMT/channelLogs.js';
import getOTABookings from '../../controllers/OTA/getOTABookings.js';


/////////////////////////////////////////////////////////
router.patch("/api/mapRoomType", mapRoomData);
router.patch("/api/mapRatePlan", mapRateData);
router.patch("/api/patchRateRule", rateRuleUpdate);
router.get("/api/getOTABookings", getOTABookings);
router.get("/api/getChannelLogs", getChannelLogs)


export default router;