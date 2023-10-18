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
            const convertedProperties = userProperties.map(property => {
                const convertedDateUTC = convertTimestampToCustomFormat(property.dateUTC, targetTimeZone);
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
