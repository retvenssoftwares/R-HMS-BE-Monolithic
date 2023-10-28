import randomstring from 'randomstring'
import paymentTypeModel from '../../models/paymentTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
const addPaymentType = async (req, res) => {
    try {
        const { userId } = req.query
        const { shortCode, paymentMethodName, paymentType, propertyId, receivedTo } = req.body
        const authCodeValue = req.headers['authcode']

        const findUser = await verifiedUser.findOne({ userId })

        if (!findUser) {
            return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
        }
        let userRole = findUser.role[0].role
        const result = await findUserByUserIdAndToken(userId, authCodeValue)

        if (result.success) {
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
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}


export default addPaymentType;