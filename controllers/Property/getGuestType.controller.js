import * as dotenv from "dotenv";
dotenv.config();
import { convertTimestampToCustomFormat, findUserByUserIdAndToken, validateHotelCode } from '../../helpers/helper.js'
import guestTypeModel from '../../models/guestType.js';

const getGuestTypes = async (req, res) => {
    try {
        const { targetTimeZone, userId, propertyId } = req.query;
        
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const results = await validateHotelCode(userId,propertyId);
            if (!results.success) {
                return res.status(results.statuscode).json({ message: "Please enter a valid propertyId ", statuscode: results.statuscode });
            }
            const guestType = await guestTypeModel.find({ propertyId: propertyId, "displayStatus.0.displayStatus": "1" }).sort({ _id: -1 }).lean();

            if (guestType.length > 0) {
                const convertedGuestType = guestType.map(guestType => {
                    const convertedDateUTC = convertTimestampToCustomFormat(guestType.createdOn, targetTimeZone);
                    let convertedModifiedOn;
                    if (guestType.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                     } else {
                         convertedModifiedOn = convertTimestampToCustomFormat(guestType.modifiedOn[0].modifiedOn, targetTimeZone);
                     }
                    const modifiedBy = guestType.modifiedBy.length > 0 ? guestType.modifiedBy[0].modifiedBy : "";
                    return {
                        ...guestType._doc,
                        createdOn: convertedDateUTC,
                        guestId: guestType.guestId || '',
                        createdBy: guestType.createdBy || '',
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn || '',
                        shortCode: guestType.shortCode[0].shortCode || '',
                        guestTypeName: guestType.guestTypeName[0].guestTypeName || ''
                    };
                });

                return res.status(200).json({ data: convertedGuestType, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No guest found", count: "0", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getGuestTypes;
