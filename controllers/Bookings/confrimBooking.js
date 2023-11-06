import bookingModel from "../../models/bookings.js";
import axios from "axios"
import bookingDetails from "../../models/confirmBooking.js";
import guestModel from "../../models/guestDetails.js"
import holdData from "../../models/holdBooking.js"
import { getCurrentLocalTimestamp } from "../../helpers/helper.js";

export const addConfirmBooking = async(req,res)=>{

const{checkIn  , checkOut} = req.body

 const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormatRegex.test(checkIn) || !dateFormatRegex.test(checkOut)) {
      return res.status(400).json({ message: "Please enter the date in the correct format (yyyy-mm-dd)", statuscode: 400 });
  }
  

  const headersData = req.body.headersData

  const apiUrl = `https://api.hotelratna.com/api/getRoomAvailability?userId=${req.body.userId}&propertyId=${req.body.propertyId}&checkInDate=${checkIn}&checkOutDate=${checkOut}`

  const config = {
    headers: {
      'authcode' : headersData
    }
  }

  const time = await getCurrentLocalTimestamp()
  const booking = await bookingModel.findOne({bookingId: req.body.bookingId});
  //console.log(booking.guestId.length)
  const roomDetail = booking.roomDetails;

const dictionary = {};
for (const item of roomDetail) {
  const roomTypeId = item.roomTypeId[0].roomTypeId;
  if (!dictionary[roomTypeId]) {
    dictionary[roomTypeId] = 1;
  } else {
    dictionary[roomTypeId] += 1;
  }
}

console.log(dictionary)

axios.get(apiUrl, { headers: config.headers })
  .then(async (response) => {
    if (response && response.data) {
      const array = response.data.data;
      const result = {};
      for (const item of array) {
        let minInventory = Infinity;
        for (let i = 0; i < item.calculatedInventoryData.length - 1; i++) {
          if (item.calculatedInventoryData[i].inventory < minInventory) {
            minInventory = item.calculatedInventoryData[i].inventory;
          }
        }
        result[item.roomTypeId] = minInventory;
      }

      //console.log(result)
      
      for (let i = 0; i < roomDetail.length; i++) {
        // console.log(roomDetail[i].roomTypeId[0].roomTypeId)
        // console.log(result[roomDetail[i].roomTypeId[0].roomTypeId])
        if(result[roomDetail[i].roomTypeId[0].roomTypeId] === 0){
          return res.status(500).json({message : "No Room Left for Reservation" , satatusCode : 500})
        }else if (
          dictionary[roomDetail[i].roomTypeId[0].roomTypeId] &&
          dictionary[roomDetail[i].roomTypeId[0].roomTypeId] <= result[roomDetail[i].roomTypeId[0].roomTypeId]
        ) {

          if(booking.guestId.length === 1){
            const guestData = await guestModel.findOne({ guestId: booking.guestId[0].guestId});
            const hold = new holdData({
              bookingId: booking.bookingId,
              propertyId : booking.propertyId,
              roomTypeId: roomDetail[i].roomTypeId[0].roomTypeId,
              guestId : booking.guestId[0].guestId,
              bookingTime : time,
              checkInDate : booking.checkIn[0].checkIn,
              checkOutDate : booking.checkOut[0].checkOut,
              inventory: dictionary[roomDetail[i].roomTypeId[0].roomTypeId],
            });
  
            await hold.save();

            // console.log(hold)
          
            const reservationNo = booking.reservationIds[i];
            const guestBookingDetails = new bookingDetails({
              guestName: guestData.guestName[0].guestName,
              salutation: guestData.salutation[0].salutation,
              phoneNumber: guestData.phoneNumber[0].phoneNumber,
              emailAddress: guestData.emailAddress[0].emailAddress,
              bookingId: booking.bookingId,
              propertyId : booking.propertyId,
              checkInDate : booking.checkIn[0].checkIn,
              checkOutDate : booking.checkOut[0].checkOut,
              guestId : booking.guestId[0].guestId,
              reservationNo: reservationNo,
              roomDetails: roomDetail[i],
            });
            //console.log(guestBookingDetails)
            await guestBookingDetails.save();
          }else{
            console.log(booking.guestId.length)
            
              const guestData = await guestModel.findOne({ guestId: booking.guestId[i].guestId});
                  
              //console.log(booking.guestId[i].guestId)
  
              const hold = new holdData({
                bookingId: booking.bookingId,
                roomTypeId: roomDetail[i].roomTypeId[0].roomTypeId,
                propertyId : booking.propertyId,
                guestId : booking.guestId[i].guestId,
                bookingTime : time,
                checkInDate : booking.checkIn[0].checkIn,
                checkOutDate : booking.checkOut[0].checkOut,
                inventory: dictionary[roomDetail[i].roomTypeId[0].roomTypeId],
              });
    
              //console.log("hold")
              await hold.save();
          
              const reservationNo = booking.reservationIds[i];
              const guestBookingDetails = new bookingDetails({
                guestName: guestData.guestName[0].guestName,
                salutation: guestData.salutation[0].salutation,
                phoneNumber: guestData.phoneNumber[0].phoneNumber,
                emailAddress: guestData.emailAddress[0].emailAddress,
                bookingId: booking.bookingId,
                propertyId : booking.propertyId,
                reservationNo: reservationNo,
                checkInDate : booking.checkIn[0].checkIn,
                checkOutDate : booking.checkOut[0].checkOut,
                guestId : booking.guestId[i].guestId,
                roomDetails: roomDetail[i],
              });
              //console.log(guestBookingDetails)
              await guestBookingDetails.save();
          }

        }

      }

      return res.status(200).json({ message: "booking created successfully", statusCode: 200 });
    } else {
      console.error('No data found in the response');
    }
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });

}