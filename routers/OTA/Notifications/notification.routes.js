import express from 'express';
const router = express.Router();

import bookingMMTNotifications from '../../../controllers/OTA/MMT/Notifications/mmtBookingNotification.controller.js'

/////////////////////////////////////////////////////////
router.get("/api/Goibibo/bookingnotification", bookingMMTNotifications);

export default router;