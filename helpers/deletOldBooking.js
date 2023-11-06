// import holdData from "../models/holdBooking.js";
// import axios from "axios";
// // import guestModel from "../../models/guestDetails.js"
// import nodeCorn from "node-cron"

// export const oldBooking = async(req,res) =>{

//     const getTimestamp15MinutesAgo = () => {
//         const currentTimestamp = new Date();
//         const fifteenMinutesAgo = new Date(currentTimestamp.getTime() - 1 * 60 * 1000); // Subtract 15 minutes in milliseconds
//         console.log(fifteenMinutesAgo)
//         return fifteenMinutesAgo.toISOString(); // Convert to UTC format
//       };

//       // Function to delete records older than 15 minutes
//       const deleteOldRecords = async () => {
//         const fifteenMinutesAgo = getTimestamp15MinutesAgo();
//         await holdData.deleteMany({ bookingTime: { $lt: fifteenMinutesAgo } });
//         console.log('Old records deleted successfully');
//       };

//       const data = nodeCorn.schedule('*/1 * * * *', () => {
//         deleteOldRecords();
//       });

//       data.start()

// }

import cron from "node-cron"
import holdData from "../models/holdBooking.js";
// const bookingModel = require('../models/Bookings/bookings');
// const manageInventoryModel = require('../models/manageInventory/manageInventory');
// const dumpInventoryModel = require('../models/manageInventory/dataDumpInventoryRates')
// const io = require('socket.io')();
//job to remove old pending booking records
const removeOldBookings = async () => {
  try {

    const getTimestamp15MinutesAgo = () => {
      const currentTimestamp = new Date();
      const fifteenMinutesAgo = new Date(currentTimestamp.getTime() - 15 * 60 * 1000); // Subtract 15 minutes in milliseconds
      // console.log(fifteenMinutesAgo)
      return fifteenMinutesAgo.toISOString(); // Convert to UTC format
    };

    const currentTime = Math.floor(new Date() / 1000); // Convert to seconds
    const fifteenMinutesAgo = await getTimestamp15MinutesAgo();
    //  console.log("current time ", currentTime)
    // Calculate the date and time 24 hours ago from the current time

    //  console.log(twentyFourHoursAgo)
    // Remove booking records with createdAt timestamps older than 24 hours
    const bookings = await holdData.deleteMany({

      bookingTime: { $lt: fifteenMinutesAgo },
    });
    if (bookings.deletedCount > 0) {
      console.log('Old booking records removed successfully.');
    } else {
      console.log('No bookings to delete at: ', new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))
    }


  } catch (error) {
    console.error('Error removing old booking records:', error);
  }
};
// Schedule the job for running every 10 mins
const deleteBookingJob = cron.schedule('*/1 * * * *', removeOldBookings);


// Start the cron job
let startVar = deleteBookingJob.start();
// if (startVar) { console.log("ok") }

export default removeOldBookings;
