import express from 'express';
const router = express.Router();

import {createResrvation} from "../../controllers/Bookings/reservation.js"
import guestData from "../../controllers/Bookings/guestDetails.js"
import addguest from "../../controllers/Bookings/addGuest.js"
import { addConfirmBooking } from '../../controllers/Bookings/confrimBooking.js';
import { creatQuickReservation } from '../../controllers/Bookings/quickBooking.js';
import { addRoomInfloor } from '../../controllers/Bookings/floor.js';
import {roomDetails} from '../../controllers/Bookings/roomInFloor.js';
import {getRoomByFloorId} from "../../controllers/Bookings/getRoomByFloorId.js"

router.post("/api/createBooking", createResrvation);

router.get("api/getGuestDetails", guestData);

router.post("/api/addguest",addguest);

router.post("/api/addConfirmBooking",addConfirmBooking)

router.post("/api/quickBooking",creatQuickReservation)

router.post("/api/addFloor",addRoomInfloor)

router.post("/api/addRoomInFloor",roomDetails)

router.get("/api/getRoomDetailsByFloorId",getRoomByFloorId)

export default router;