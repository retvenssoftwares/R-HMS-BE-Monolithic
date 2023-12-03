import taxTypeModel from "../../models/taxType.js";
import { findUserByUserIdAndToken, validateHotelCode, convertTimestampToCustomFormat } from "../../helpers/helper.js";
const getTaxType = async (req, res) => {
    try {
        const { propertyId, userId, targetTimeZone } = req.query
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
            const findTaxType = await taxTypeModel.find({ propertyId: propertyId, "displayStatus.0.displayStatus": "1"}).sort({_id:-1}).lean();
            
            if (findTaxType.length > 0) {
                const taxTypeData = findTaxType.map((taxType) => {
                    const convertedDateUTC = convertTimestampToCustomFormat(taxType.createdOn, targetTimeZone);
                    let convertedModifiedOn;
                    if (taxType.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(taxType.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    const modifiedBy = taxType.modifiedBy.length > 0 ? taxType.modifiedBy[0].modifiedBy : "";

                    return {
                        ...taxType._doc,
                        propertyId: taxType.propertyId || "",
                        taxId: taxType.taxId || '',
                        taxTypeName: taxType.taxTypeName[0].taxTypeName || "",
                        shortCode: taxType.shortCode[0].shortCode || "",
                        taxType: taxType.taxType[0].taxType || "",
                        isSlabs: taxType.isSlabs[0].isSlabs || "",
                        slabs: taxType.slabs[0].slabs[0] || "",
                        applyAfter: taxType.applyAfter[0].applyAfter[0] || "",
                        taxRate: taxType.taxRate[0].taxRate[0] || "",
                        createdOn: convertedDateUTC,
                        createdBy: taxType.createdBy || '',
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn || '',
                    }
                })
                return res.status(200).json({ data: taxTypeData, statuscode: 200 });

            } else {
                return res.status(200).json({ message: "No taxType found", status: 200 });
            }


        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};
export default getTaxType;