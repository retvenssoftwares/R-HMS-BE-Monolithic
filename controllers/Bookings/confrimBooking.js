import bookingModel from "../../models/bookings.js";
import axios from "axios"
import bookingDetails from "../../models/confirmBooking.js";
import guestModel from "../../models/guestDetails.js"
import holdData from "../../models/holdBooking.js"

export const addConfirmBooking = async (req, res) => {
  try {

    const reservationNumber = req.body.reservationNumber

    const data = await holdData.find({reservationNumber:reservationNumber})
    
  
    var reservationIds = []
    data.forEach(async (item) => {
      const { guestId, guestName, salutation, phoneNumber, emailAddress, reservationId, propertyId, bookingId, roomTypeId, checkInDate, checkOutDate, bookingTime, inventory, reservationNumber } = item;
      
      reservationIds.push(reservationId)
      // Here, you can create a new object or perform any operation with the extracted fields and store it in another collection
      // For example, you can use a new model and save the extracted fields to another collection
      const newData = new bookingDetails({
        guestId,
        guestName,
        salutation,
        phoneNumber,
        emailAddress,
        reservationId,
        propertyId,
        bookingId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        bookingTime,
        inventory,
        reservationNumber,
      });


    
      // Save the newData to the new collection
      await newData.save();
    });

    const deleteData = await holdData.deleteMany({reservationNumber: reservationNumber})

 
    // for(let i = 0 ; i < data.length; i++){
    //       const guestBookingDetails = new bookingDetails({
    //           guestName: guest.guestName[0].guestName,
    //           salutation: guest.salutation[0].salutation,
    //           phoneNumber: guest.phoneNumber[0].phoneNumber,
    //           emailAddress: guest.emailAddress[0].emailAddress,
    //           propertyId : guestData.propertyId,
    //           checkInDate :guestData.checkInDate,
    //           checkOutDate : guestData.checkOutDate,
    //           guestId : guestData.guestId,
    //           reservationNo: reservationNumber[i],
    //           roomTypeId: guestData.roomTypeId,
    //         });
            
    //         await guestBookingDetails.save();

  

      
    // }

    return res.status(200).json({message:"Booking created successfully" ,reservationNumber : reservationNumber, reservationIds})

  } catch (error) {
    console.error('Error retrieving records:', error);
    // Send an error response to the client
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



