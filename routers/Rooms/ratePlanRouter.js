import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import ratePlan from "../../controllers/Rooms/ratePlan.js"
const router = express.Router();

router.post("/api/ratePlan", ratePlan);
export default router;