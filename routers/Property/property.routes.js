import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postProperty from '../../controllers/Property/property.controller.js'
import editProperty from "../../controllers/Property/editPropert.controller.js"

//payment types
import addPaymentType from "../../controllers/Property/addPaymentTypes.js"
import getPaymentTypes from '../../controllers/Property/getPaymentTypes.js'
import patchPaymentType from '../../controllers/Property/patchPaymentTypes.js';
import userProperty from "../../controllers/Property/getUserProperties.controller.js"
import propertyImageController from '../../controllers/Property/addPropertyImages.js'

const router = express.Router();

router.post(
    '/api/createProperty',
    upload.fields([{ name: 'hotelLogo', maxCount: 1 }]),
    postProperty
);
router.patch("/api/uploadPropertyImages/:propertyId", upload.fields([{ name: 'hotelImage', maxCount: 1 }]), propertyImageController);
router.patch("/api/editProperty", editProperty);

//payment types
router.post("/api/addPaymentType", addPaymentType)
router.get("/api/getPaymentTypes", getPaymentTypes)
router.patch("/api/patchPaymentType/:paymentTypeId", patchPaymentType)

router.get("/api/fetchProperty/:userId", userProperty);

export default router;