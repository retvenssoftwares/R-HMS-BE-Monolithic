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
import identityType from '../../controllers/Property/getIdentityTypes.controller.js'
import reservationType from '../../controllers/Property/reservationType.controller.js'
import updateReservationType from '../../controllers/Property/updateReservationType.controller.js'
import userIdentity from "../../controllers/Property/postIdentity.controller.js"
import fetchReservation from '../../controllers/Property/getReservation.controller.js'
import postBookingSource from '../../controllers/Property/bookingSource.controller.js'
import updateBookingSource from '../../controllers/Property/updateBookingSource.controller.js'
import fetchBookingSource from '../../controllers/Property/getBookingSource.controller.js'
import holiday from '../../controllers/Property/holidays.controller.js'
import patchHoliday from '../../controllers/Property/updateHoliday.controller.js'
import getHoliday from '../../controllers/Property/getHoliday.controller.js'

//amenities
import amenityType from "../../controllers/Amenities/postAmenity.js"
import getAmenities from "../../controllers/Amenities/getAmenities.js"
import patchAmenity from '../../controllers/Amenities/patchAmenity.js';

//seasons
import seasonType from "../../controllers/Property/postSeason.js"
import getSeasons from '../../controllers/Property/getSeasons.js';
import patchSeason from '../../controllers/Property/patchSeason.js';
import identityTypes from "../../controllers/Property/patchIdentity.js"
import { getTransportation, transportationAdd, updateTransportation } from '../../controllers/Property/transpotationTypes.js';
import { addBusinessSources, getBusinessSources, updateBusinessSources } from '../../controllers/Property/businessSources.js';

//company
import getCompany from "../../controllers/Property/getCompany.js"

const router = express.Router();

router.post(
    '/api/createProperty',
    upload.fields([{ name: 'hotelLogo', maxCount: 1 }]),
    postProperty
);

// transport
router.post("/api/addTransportation", transportationAdd)
router.patch("/api/updateTransportation", updateTransportation)
router.get("/api/getTransportation/:userId/:propertyId", getTransportation)

// business
router.post("/api/addBusinessSources", addBusinessSources)
router.patch("/api/updateBusinessSources", updateBusinessSources)
router.get("/api/getBusinessSources/:userId/:propertyId", getBusinessSources)



router.patch("/api/propertyAdditionalDetails", editProperty)
router.patch("/api/uploadPropertyImages/:propertyId", upload.fields([{ name: 'hotelImage', maxCount: 1 }]), propertyImageController);
router.patch("/api/editProperty", editProperty);
//patch Identity
router.patch("/api/patchIdentityType/:identityTypeId", identityTypes);

//payment types
router.post("/api/addPaymentType", addPaymentType)
router.get("/api/getPaymentTypes", getPaymentTypes)
router.patch("/api/patchPaymentType/:paymentTypeId", patchPaymentType)

router.get("/api/fetchProperty/:userId", userProperty);


//Post ReservationType Route
router.post("/api/addReservationType", reservationType)

//update ReservationType Route
router.patch("/api/updateReservationType/:reservationTypeId", updateReservationType)

//get reservationType
router.get("/api/getreservation", fetchReservation)

//post booking source
router.post("/api/bookingSource", postBookingSource)

//update booking source
router.patch("/api/updateBookingSource/:bookingSourceId", updateBookingSource)

//fetch BookingSource
router.get("/api/getBookingSource/:propertyId", fetchBookingSource)

router.post("/api/postIdentity", userIdentity);
router.get("/api/fetchIdentity", identityType);

//seasons
router.post("/api/postSeason", seasonType);
router.get("/api/getSeasons", getSeasons);
router.patch("/api/patchSeason/:seasonId", patchSeason)

//holiday
router.post("/api/postHoliday", holiday)
router.patch("/api/patchHoliday/:holidayId", patchHoliday)
router.get("/api/getHoliday", getHoliday)

//amenity type
router.post("/api/postAmenity", amenityType);
router.get("/api/getAmenities", getAmenities);
router.patch("/api/patchAmenity", patchAmenity);

//company 
router.get("/api/companyType", getCompany);

export default router;