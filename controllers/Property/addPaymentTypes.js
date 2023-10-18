import randomstring from 'randomstring'
import paymentTypeModel from '../../models/paymentTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'
const addPaymentType = async (req, res) => {
    try {
        const { userId, shortCode, paymentMethodName, paymentType, propertyId, receivedTo } = req.body
        const authCodeValue = req.headers['authcode']
        const findUser = await verifiedUser.findOne({ userId })
        const userToken = findUser.authCode

        if (authCodeValue !== userToken) {
            return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
        }

        let userRole = findUser.role[0].role
        const createPaymentType = new paymentTypeModel({
            shortCode: shortCode,
            paymentTypeId: randomstring.generate(8),
            propertyId,
            paymentMethodName: [{
                paymentMethodName: paymentMethodName
            }],
            paymentType: [{
                paymentType: paymentType
            }],
            receivedTo: [{
                receivedTo: receivedTo
            }],
            createdBy: userRole,
            createdOn: await getCurrentUTCTimestamp(),
            modifiedBy: [],
            modifiedOn: []
        });
        await createPaymentType.save();
        return res.status(200).json({ message: "PaymentType successfully added", statuscode: 200 })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}


export default addPaymentType;