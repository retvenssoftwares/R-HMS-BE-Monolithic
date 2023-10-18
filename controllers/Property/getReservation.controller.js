import * as dotenv from "dotenv";
dotenv.config();
import reservationModel from "../../models/reservationType.js";
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
    try {
        const { targetTimeZone } = req.query;
        const propertyId = req.params.propertyId;

        const reservationType = await reservationModel.find({ propertyId: propertyId });

        if (reservationType.length > 0) {
            // Assuming userTimeZone holds the user's specified time zone
            const convertedProperties = reservationType.map(reservation => {
                // Convert the dateUTC to the user's time zone
                const convertedDateUTC = convertTimestampToCustomFormat(reservation.dateUTC, targetTimeZone);

                // Include the converted date and modifiedOn in the property object
                return { ...reservation._doc, dateUTC: convertedDateUTC,};
            });

            return res.status(200).json({ userProperties: convertedProperties, statuscode: 200 });
        } else {
            return res.status(404).json({ error: "No property found", statuscode: 404 });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};

export default userProperty;
