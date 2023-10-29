import * as dotenv from "dotenv";
dotenv.config();
import propertyModel from "../../models/property.js";
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";

const userProperty = async (req, res) => {
    try {
        const { targetTimeZone } = req.query;
        const userId = req.query.userId;

        const authCodeValue = req.headers['authcode']
        const userProperties = await propertyModel.find({ userId: userId });
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            if (userProperties.length > 0) {
                const convertedProperties = userProperties.map(property => {
                    const convertedDateUTC = convertTimestampToCustomFormat(property.createdOn, targetTimeZone);
                    return { ...property._doc, createdOn: convertedDateUTC };
                });

                return res.status(200).json({ data: convertedProperties, statuscode: 200 });
            } else {
                return res.status(404).json({ message: "No property found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
    }
};

export default userProperty;
