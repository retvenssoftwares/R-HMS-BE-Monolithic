import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import holidayModel from "../../models/holidays.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";
import holidayLog from "../../models/LogModels/holidayLog.js";

const postHoliday = async (req, res) => {
  try {
    const userId = req.body.userId
    const {
      shortCode,
      propertyId,
      holidayName,
      startDate,
      endDate,
      deviceType,
      ipAddress
    } = req.body;

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    if (!findUser) {
      return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue)
    const currentUTCTime= await getCurrentUTCTimestamp();
    if (result.success) {
      let userRole = findUser.role[0].role

      const newHoliday = new holidayModel({

        propertyId,
        holidayId: Randomstring.generate(8),
        shortCode: [{
          shortCode: shortCode,
          logId: Randomstring.generate(10)
        }],
        holidayName: [{
          holidayName: holidayName,
          logId: Randomstring.generate(10)
        }],
        startDate: [{
          startDate: startDate,
          logId: Randomstring.generate(10)
        }],
        endDate: [{
          endDate: endDate,
          logId: Randomstring.generate(10)
        }],
        displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(10) }],
        createdBy: userRole,

        createdOn: currentUTCTime,

        modifiedBy: [],
        modifiedOn: [],
       

      });
      const savedHoliday= await newHoliday.save();

      //save data in logs

      const addHolidayLog= new holidayLog({
        userId:savedHoliday.userId,
        holidayId:savedHoliday.holidayId,
        createdBy:savedHoliday.createdBy,
        createdOn:savedHoliday.createdOn,
        propertyId:savedHoliday.propertyId,
        shortCode: [
          {
            logId: savedHoliday.shortCode[0].logId,
            shortCode: savedHoliday.shortCode[0].shortCode,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
          },
        ],
        holidayName: [
          {
            holidayName: savedHoliday.holidayName[0].holidayName,
            logId: savedHoliday.holidayName[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        startDate: [
          {
            startDate: savedHoliday.startDate[0].startDate,
            logId: savedHoliday.startDate[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        endDate: [
          {
            endDate: savedHoliday.endDate[0].endDate,
            logId: savedHoliday.endDate[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
      })
      await addHolidayLog.save();

      return res.status(200).json({ message: "New holiday added successfully", statuscode: 200 });
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postHoliday;