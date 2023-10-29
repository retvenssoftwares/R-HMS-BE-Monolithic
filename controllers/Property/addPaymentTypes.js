import randomstring from 'randomstring'
import paymentTypeModel from '../../models/paymentTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'

const addPaymentType = async (req, res) => {
    try {
        const {userId, shortCode, paymentMethodName, paymentType, propertyId, receivedTo } = req.body
        const authCodeValue = req.headers['authcode']

        const findUser = await verifiedUser.findOne({ userId })

        if (!findUser) {
            return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
        }
        let userRole = findUser.role[0].role
        const result = await findUserByUserIdAndToken(userId, authCodeValue)

        if (result.success) {
            const createPaymentType = new paymentTypeModel({
                shortCode: [{
                    shortCode: shortCode,
                    logId: randomstring.generate(10)
                }],
                paymentTypeId: randomstring.generate(8),
                propertyId,
                paymentMethodName: [{
                    paymentMethodName: paymentMethodName,
                    logId: randomstring.generate(10)
                }],
                paymentType: [{
                    paymentType: paymentType,
                    logId: randomstring.generate(10)
                }],
                receivedTo: [{
                    receivedTo: receivedTo,
                    logId: randomstring.generate(10)
                }],
                createdBy: userRole,
                createdOn: await getCurrentUTCTimestamp(),
                modifiedBy: [],
                modifiedOn: []
            });
            await createPaymentType.save();
            return res.status(200).json({ message: "Payment type successfully added", statuscode: 200 })
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }

}


export default addPaymentType;