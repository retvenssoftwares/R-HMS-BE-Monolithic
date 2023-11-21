import paymentTypeModel from '../../models/paymentTypes.js';
import { convertTimestampToCustomFormat, findUserByUserIdAndToken } from '../../helpers/helper.js';
import properties from '../../models/property.js'

const getPaymentTypes = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']
        
        const findProperty = await properties.findOne({ propertyId:propertyId, userId: userId });
        if (!findProperty) {
            return res.status(404).json({ message: "Please enter valid propertyId and userId", statuscode: 404 })
        }

        const result = await findUserByUserIdAndToken(userId, authCodeValue);

        if (result.success) {
            const findAllPaymentTypes = await paymentTypeModel.find({ propertyId, "displayStatus.0.displayStatus": "1"  }).sort({_id:-1}).lean();
            if (findAllPaymentTypes.length > 0) {
                const convertedPaymentTypes = findAllPaymentTypes.map(paymentType => {
                    const convertedDateUTC = convertTimestampToCustomFormat(paymentType.createdOn, targetTimeZone);
                    let convertedModifiedOn;
                    if (paymentType.modifiedOn.length === 0) {
                        convertedModifiedOn = ""
                    } else {
                        convertedModifiedOn = convertTimestampToCustomFormat(paymentType.modifiedOn[0].modifiedOn, targetTimeZone);
                    }

                    const modifiedBy = paymentType.modifiedBy.length > 0 ? paymentType.modifiedBy[0].modifiedBy : "";

                    return {
                        ...paymentType._doc,
                        createdOn: convertedDateUTC,
                        createdBy: paymentType.createdBy,
                        paymentTypeId: paymentType.paymentTypeId || '',
                        paymentMethodName: paymentType.paymentMethodName[0].paymentMethodName || '',
                        modifiedBy: modifiedBy,
                        modifiedOn: convertedModifiedOn || '',
                        receivedTo: paymentType.receivedTo[0].receivedTo || '',
                        shortCode: paymentType.shortCode[0].shortCode || ''
                    };
                });

                return res.status(200).json({ data: convertedPaymentTypes, statuscode: 200 });
            }
            else {
                return res.status(200).json({ message: "No payment types found", statuscode: 200 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default getPaymentTypes;