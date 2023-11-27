import express from 'express';
const router = express.Router();

import bookingMMTNotifications from '../../../controllers/OTA/MMT/Notifications/mmtBookingNotification.controller.js'
//import BookingNotificationMMT from '../../../models/Notifications/mmtBookingNotification.js';
import bookingNotifications from '../../../controllers/OTA/getBookingNotification.js'

/////////////////////////////////////////////////////////
router.post("/api/Goibibo/bookingnotification", bookingMMTNotifications);
router.get("/api/getBookingNotification", bookingNotifications);

export default router;