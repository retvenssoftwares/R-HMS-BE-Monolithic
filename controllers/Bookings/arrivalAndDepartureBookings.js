import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import bookingDetails from "../../models/confirmBooking.js";
import bookingModel from "../../models/reservationModel.js";
import verifiedUser from "../../models/verifiedUsers.js";


export const gerArrivalBookings = async (req, res) => {



    const {propertyId, userId } = req.query

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    const result = await findUserByUserIdAndToken(userId, authCodeValue)

    if (!findUser) {
        return res.status(400).json({ message: "Please enter valid userId", statuscode: 400 })
    }

    if (!result.success) {
        return res.status(404).json({ message: "Invalid token", statuscode: 404 })
    }
   

    const currentDate = new Date();
   const currentDateString = currentDate.toISOString().split('T')[0]; // Get current date in "YYYY-MM-DD" format
    
    
    const confirmBookingDetails = await bookingDetails.find({propertyId});
    if (!confirmBookingDetails) {
        return res.status(404).json({ message: "data not found", statusCode: 404 })
    }
  


    let arrival = []
    let departure = []

    if (confirmBookingDetails) {
        confirmBookingDetails.map((item) => {
            if(item.checkInDate[0].checkInDate.split('T')[0] === currentDateString){
                arrival.push(item)
            }else if(item.checkOutDate[0].checkOutDate.split('T')[0] === currentDateString){
                departure.push(item)
            }
        });
    }

    return res.status(200).json({
        arrival: { data: arrival, statusCode: 200 },
        departure: { data: departure, statusCode: 200 }
      });
      


      
    
    

   


    return res.status(200).json({ data: confirmBookingDetails, statusCode: 200 })

}