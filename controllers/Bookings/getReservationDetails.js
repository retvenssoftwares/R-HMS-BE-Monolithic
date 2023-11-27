import bookingDetails from "../../models/confirmBooking.js";
import bookingModel from "../../models/reservationModel.js";


export const getReservationDetails = async (req, res) => {

    const { reservationNumber } = req.query

    const confirmBookingDetails = await bookingDetails.find({ reservationNumber: reservationNumber })

    if (!confirmBookingDetails) {
        return res.status(404).json({ message: "data not found", statusCode: 404 })
    }

    if(confirmBookingDetails)


    if (confirmBookingDetails) {
        var reservationIdsArray = confirmBookingDetails.map((item) => ({
            reservationId: item.reservationId,
            guestName: item.guestName && item.guestName[0] && item.guestName[0].guestName || "",
            roomDetails: item.roomTypeName && item.roomTypeName[0] && item.guestName[0].guestName || "",
            inventory: item.inventory || "",
            arrivalDetails: item.checkInDate && item.checkInDate[0] && item.checkInDate[0].checkInDate || "",
            departureDate: item.checkOutDate && item.checkOutDate[0] && item.checkOutDate[0].checkOutDate || "",
            total: item.reservationRate && item.reservationRate[0] && item.reservationRate[0].roomCharges[0] && item.reservationRate[0].roomCharges[0].grandTotal || "",
            balance: "0"
        }));

    }


    return res.status(200).json({ data: reservationIdsArray, statusCode: 200 })

}