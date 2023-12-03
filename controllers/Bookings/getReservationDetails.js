import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import bookingDetails from "../../models/confirmBooking.js";
import bookingModel from "../../models/reservationModel.js";
import verifiedUser from "../../models/verifiedUsers.js";


export const getReservationDetails = async (req, res) => {



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
    //console.log(currentDateString)
     

    const confirmBookingDetails = await bookingDetails.find({
        propertyId,
       bookingTime: { $regex: new RegExp(`^${currentDateString}`) }
      });

    if (!confirmBookingDetails) {
        return res.status(404).json({ message: "data not found", statusCode: 404 })
    }


    // if (confirmBookingDetails) {
    //     var reservationIdsArray = confirmBookingDetails.map((item) => ({
    //         reservationId: item.reservationId,
    //         guestName: item.guestName && item.guestName[0] && item.guestName[0].guestName || "",
    //         roomDetails: item.roomTypeName && item.roomTypeName[0] && item.guestName[0].guestName || "",
    //         inventory: item.inventory || "",
    //         arrivalDetails: item.checkInDate && item.checkInDate[0] && item.checkInDate[0].checkInDate || "",
    //         departureDate: item.checkOutDate && item.checkOutDate[0] && item.checkOutDate[0].checkOutDate || "",
    //         total: item.reservationRate && item.reservationRate[0] && item.reservationRate[0].roomCharges[0] && item.reservationRate[0].roomCharges[0].grandTotal || "",
    //         adult: item.adults && item.adults[0] && item.adults[0].adults || "",
    //         child: item.childs && item.childs[0] && item.childs[0].childs || "",
    //         nightCount: item.nightCount && item.nightCount[0] && item.nightCount[0].nightCount || "",
    //         balance: "0"
    //     }));

    // }


    return res.status(200).json({ data: confirmBookingDetails, statusCode: 200 })

}