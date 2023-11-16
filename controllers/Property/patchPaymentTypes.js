import randomString from 'randomstring'
import paymentTypeModel from '../../models/paymentTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'

const patchPaymentType = async (req, res) => {
    try {
        const { userId } = req.query;
        const { shortCode, paymentMethodName, receivedTo, displayStatus} = req.body;
        const paymentTypeId = req.query.paymentTypeId;
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
                const shortCodeObject = {
                    shortCode: shortCode,
                    logId: randomString.generate(10)
                };
                findPaymentType.shortCode.unshift(shortCodeObject);
            }

            const currentUTCTime = await getCurrentUTCTimestamp();

            if (paymentMethodName) {
                const paymentMethodNameObject = {
                    paymentMethodName: paymentMethodName,
                    logId: randomString.generate(10)
                };
                findPaymentType.paymentMethodName.unshift(paymentMethodNameObject);
            }

            if (receivedTo) {
                const receivedToObject = {
                    receivedTo: receivedTo,
                    logId: randomString.generate(10)
                };
                findPaymentType.receivedTo.unshift(receivedToObject);
            }

            if (displayStatus) {
                const displayStatusObject = {
                    displayStatus: displayStatus,
                    logId: Randomstring.generate(10)
                };
                findPaymentType.displayStatus.unshift(displayStatusObject);
            }

            const modifiedByObject = {
                modifiedBy: userRole,
                logId: randomString.generate(10)
            };

            findPaymentType.modifiedBy.unshift(modifiedByObject);
            findPaymentType.modifiedOn.unshift({ modifiedOn: currentUTCTime, logId: randomString.generate(10) });

            const updatedPaymentType = await findPaymentType.save();

            if (updatedPaymentType) {
                return res.status(200).json({ message: "Payment type successfully updated", statuscode: 200 });
            }

        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
}

export default patchPaymentType;
