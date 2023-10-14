import express from 'express';
// const multer = require('multer');
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postProperty from '../../controllers/Property/property.controller.js'
//import postPropertyChain from "../../controllers/Property/propertyChain.controller.js"
import editProperty from "../../controllers/Property/editPropert.controller.js"

const router = express.Router();

router.post("/api/createProperty", upload.fields([{ name: 'hotelImages', maxCount: 6 },{ name: 'hotelLogo', maxCount: 1 }]), postProperty);
//router.post("/api/createPropertyChain", upload.single('hotelLogo'), postPropertyChain);
router.patch("/api/propertyAdditionalDetails", editProperty)

export default router;