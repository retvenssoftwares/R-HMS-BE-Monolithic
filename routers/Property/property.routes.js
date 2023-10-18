import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postProperty from '../../controllers/Property/property.controller.js'
import editProperty from "../../controllers/Property/editPropert.controller.js"
import {transportationAdd , updateTransportation , getTransportation} from "../../controllers/Property/transpotationTypes.js"
import addPaymentType from "../../controllers/Property/addPaymentTypes.js"
import userProperty from "../../controllers/Property/getUserProperties.controller.js"
import propertyImageController from '../../controllers/Property/addPropertyImages.js'
import reservationType  from '../../controllers/Property/reservationType.controller.js'
import updateReservationType from '../../controllers/Property/updateReservationType.controller.js'
import userIdentity from "../../controllers/Property/postidentity.controller.js"
import fetchReservation from '../../controllers/Property/getReservation.controller.js'
import postBookingSource from '../../controllers/Property/bookingSource.controller.js'
const router = express.Router();

router.post(
    '/api/createProperty',
    upload.fields([{ name: 'hotelLogo', maxCount: 1 }]),
    postProperty
);
router.post("/api/addTransportation",transportationAdd)
router.patch("/api/updateTransportation", updateTransportation)
router.get("/api/getTransportation",getTransportation)
//router.post("/api/createPropertyChain", upload.single('hotelLogo'), postPropertyChain);
router.patch("/api/propertyAdditionalDetails", editProperty)
router.patch("/api/uploadPropertyImages/:propertyId", upload.fields([{ name: 'hotelImage', maxCount: 1 }]), propertyImageController);
router.patch("/api/editProperty", editProperty);
router.post("/api/addPaymentType", addPaymentType)
router.get("/api/fetchProperty/:userId", userProperty);


//Post ReservationType Route
router.post("/api/addReservationType", reservationType)

//update ReservationType Route
router.patch("/api/updateReservationType/:reservationId", updateReservationType)

//get reservationType
router.get("/api/getreservation/:propertyId",fetchReservation)

//post booking source
router.post("/api/bookingSource",postBookingSource)



router.post("/api/postIdentity", userIdentity);

export default router;