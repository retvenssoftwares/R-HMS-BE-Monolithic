import paymentTypeModel from '../../models/paymentTypes.js';
import { convertTimestampToCustomFormat, verifyUser } from '../../helpers/helper.js';

const getPaymentTypes = async (req, res) => {
    try {
        const { targetTimeZone, propertyId, userId } = req.query;
        const authCodeValue = req.headers['authcode']
        const findAllPaymentTypes = await paymentTypeModel.find({ propertyId });

        const result = await verifyUser(userId, authCodeValue);

        if (result.success) {
            if (findAllPaymentTypes.length > 0) {
                const convertedPaymentTypes = findAllPaymentTypes.map(paymentType => {
                    const convertedDateUTC = convertTimestampToCustomFormat(paymentType.createdOn, targetTimeZone);

                    const convertedModifiedOn = convertTimestampToCustomFormat(paymentType.modifiedOn[0].modifiedOn, targetTimeZone);
                    return {
                        ...paymentType._doc,
                        createdOn: convertedDateUTC,
                        paymentMethodName: paymentType.paymentMethodName[0],
                        modifiedBy: paymentType.modifiedBy[0],
                        modifiedOn: convertedModifiedOn,
                        receivedTo: paymentType.receivedTo[0],
                    };
                });

                return res.status(200).json({ paymentTypes: convertedPaymentTypes, statuscode: 200 });
            }
            else {
                return res.status(404).json({ error: "No payment types found", statuscode: 404 });
            }
        } else {
            return res.status(result.statuscode).json({ message: result.message });
        }


    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default getPaymentTypes;
