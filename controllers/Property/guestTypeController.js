import guestTypeModel from "../../models/guestType.js";
import * as dotenv from "dotenv";
dotenv.config();
import userModel from "../../models/verifiedUsers.js"
import randomString from "randomstring"
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";
import guestLogs from  "../../models/LogModels/guestTypeLogs.js"
export const addGuestType = async (req, res) => {
    try{
        const { userId } = req.body
        const {
            propertyId,
            shortCode,
            guestId,
            guestTypeName,
            deviceType,
            ipAddress,

        } = req.body;
        const authCodeValue = req.headers['authcode']
        const findUser = await userModel.findOne({ userId })
        if (!findUser) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
          }

          const result = await findUserByUserIdAndToken(userId, authCodeValue)
         
          if (result.success) {
            let userRole = findUser.role[0].role
            const currentUTCTime = await getCurrentUTCTimestamp();
            
            const newGuestType = new guestTypeModel({
                propertyId,
                shortCode: [{
                  shortCode: shortCode,
                  logId: randomString.generate(10)
                }],
                guestId: randomString.generate(8),
                displayStatus: [{ displayStatus: "1", logId: randomString.generate(10) }],
                dateUTC: currentUTCTime,
                createdBy: userRole,
                createdOn: currentUTCTime,
                modifiedBy: [],
                modifiedOn: [],
                guestTypeName: [
                    {
                        guestTypeName: guestTypeName,
                        logId: randomString.generate(10)
                    },
                  ],
            });

            const savedGuest = await newGuestType.save()
            
            const addGuestLogs = new guestLogs({
              userId : savedGuest.userId,
              guestId : savedGuest.guestId,
              propertyId: savedGuest.propertyId,
              createdBy: savedGuest.createdBy,
              createdOn: savedGuest.createdOn,
              shortCode: [
                {
                  shortCode: savedGuest.shortCode[0].shortCode,
                  logId: savedGuest.shortCode[0].logId,
                  userId: userId,
                  deviceType: deviceType,
                  ipAddress:ipAddress,
                  modifiedOn: currentUTCTime,
                },
              ],
              displayStatus: [
                {
                  displayStatus: savedGuest.displayStatus[0].displayStatus,
                  logId: savedGuest.displayStatus[0].logId,
                  userId: userId,
                  deviceType: deviceType,
                  ipAddress:ipAddress,
                  modifiedOn: currentUTCTime,
                },
              ],
              guestTypeName: [
                {
                  seasonName: savedGuest.guestTypeName[0].guestTypeName,
                  logId: savedGuest.guestTypeName[0].logId,
                  userId: userId,
                  deviceType: deviceType,
                  ipAddress:ipAddress,
                  modifiedOn: currentUTCTime,
                },
              ],
              });
              await addGuestLogs.save();
            return res.status(200).json({ message: "guest Type added successfully", statuscode: 200 })

          } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
          }


    }catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 })
    }
}
export default addGuestType