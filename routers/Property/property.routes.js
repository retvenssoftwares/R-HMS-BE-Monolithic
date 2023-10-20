import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postProperty from '../../controllers/Property/property.controller.js'
import editProperty from "../../controllers/Property/editPropert.controller.js"
import addPaymentType from "../../controllers/Property/addPaymentTypes.js"
import getPaymentTypes from '../../controllers/Property/getPaymentTypes.js'
import patchPaymentType from '../../controllers/Property/patchPaymentTypes.js';
import userProperty from "../../controllers/Property/getUserProperties.controller.js"
import propertyImageController from '../../controllers/Property/addPropertyImages.js'
import reservationType  from '../../controllers/Property/reservationType.controller.js'
import updateReservationType from '../../controllers/Property/updateReservationType.controller.js'
import userIdentity from "../../controllers/Property/postidentity.controller.js"
import { getTransportation, transportationAdd, updateTransportation } from '../../controllers/Property/transpotationTypes.js';
import { addBusinessSources, getBusinessSources, updateBusinessSources } from '../../controllers/Property/businessSources.js';
import { addInclusion, updateInclusion } from '../../controllers/Property/addInclusion.js';
import { addInclusionPlan, updateInclusionPlan } from '../../controllers/Property/addInclusionPlan.js';


const router = express.Router();

router.post(
    '/api/createProperty',
    upload.fields([{ name: 'hotelLogo', maxCount: 1 }]),
    postProperty
);

// transport
router.post("/api/addTransportation",transportationAdd)
router.patch("/api/updateTransportation", updateTransportation)
router.get("/api/getTransportation/:userId/:propertyId",getTransportation)

// business
router.post("/api/addBusinessSources",addBusinessSources)
router.patch("/api/updateBusinessSources", updateBusinessSources)
router.get("/api/getBusinessSources/:userId/:propertyId",getBusinessSources)

//inclusion
router.post("/api/addInclusion",addInclusion)
router.patch("/api/updateInclusion",updateInclusion)
router.post("/api/addInclusionPlan",addInclusionPlan)
router.patch("/api/updateInclusionPlan",updateInclusionPlan)

router.patch("/api/propertyAdditionalDetails", editProperty)
router.patch("/api/uploadPropertyImages/:propertyId", upload.fields([{ name: 'hotelImage', maxCount: 1 }]), propertyImageController);
router.patch("/api/editProperty", editProperty);

//payment types
router.post("/api/addPaymentType", addPaymentType)
router.get("/api/getPaymentTypes", getPaymentTypes)
router.patch("/api/patchPaymentType/:paymentTypeId", patchPaymentType)

router.get("/api/fetchProperty/:userId", userProperty);


//Post ReservationType Route
router.post("/api/addReservationType", reservationType)

//update ReservationType Route
router.patch("/api/updateReservationType/:reservationId", updateReservationType)
router.post("/api/postIdentity", userIdentity);

export default router;