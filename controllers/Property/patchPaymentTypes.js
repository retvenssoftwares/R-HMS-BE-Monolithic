import paymentTypeModel from '../../models/paymentTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'

const patchPaymentType = async (req, res) => {
    try {
        const { userId } = req.query;
        const { shortCode, paymentMethodName, receivedTo } = req.body;
        const paymentTypeId = req.params.paymentTypeId;
        const authCodeValue = req.headers['authcode'];

        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        const findUser = await verifiedUser.findOne({ userId });
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }

        let userRole = findUser.role[0].role;
        if (result.success) {
            const findPaymentType = await paymentTypeModel.findOne({ paymentTypeId });

            if (!findPaymentType || !paymentTypeId) {
                return res.status(404).json({ message: "Payment type not found", statuscode: 404 });
            }

            if (shortCode) {
                findPaymentType.shortCode = shortCode;
            }

            const currentUTCTime = await getCurrentUTCTimestamp();

            if (paymentMethodName) {
                const paymentMethodNameObject = {
                    paymentMethodName: paymentMethodName
                };
                findPaymentType.paymentMethodName.unshift(paymentMethodNameObject);
            }

            if (receivedTo) {
                const receivedToObject = {
                    receivedTo: receivedTo
                };
                findPaymentType.receivedTo.unshift(receivedToObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole
            };

            findPaymentType.modifiedBy.unshift(modifiedByObject);
            findPaymentType.modifiedOn.unshift({ modifiedOn: currentUTCTime });

            const updatedPaymentType = await findPaymentType.save();

            if (updatedPaymentType) {
                return res.status(200).json({ message: "Payment type successfully updated", statuscode: 200 });
            }

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default patchPaymentType;
