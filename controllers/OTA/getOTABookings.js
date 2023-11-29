import bookingDetails from '../../models/confirmBooking.js';
import { findUserByUserIdAndToken } from '../../helpers/helper.js';
const getOTABookings = async (req, res) => {
    try {
        const { userId, otaId } = req.query
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);
        if (!result.success) {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
        const otaBookings = await bookingDetails.find({ isOTABooking: "true", otaId: otaId }).sort({ _id: -1 }).lean();
        if (otaBookings.length <= 0) {
            return res.status(200).json({ message: "No bookings yet", statuscode: 200 });
        }
  
            const mappedOtaBookings = otaBookings.map((booking) => {
                return {
                    ...booking._doc,
                    reservationId: booking.bookingId || "",
                    guestName: booking.guestName[0].guestName || "",
                    numberOfAdults: booking.adults[0].adults || "",
                    numberOfChildren: booking.childs[0].childs || "",
                    numberOfRooms: booking.inventory || 0,
                    numberOfNights: booking.nightCount[0].nightCount || "",
                    bookingDate: booking.bookingTime || "",
                    arrival: booking.checkInDate[0].checkInDate || "",
                    departure: booking.checkOutDate[0].checkOutDate || "",
                    totalRate: booking.reservationRate[0].roomCharges[0].grandTotal || ""
                }
            })
        
        return res.status(200).json({ data: mappedOtaBookings, statuscode: 200 })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error', statuscode: 500 });
    }

}

export default getOTABookings;