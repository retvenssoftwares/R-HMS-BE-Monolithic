import express from 'express';
const router = express.Router();

import { createResrvation } from "../../controllers/Bookings/reservation.js"
import guestData from "../../controllers/Bookings/guestDetails.js"
import addguest from "../../controllers/Bookings/addGuest.js"
import { addConfirmBooking } from '../../controllers/Bookings/confrimBooking.js';
import { creatQuickReservation } from '../../controllers/Bookings/quickBooking.js';
import { testingReservation } from '../../controllers/Bookings/testing.js';
import { createCompanyResrvation } from "../../controllers/Bookings/companyReservation.js"
import { getCompanyReservation } from '../../controllers/Bookings/getCompanyReservation.js';
import { getReservationDetails } from '../../controllers/Bookings/getReservationDetails.js';
import {cancelBooking} from "../../controllers/Bookings/cancleBooking.js"
import { gerArrivalBookings } from '../../controllers/Bookings/arrivalAndDepartureBookings.js';
import {addCharges} from "../../controllers/Bookings/addCharges.js"


router.post("/api/createBooking", createResrvation);

router.get("api/getGuestDetails", guestData);

router.post("/api/addguest", addguest);

router.post("/api/addConfirmBooking", addConfirmBooking)

router.post("/api/quickBooking", creatQuickReservation)

router.get("/api/testing", testingReservation)

router.post("/api/createCompanyBooking", createCompanyResrvation)

router.get("/api/getCompanyReservation", getCompanyReservation)


router.get("/api/getBookingDetails", getReservationDetails)

router.patch("/api/canacleBooking",cancelBooking)

router.get("/api/getArrivalBooking",gerArrivalBookings)

router.post("/api/addCharges",addCharges)

export default router;