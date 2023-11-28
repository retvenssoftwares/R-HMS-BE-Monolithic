import express from 'express';
const router = express.Router();

import bookingMMTNotifications from '../../../controllers/OTA/MMT/Notifications/mmtBookingNotification.controller.js'
//import BookingNotificationMMT from '../../../models/Notifications/mmtBookingNotification.js';
import bookingNotifications from '../../../controllers/OTA/getBookingNotification.js'

/////////////////////////////////////////////////////////
router.get("/api/Goibibo/bookingnotification", express.text({ type: 'text/xml' }), bookingMMTNotifications);
router.get("/api/getBookingNotification", bookingNotifications);

export default router;