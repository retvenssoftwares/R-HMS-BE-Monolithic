import * as dotenv from "dotenv";
dotenv.config();
import bookingModel from "../../models/bookingSource.js";
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
    try {
        const { targetTimeZone } = req.query;
        const propertyId = req.params.propertyId;

        const bookingSource = await bookingModel.find({ propertyId: propertyId });

        if (bookingSource.length > 0) {
            // Assuming userTimeZone holds the user's specified time zone
            const convertedBooking = bookingSource.map(booking => {
                if (booking.bookingSource.length > 0) {
                    // Convert the dateUTC to the user's time zone
                    const convertedDateUTC = convertTimestampToCustomFormat(booking.dateUTC, targetTimeZone);
                    const convertedDateCreatedOn = convertTimestampToCustomFormat(booking.createdOn, targetTimeZone);
                    const zeroPositionObject = booking.bookingSource[0];
                    if (zeroPositionObject.modifiedOn) {
                        // Convert the modifiedOn in the zero position object
                        zeroPositionObject.modifiedOn = convertTimestampToCustomFormat(zeroPositionObject.modifiedOn, targetTimeZone);
                    }
                    // Include the converted date and modifiedOn in the property object
                    return { ...booking._doc, dateUTC: convertedDateUTC, createdOn:convertedDateCreatedOn, bookingSource: [zeroPositionObject] };
                }
               return { ...booking._doc,dateUTC:null,createdOn:null, bookingSource: [] };
            });

            return res.status(200).json({ bookingSource: convertedBooking, statuscode: 200 });
        } else {
            return res.status(404).json({ error: "No property found", statuscode: 404 });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};

export default userProperty;
