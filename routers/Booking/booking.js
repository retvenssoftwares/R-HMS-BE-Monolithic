import express from 'express';
const router = express.Router();

import {createResrvation} from "../../controllers/Bookings/booking.js"
import guestData from "../../controllers/Bookings/guestDetails.js"

router.post("/api/createBooking", createResrvation);
router.get("api/getGuestDetails", guestData);

export default router;