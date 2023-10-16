import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
    try {
        const { targetTimeZone } = req.query;
        const userId = req.params.userId;

        const userProperties = await propertyModel.find({ userId: userId });

        if (userProperties.length > 0) {
            // Assuming userTimeZone holds the user's specified time zone
            const convertedProperties = userProperties.map(property => {
                // Convert the dateUTC to the user's time zone
                const convertedDateUTC = convertTimestampToCustomFormat(property.dateUTC, targetTimeZone);
                // Include the converted date in the property object
                return { ...property._doc, dateUTC: convertedDateUTC };
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
