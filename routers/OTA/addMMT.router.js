import express from 'express';
const router = express.Router();

import addMMTRecord from '../../controllers/OTA/addMMT.js';
import getOta from "../../controllers/OTA/getActiveOta.js"
import getSource from "../../controllers/OTA/fetchSource.js"


/////////////////////////////////////////////////////////
router.post("/api/addMMT", addMMTRecord);
router.get("/api/getOtaDetails",getOta);
router.get("/api/fetchSource",getSource)


export default router;