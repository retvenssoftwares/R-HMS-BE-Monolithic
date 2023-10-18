import paymentTypeModel from '../../models/paymentTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'

const patchPaymentType = async (req, res) => {
    try {
        const { userId, shortCode, paymentMethodName, receivedTo } = req.body;
        const paymentTypeId = req.params.paymentTypeId;
        const authCodeValue = req.headers['authcode'];
        const findUser = await verifiedUser.findOne({ userId });
        const userToken = findUser.authCode;
        let userRole = findUser.role[0].role;

        if (authCodeValue !== userToken) {
            return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
        }

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
            return res.status(200).json({ message: "Payment type successfully updated" });
        } else {
            return res.status(404).json({ message: "Property not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default patchPaymentType;
