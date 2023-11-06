import holdData from "../models/holdBooking.js";
import axios from "axios";
// import guestModel from "../../models/guestDetails.js"
import nodeCorn from "node-cron"

export const oldBooking = async(req,res) =>{

    const getTimestamp15MinutesAgo = () => {
        const currentTimestamp = new Date();
        const fifteenMinutesAgo = new Date(currentTimestamp.getTime() - 1 * 60 * 1000); // Subtract 15 minutes in milliseconds
        console.log(fifteenMinutesAgo)
        return fifteenMinutesAgo.toISOString(); // Convert to UTC format
      };
      
      // Function to delete records older than 15 minutes
      const deleteOldRecords = async () => {
        const fifteenMinutesAgo = getTimestamp15MinutesAgo();
        await holdData.deleteMany({ bookingTime: { $lt: fifteenMinutesAgo } });
        console.log('Old records deleted successfully');
      };

      const data = nodeCorn.schedule('*/1 * * * *', () => {
        deleteOldRecords();
      });

      data.start()

}