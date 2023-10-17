import * as dotenv from "dotenv";
dotenv.config();
import roomModel from "../../models/roomType.js";
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
    try {
        const { targetTimeZone } = req.query;
        const propertyId = req.params.propertyId;

        const room = await roomModel.find({ propertyId: propertyId });

        if (room.length > 0) {
            // Assuming userTimeZone holds the user's specified time zone
            const convertedProperties = room.map(room => {
                // Convert the dateUTC to the user's time zone
                const convertedDateUTC = convertTimestampToCustomFormat(room.dateUTC, targetTimeZone);
                // Include the converted date in the property object
                return { ...room._doc, dateUTC: convertedDateUTC };
            });

            return res.status(200).json({ Rooms: convertedProperties, statuscode: 200 });
        } else {
            return res.status(404).json({ error: "No property found", statuscode: 404 });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};

export default userProperty;
