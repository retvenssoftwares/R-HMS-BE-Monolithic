import express from 'express';
// const multer = require('multer');
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import postProperty from '../../controllers/Property/property.controller.js'
//import postPropertyChain from "../../controllers/Property/propertyChain.controller.js"
import editProperty from "../../controllers/Property/editPropert.controller.js"
import reservationType from "../../controllers/Property/reservationType.controller.js"
import updateReservationType from "../../controllers/Property/updateReservationType.controller.js"
const router = express.Router();

router.post(
    '/api/createProperty',
    upload.fields([{ name: 'hotelImages', maxCount: 10 }, { name: 'hotelLogo', maxCount: 1 }]),
    postProperty
);
//router.post("/api/createPropertyChain", upload.single('hotelLogo'), postPropertyChain);
router.patch("/api/propertyAdditionalDetails", editProperty)


//Post ReservationType Route
router.post("/api/addReservationType", reservationType)

//update ReservationType Route
router.patch("/api/updateReservationType/:reservationId", updateReservationType)

export default router;