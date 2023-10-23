import * as dotenv from "dotenv";
dotenv.config();
// import identityModel from "../../models/property.js";
import { convertTimestampToCustomFormat } from "../../helpers/helper.js";
import identityModel from "../../models/identityTypes.js";

const identityType = async (req, res) => {
    try {
        const { targetTimeZone, propertyId } = req.query;

        const userIdentity = await identityModel.find({ propertyId });

        if (userIdentity.length > 0) {
            // Assuming userTimeZone holds the user's specified time zone
            const convertedIdentity = userIdentity.map(identity => {
                // Convert the dateUTC to the user's time zone
                const convertedDateUTC = convertTimestampToCustomFormat(identity.createdOn, targetTimeZone);
                const convertedModifiedOn = convertTimestampToCustomFormat(identity.modifiedOn[0].modifiedOn, targetTimeZone);
                return {
                    ...identity._doc,
                    createdOn: convertedDateUTC,
                    identityType: identity.identityType[0],
                    modifiedBy: identity.modifiedBy[0],
                    modifiedOn: convertedModifiedOn
                };

            });

            return res.status(200).json({ userIdentity: convertedIdentity, statuscode: 200 });
        } else {
            return res.status(404).json({ error: "No identity found", statuscode: 404 });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message, statusCode: 500 });
    }
};

export default identityType;