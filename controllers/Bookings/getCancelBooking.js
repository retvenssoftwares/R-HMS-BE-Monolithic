import { findUserByUserIdAndToken } from "../../helpers/helper.js";
import bookingDetails from "../../models/confirmBooking.js";
import bookingModel from "../../models/reservationModel.js";
import verifiedUser from "../../models/verifiedUsers.js";


export const getCancelReservation = async (req, res) => {



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

    const confirmBookingDetails = await bookingDetails.find({
        propertyId,
        cancelStatus : "true"
      });

    if (!confirmBookingDetails) {
        return res.status(404).json({ message: "data not found", statusCode: 404 })
    }

    return res.status(200).json({ data: confirmBookingDetails, statusCode: 200 })

}