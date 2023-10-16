import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postProperty from '../../controllers/Property/property.controller.js'
import editProperty from "../../controllers/Property/editPropert.controller.js"
import addPaymentType from "../../controllers/Property/addPaymentTypes.js"
import userProperty from "../../controllers/Property/getUserProperties.controller.js"

const router = express.Router();

router.post(
    '/api/createProperty',
    upload.fields([{ name: 'hotelImages', maxCount: 10 }, { name: 'hotelLogo', maxCount: 1 }]),
    postProperty
);
//router.post("/api/createPropertyChain", upload.single('hotelLogo'), postPropertyChain);
router.patch("/api/editProperty", editProperty);
router.post("/api/addPaymentType", addPaymentType)
router.get("/api/fetchProperty/:userId", userProperty);

export default router;