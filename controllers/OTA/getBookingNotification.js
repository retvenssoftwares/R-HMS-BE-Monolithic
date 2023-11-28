import mmtBooking from "../../models/Notifications/mmtBookingNotification.js";
import ota from "../../models/superAdmin/otaModel.js";
import { findUserByUserIdAndToken, validateHotelCode } from "../../helpers/helper.js";
import verifiedUser from "../../models/verifiedUsers.js";


const getBookingNotification = async (req, res) => {
  try {
    const { propertyId, userId, otaId } = req.query;
    const authCodeValue = req.headers['authcode']

    const findUser = await verifiedUser.findOne({ userId: userId })

    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if (result.success) {
      const results = await validateHotelCode(userId, propertyId)
      if (!results.success) {
        return res.status(results.statuscode).json({ message: "Invalid propertyId", statuscode: results.statuscode })
      }

      const otaModel = await ota.findOne({ "otaId.0.otaId": otaId }, 'otaLogo').lean();
      if (!otaModel) {
        return res.status(400).json({ message: "Incorrect otaId entered", statuscode: 400 })
      }
      const otaLogo = otaModel.otaLogo[0]?.otaLogo || "";
      const findNotification = await mmtBooking.find({ propertyId: propertyId }).lean();
      if (!findNotification.length > 0) {
        return res.status(404).json({ message: "Please enter valid otaId", statusCode: 404 });
      }
      if (findNotification.length > 0) {
        const mmtBookingdetail = findNotification.map((booking) => {
          return {
            propertyId: booking.propertyId || '',
            otaId: booking.otaId || '',
            otaLogo: otaLogo || "",
            Booking: {
              bookingId: booking.Booking.bookingId || '',
              customerName: booking.Booking.customerName || '',
              noOfRooms: booking.Booking.noOfRooms || '0',
              noOfNights: booking.Booking.noOfNights || '0',
              roomTypeName: booking.Booking.roomTypeName || '',
              checkInDate: booking.Booking.checkInDate || '',
              status: booking.Booking.status || '',
              hotelCode: booking.Booking.hotelCode || "",
              payAtHotelFlag: booking.Booking.payAtHotelFlag || '',
              bookingTime: booking.Booking.bookingTime || '',
              bookingVendorName: booking.Booking.bookingVendorName || ''
            }
          }

        })
        return res.status(200).json({ data: mmtBookingdetail, statuscode: 200 })
      } else {
        return res.status(200).json({ message: "No booking Notification found", statuscode: 200 })
      }
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
}

export default getBookingNotification;