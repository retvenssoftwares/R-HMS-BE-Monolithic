import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

import addCompany from '../../controllers/Rooms/addCompany.js';

router.post("/api/addCompany", addCompany)

export default router;

