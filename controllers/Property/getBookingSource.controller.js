import * as dotenv from "dotenv";
dotenv.config();
import bookingModel from "../../models/bookingSource.js";
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";

const bookingSourcesGet = async (req, res) => {
    try {
        const { targetTimeZone, userId, propertyId } = req.query;

        const bookingSource = await bookingModel.find({ propertyId: propertyId });
        const authCodeValue = req.headers['authcode']
        const result = await findUserByUserIdAndToken(userId, authCodeValue)

        if (result.success) {
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
                        return { ...booking._doc, dateUTC: convertedDateUTC, createdOn: convertedDateCreatedOn, bookingSource: [zeroPositionObject] };
                    }
                    return { ...booking._doc, dateUTC: null, createdOn: null, bookingSource: [] };
                });

                return res.status(200).json({ data: convertedBooking, statuscode: 200 });
            } else {
                return res.status(404).json({ error: "No booking sources found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default bookingSourcesGet;
