import * as dotenv from "dotenv";
dotenv.config();
import verifying from "../../models/verifiedUsers.js";
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from "../../helpers/helper.js";
import identityModel from "../../models/identityTypes.js";
import properties from '../../models/property.js'

const identityType = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;

        const findProperty = await properties.findOne({ propertyId:propertyId, userId: userId });
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid propertyId and userId", statuscode: 404 })
        }
        const findUser = await verifying.findOne({ userId: userId })

        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }

        const authCodeDetails = req.headers["authcode"]
        const result = await findUserByUserIdAndToken(userId, authCodeDetails)


        if (result.success) {
            const userIdentity = await identityModel.find({ propertyId, "displayStatus.0.displayStatus": "1" }).lean();
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

                    const modifiedBy = identity.modifiedBy.length > 0 ? identity.modifiedBy[0].modifiedBy : "";
                    return {
                        ...identity._doc,
                        createdOn: convertedDateUTC,
                        identityTypeId: identity.identityTypeId || '',
                        createdBy: identity.createdBy,
                        shortCode: identity.shortCode[0].shortCode || '',
                        identityType: identity.identityType[0].identityType || '',
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn
                    };

                });
                return res.status(200).json({ data: convertedIdentity, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No identities found", statuscode: 200 });
            }

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
    }
};

export default identityType;