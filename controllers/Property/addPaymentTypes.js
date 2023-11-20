import randomstring from 'randomstring'
import paymentTypeModel from '../../models/paymentTypes.js'
import verifiedUser from '../../models/verifiedUsers.js'
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import paymentLog from '../../models/LogModels/paymentLogs.js'

const addPaymentType = async (req, res) => {
    try {
        const {userId, shortCode, paymentMethodName, propertyId, receivedTo,deviceType,ipAddress } = req.body
        const authCodeValue = req.headers['authcode']

        const findUser = await verifiedUser.findOne({ userId })

        if (!findUser) {
            return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
        }
        let userRole = findUser.role[0].role || ''
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        const currentUTCTime=await getCurrentUTCTimestamp()

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
              
                receivedTo: [{
                    receivedTo: receivedTo,
                    logId: randomstring.generate(10)
                }],
                createdBy: userRole,
                createdOn: await getCurrentUTCTimestamp(),
                displayStatus: [{ displayStatus: "1", logId: randomstring.generate(10) }],
                createdOn: currentUTCTime,
                modifiedBy: [],
                modifiedOn: []
            });
            const savedPaymentType= await createPaymentType.save();

            //save data in logs

            const addPaymentLogs = new paymentLog({
                userId:savedPaymentType.userId,
                createdBy:savedPaymentType.createdBy,
                createdOn:savedPaymentType.createdOn,
                propertyId:savedPaymentType.propertyId,
                paymentTypeId:savedPaymentType.paymentTypeId,
                shortCode: [
                    {
                      logId: savedPaymentType.shortCode[0].logId,
                      shortCode: savedPaymentType.shortCode[0].shortCode,
                      userId: userId,
                      deviceType: deviceType,
                      ipAddress:ipAddress,
                      modifiedOn:currentUTCTime,
                    },
                  ],
                  paymentMethodName: [{
                    logId: savedPaymentType.paymentMethodName[0].logId,
                    paymentMethodName: savedPaymentType.paymentMethodName[0].paymentMethodName,
                    userId: userId,
                    deviceType: deviceType,
                    ipAddress:ipAddress,
                    modifiedOn:currentUTCTime,
                }],
                displayStatus: [{
                    logId: savedPaymentType.displayStatus[0].logId,
                    displayStatus: savedPaymentType.displayStatus[0].displayStatus,
                    userId: userId,
                    deviceType: deviceType,
                    ipAddress:ipAddress,
                    modifiedOn:currentUTCTime,
                }],
                receivedTo: [{
                    logId: savedPaymentType.receivedTo[0].logId,
                    receivedTo: savedPaymentType.receivedTo[0].receivedTo,
                    userId: userId,
                    deviceType: deviceType,
                    ipAddress:ipAddress,
                    modifiedOn:currentUTCTime,
                }],
            })

            await addPaymentLogs.save();
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