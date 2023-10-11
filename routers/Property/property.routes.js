import express from 'express';
// const multer = require('multer');
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postProperty from '../../controllers/Property/property.controller.js'

const router = express.Router();

router.post("/createProperty", upload.single('hotelLogo'), postProperty);

export default router;