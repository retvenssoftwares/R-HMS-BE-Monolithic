import * as dotenv from "dotenv";
dotenv.config();
// import identityModel from "../../models/property.js";
import { convertTimestampToCustomFormat,findUserByUserIdAndToken } from "../../helpers/helper.js";
import identityModel from "../../models/identityTypes.js";

const identityType = async (req, res) => {
    try {
        const { targetTimeZone, propertyId,userId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if(result.success){
        const userIdentity = await identityModel.find({ propertyId:propertyId });

        if (userIdentity) {
            // Assuming userTimeZone holds the user's specified time zone
            const convertedIdentity = userIdentity.map(identity => {
                // Convert the dateUTC to the user's time zone
                const convertedDateUTC = convertTimestampToCustomFormat(identity.createdOn, targetTimeZone);
                let convertedModifiedOn;
                    if (identity.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(identity.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                return {
                    ...identity._doc,
                    createdOn: convertedDateUTC,
                    identityType: identity.identityType[0],
                    modifiedBy: identity.modifiedBy[0],
                    modifiedOn: convertedModifiedOn
                };

            });

            return res.status(200).json({ data: convertedIdentity, statuscode: 200 });
        } else {
            return res.status(404).json({ error: "No identity found", statuscode: 404 });
        }

    } else {
        return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
};

export default identityType;