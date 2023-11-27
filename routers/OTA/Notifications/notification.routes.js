import express from 'express';
const router = express.Router();

import bookingMMTNotifications from '../../../controllers/OTA/MMT/Notifications/mmtBookingNotification.controller.js'

/////////////////////////////////////////////////////////
router.post("/api/Goibibo/bookingnotification", express.text({ type: 'text/xml' }), bookingMMTNotifications);


export default router;