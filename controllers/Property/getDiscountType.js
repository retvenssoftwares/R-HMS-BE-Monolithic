import * as dotenv from "dotenv";
dotenv.config();
import { convertTimestampToCustomFormat, findUserByUserIdAndToken, validateHotelCode } from '../../helpers/helper.js'
import discountTypeModel from '../../models/discountType.js'

const getDiscountTypes = async (req, res) => {
    try {
        const { targetTimeZone, userId, propertyId } = req.query;
        
        const authCodeValue = req.headers['authcode'];
        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const results = await validateHotelCode(userId,propertyId);
            if (!results.success) {
                return res.status(results.statuscode).json({ message: "Please enter a valid propertyId ", statuscode: results.statuscode });
            }
            const discountType = await discountTypeModel.find({ propertyId: propertyId, "displayStatus.0.displayStatus": "1" }).sort({ _id: -1 }).lean();
            
            if (discountType.length > 0) {
                const convertedDiscountType = discountType.map(discount => {
                    const convertedDateUTC = convertTimestampToCustomFormat(discount.createdOn, targetTimeZone);
                    let convertedModifiedOn;
                    if (discount.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                     } else {
                         convertedModifiedOn = convertTimestampToCustomFormat(discount.modifiedOn[0].modifiedOn, targetTimeZone);
                     }
                    const modifiedBy = discount.modifiedBy.length > 0 ? discount.modifiedBy[0].modifiedBy : "";
                    return {
                        ...discount._doc,
                        createdOn: convertedDateUTC,
                        discountTypeId: discount.discountTypeId || '',
                        createdBy: discount.createdBy || '',
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn || '',
                        shortCode: discount.shortCode[0].shortCode || '',
                        discountTypeName: discount.discountTypeName[0].discountTypeName || '',
                        discountValue: discount.discountValue[0].discountValue || '',
                        discountPercent: discount.discountPercent[0].discountPercent || '',
                        discountPrice: discount.discountPrice[0].discountPrice || '',
                        discountType: discount.discountType[0].discountType || ''
                    }
                });

                return res.status(200).json({ data: convertedDiscountType, statuscode: 200 });
            } else {
                return res.status(200).json({ message: "No discount found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getDiscountTypes;
