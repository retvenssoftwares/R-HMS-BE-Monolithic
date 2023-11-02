import express from 'express';
const router = express.Router();

import {createResrvation} from "../../controllers/Bookings/booking.js"

router.post("/api/createBooking", createResrvation);

export default router;