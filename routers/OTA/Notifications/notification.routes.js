import express from 'express';
const router = express.Router();

import bookingMMTNotifications from '../../../controllers/OTA/Notifications/mmtBookingNotification.controller.js'

/////////////////////////////////////////////////////////
router.get("/api/Goibibo/bookingnotification", bookingMMTNotifications);

export default router;