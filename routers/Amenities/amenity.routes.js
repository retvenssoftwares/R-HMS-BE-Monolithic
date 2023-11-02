import express from 'express';
const router = express.Router();

//amenities
import amenityType from "../../controllers/Amenities/postAmenity.js"
import getAmenities from "../../controllers/Amenities/getAmenities.js"
import patchAmenity from '../../controllers/Amenities/patchAmenity.js';
import fetchAmenity from '../../controllers/Amenities/fetchAmenitiesByPropertyId.js'

//amenity type
router.post("/api/postAmenity", amenityType);
router.get("/api/getAmenities", getAmenities);
router.patch("/api/patchAmenity", patchAmenity);
router.get("/api/fetchAmenity",fetchAmenity)

export default router;