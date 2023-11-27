import express from 'express';
const router = express.Router();

import addMMTRecord from '../../controllers/OTA/MMT/addMMT.js';
import getOta from "../../controllers/OTA/getActiveOta.js"
import getSource from "../../controllers/OTA/fetchSource.js"
import testMMTConnection from '../../controllers/OTA/MMT/testConnectionMMT.js';
import XMLData from '../../controllers/OTA/MMT/getRoomsAndRates.js';


/////////////////////////////////////////////////////////
router.post("/api/addOTA", addMMTRecord);
router.get("/api/getOtaDetails", getOta);
router.get("/api/fetchSource", getSource);
router.post("/api/testOTAConnection", testMMTConnection)
router.get("/api/getOTARoomsAndRates", XMLData)


export default router;