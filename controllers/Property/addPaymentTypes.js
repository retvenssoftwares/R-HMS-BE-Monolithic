import paymentTypeModel from '../../models/paymentTypes.js'
import userModel from '../../models/user.js'
import { getCurrentUTCTimestamp } from '../../helpers/helper.js'
const addPaymentType = async (req, res) => {
    try {
        const { userId, shortCode, paymentMethodName, paymentType, createdOn, modifiedBy, modifiedOn } = req.body
        const findUser = await userModel.findOne({ userId })
        let userRole = findUser.role[0].role
        const createPaymentType = new paymentTypeModel({
            shortCode: shortCode,
            paymentMethodName: [{
                paymentMethodName: paymentMethodName
            }],
            paymentType: [{
                paymentType: paymentType
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