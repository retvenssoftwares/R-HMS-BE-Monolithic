import express from 'express';
const router = express.Router();

import addMMTRecord from '../../controllers/OTA/addMMT.js';

router.post("/api/addMMT", addMMTRecord);

export default router;