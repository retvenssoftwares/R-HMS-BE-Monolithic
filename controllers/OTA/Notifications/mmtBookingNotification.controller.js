import { parseString, Builder } from 'xml2js';
import BookingNotificationMMT from '../../../models/Notifications/mmtBookingNotification.js';

const pushBookingNotificationMMT = async (req, res) => {
    const xmlData = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Booking HotelCode="1000000025">
      <BookingId>0000057475</BookingId>
      <CustomerName>Vaddy Jain</CustomerName>
      <NoOfRooms>1</NoOfRooms>
      <NoOfNights>1</NoOfNights>
      <RoomTypeName>Deluxe Room</RoomTypeName>
      <CheckInDate>2017-11-15</CheckInDate>
      <Status>booked</Status>
      <PayAtHotelFlag>False</PayAtHotelFlag>
      <BookingTime>2017-10-26 18:15:43</BookingTime>
      <BookingVendorName>Goibibo</BookingVendorName>
    </Booking>
  `;

    // Convert XML to JSON
    parseString(xmlData, { explicitArray: false, mergeAttrs: true }, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
        } else {
            const bookingData = result.Booking;
            console.log(result)

            // Create a new document using Mongoose model
            const newBookingNotification = new BookingNotificationMMT({
                Booking: {
                    bookingId: bookingData.BookingId,
                    customerName: bookingData.CustomerName,
                    noOfRooms: parseInt(bookingData.NoOfRooms),
                    noOfNights: parseInt(bookingData.NoOfNights),
                    roomTypeName: bookingData.RoomTypeName,
                    checkInDate: bookingData.CheckInDate,
                    status: bookingData.Status,
                    payAtHotelFlag: bookingData.PayAtHotelFlag === 'True',
                    bookingTime: new Date(bookingData.BookingTime),
                    bookingVendorName: bookingData.BookingVendorName
                }
            });

            // Save the document to the database
            newBookingNotification.save()
                .then(savedBooking => {
                    console.log('Booking notification saved:');
                })
                .catch(error => {
                    console.error('Error saving booking notification:', error);
                });
        }

        // Function to convert JSON to XML
        const convertJsonToXml = (jsonData) => {
            const builder = new Builder({ headless: true, renderOpts: { pretty: false } });
            const xmlData = builder.buildObject({ root: jsonData });

            return xmlData;
        };

        const xmlData = convertJsonToXml(result);
        console.log(xmlData);
    });

}
export default pushBookingNotificationMMT

