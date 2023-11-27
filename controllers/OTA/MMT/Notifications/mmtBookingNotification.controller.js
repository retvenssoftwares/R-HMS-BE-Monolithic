import { parseStringPromise } from 'xml2js';
import BookingNotificationMMT from '../../../../models/Notifications/mmtBookingNotification.js';
import roomAndRateMap from '../../../../models/OTAs/mappedRoomsAndRates.js';
const pushBookingNotificationMMT = async (req, res) => {
    try {
        const { otaId, propertyId } = req.query;
        const xmlData = req.body; // Assuming the XML data is in the request body
        // console.log(xmlData,"hgcgh")
        // Convert XML to JSON using promises
        const result = await parseStringPromise(xmlData, { explicitArray: false, mergeAttrs: true });

        const bookingData = result.Booking;
        // console.log(typeof bookingData.HotelCode)
        // console.log(bookingData.HotelCode)
        // console.log(result);

        const getIds = await roomAndRateMap.findOne({ OTAHotelCode: bookingData.HotelCode }, 'otaId propertyId').lean()
        // console.log(getIds, "asda")
        // console.log(getIds.propertyId, getIds.otaId)
        // Create a new document using Mongoose model
        const newBookingNotification = new BookingNotificationMMT({
            propertyId: getIds.propertyId || "",
            otaId: getIds.otaId || "",
            Booking: {
                bookingId: bookingData.BookingId,
                customerName: bookingData.CustomerName,
                noOfRooms: parseInt(bookingData.NoOfRooms),
                noOfNights: parseInt(bookingData.NoOfNights),
                roomTypeName: bookingData.RoomTypeName,
                checkInDate: bookingData.CheckInDate,
                status: bookingData.Status,
                hotelCode: bookingData.HotelCode,
                payAtHotelFlag: bookingData.PayAtHotelFlag === 'True',
                bookingTime: new Date(bookingData.BookingTime),
                bookingVendorName: bookingData.BookingVendorName
            }
        });

        // Save the document to the database
        const savedBooking = await newBookingNotification.save();
        // console.log('Booking notification saved:', savedBooking);

        return res.status(200).json({ message: 'Booking notification saved successfully', statuscode: 200 });
    } catch (error) {
        console.error('Error parsing XML:', error);
        return res.status(500).json({ message: 'Internal Server Error', statuscode: 500 });
    }
};

export default pushBookingNotificationMMT;
