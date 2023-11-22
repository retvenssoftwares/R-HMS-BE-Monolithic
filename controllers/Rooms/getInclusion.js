import * as dotenv from "dotenv";
dotenv.config();
import inclusionModel from "../../models/inclusion.js";
import { convertTimestampToCustomFormat, findUserByUserIdAndToken, validateHotelCode } from "../../helpers/helper.js";

const getInclusion = async (req, res) => {
    try {
        const { targetTimeZone, userId, propertyId } = req.query;
        const authCodeValue = req.headers['authcode']

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            if (!propertyId) {
                return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 })
            }

            const result = await validateHotelCode(userId, propertyId)
            if (!result.success) {
                return res.status(result.statuscode).json({ message: "Invalid propertyId entered", statuscode: result.statuscode })
            }
            const inclusion = await inclusionModel.find({ propertyId: propertyId, "displayStatus.0.displayStatus": "1"  }).sort({_id:-1}).lean();
            if (inclusion.length > 0) {
                const convertedInclusion = inclusion.map(inclusion => {
                    // Convert the dateUTC to the user's time zone
                    const convertedDateUTC = convertTimestampToCustomFormat(inclusion.createdOn, targetTimeZone);
                    var convertedModifiedOn = ''
                    if (inclusion.modifiedOn.length === 0) {
                        convertedModifiedOn = ''
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(inclusion.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    const modifiedBy = inclusion.modifiedBy.length > 0 ? inclusion.modifiedBy[0].modifiedBy : "";

                    return {
                        propertyId:inclusion.propertyId,
                        createdOn: convertedDateUTC,
                        inclusionId: inclusion.inclusionId,
                        inclusionName: inclusion.inclusionName[0].inclusionName || '',
                        charge: inclusion.charge[0].charge || {},
                        inclusionType: inclusion.inclusionType[0].inclusionType || '',
                        chargeRule: inclusion.chargeRule[0].chargeRule || '',
                        postingRule: inclusion.postingRule[0].postingRule || '',
                        modifiedOn: convertedModifiedOn,
                        modifiedBy: modifiedBy,
                        createdBy: inclusion.createdBy,
                        shortCode: inclusion.shortCode[0].shortCode || ''
                    };

                });
                return res.status(200).json({ data: convertedInclusion, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No inclusion found",count:"0",  statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", statusCode: 500 });
    }

};


export default getInclusion;