import discountTypeModel from "../../models/discountType.js";
import * as dotenv from "dotenv";
dotenv.config();
import userModel from "../../models/verifiedUsers.js"
import randomString from "randomstring"
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";
import discountTypeLog from "../../models/LogModels/discountTypeLogs.js"

export const addDiscountType = async (req, res) => {
     try{
          const {
            userId,
            propertyId,
            shortCode,
            discountTypeId,
            discountTypeName,
            discountValue,
            discountType,
            discountPercent,
            discountPrice,
            deviceType,
            ipAddress,

          }= req.body;

          const authCodeValue = req.headers['authcode']
        const findUser = await userModel.findOne({ userId })
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
          }

          const result = await findUserByUserIdAndToken(userId, authCodeValue)
         
          if (result.success) {
            let userRole = findUser.role[0].role
            const currentUTCTime = await getCurrentUTCTimestamp();
            const newDiscountType = new discountTypeModel({
                  propertyId,
                  shortCode: [{
                    shortCode: shortCode,
                    logId: randomString.generate(10)
                  }],
                  displayStatus: [{ displayStatus: "1", logId: randomString.generate(10) }],
                  discountTypeId: randomString.generate(8),
                  createdBy: userRole,
                  createdOn: currentUTCTime,
                  modifiedBy: [],
                  modifiedOn: [],
                  discountTypeName: [
                    {
                        discountTypeName: discountTypeName,
                        logId: randomString.generate(10)
                    },
                  ],
                  discountValue: [
                    {
                        discountValue: discountValue,
                        logId: randomString.generate(10)
                    },
                  ],
                  discountType : [
                    {
                        discountType: discountType,
                        logId: randomString.generate(10)
                    },
                  ],
                  discountPercent: [{
                    discountPercent: discountPercent,
                    logId: randomString.generate(10)
                  }],
                  discountPrice: [
                    {
                        discountPrice: discountPrice,
                        logId: randomString.generate(10)
                    },
                  ],

            });
            const savedDiscountLogs = await newDiscountType.save()

            const addDiscountTypeLog = new discountTypeLog({

              userId: savedDiscountLogs.userId,
              propertyId: savedDiscountLogs.propertyId,
              discountTypeId: savedDiscountLogs.discountTypeId,
              createdBy: savedDiscountLogs.createdBy,
              createdOn: savedDiscountLogs.createdOn,
              shortCode: [{
                shortCode: savedDiscountLogs.shortCode[0].shortCode,
                logId: savedDiscountLogs.shortCode[0].logId,
                userId: userId,
                deviceType: deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime,
            }],
              displayStatus: [{
              displayStatus: savedDiscountLogs.displayStatus[0].displayStatus,
                logId: savedDiscountLogs.displayStatus[0].logId,
                userId: userId,
                deviceType: deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime,
            }],
            discountTypeName: [{
              discountTypeName: savedDiscountLogs.discountTypeName[0].discountTypeName,
                logId: savedDiscountLogs.discountTypeName[0].logId,
                userId: userId,
                deviceType: deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime,
            }],
            discountValue: [{
              discountValue: savedDiscountLogs.discountValue[0].discountValue,
                logId: savedDiscountLogs.discountValue[0].logId,
                userId: userId,
                deviceType: deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime,
            }],
            discountType: [{
              discountType: savedDiscountLogs.discountType[0].discountType,
                logId: savedDiscountLogs.discountType[0].logId,
                userId: userId,
                deviceType: deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime,
            }],
            discountPercent: [{
              discountPercent: savedDiscountLogs.discountPercent[0].discountPercent,
                logId: savedDiscountLogs.discountPercent[0].logId,
                userId: userId,
                deviceType: deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime,
            }],
            discountPrice: [{
              discountPrice: savedDiscountLogs.discountPrice[0].discountPrice,
                logId: savedDiscountLogs.discountPrice[0].logId,
                userId: userId,
                deviceType: deviceType,
                ipAddress:ipAddress,
                modifiedOn:currentUTCTime,
            }],


            })
            await addDiscountTypeLog.save();
            return res.status(200).json({ message: "discountType added successfully", statuscode: 200 })

        } else {
          return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }   

     }catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}
export default addDiscountType


