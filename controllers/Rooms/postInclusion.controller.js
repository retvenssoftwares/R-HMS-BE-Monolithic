import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import inclusionModel from "../../models/inclusion.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";
import inclusionLog from "../../models/LogModels/inclusionLog.js";

const postInclusion = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      propertyId,
      charge,
      inclusionName,
      inclusionType,
      chargeRule,
      postingRule,
      deviceType,
      ipAddress
    } = req.body;

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    if (!findUser) {
      return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    const currentUTCTime= await getCurrentUTCTimestamp()

    let userRole = findUser.role[0].role

    if (result.success) {
      const newSeason = new inclusionModel({

        propertyId,
        inclusionId: Randomstring.generate(8),
        shortCode: [{
          shortCode: shortCode,
          logId:Randomstring.generate(10)
        }],
        charge: [{
          charge: charge,
          logId:Randomstring.generate(10)
        }],
        inclusionName: [{
          inclusionName: inclusionName,
          logId:Randomstring.generate(10)
        }],
        inclusionType: [{
          inclusionType: inclusionType,
          logId:Randomstring.generate(10)
        }],
        chargeRule: [{
          chargeRule: chargeRule,
          logId:Randomstring.generate(10)
        }],
        postingRule: [{
          postingRule: postingRule,
          logId:Randomstring.generate(10)
        }],
        createdBy: userRole,

        createdOn: currentUTCTime,

        modifiedBy: [],
        modifiedOn: [],
        days: [],

      });
      const savedinclusion= await newSeason.save();
      
      // save  data in log

      const addInclusionLogs=new inclusionLog({
        userId:savedinclusion.userId,
        propertyId:savedinclusion.propertyId,
        createdOn:savedinclusion.createdOn,
        createdBy:savedinclusion.createdBy,
        inclusionId:savedinclusion.inclusionId,
        shortCode: [
          {
            shortCode: savedinclusion.shortCode[0].shortCode,
            logId: savedinclusion.shortCode[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        charge: [
          {
            charge: savedinclusion.charge[0].charge,
            logId: savedinclusion.charge[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        inclusionName: [
          {
            inclusionName: savedinclusion.inclusionName[0].inclusionName,
            logId: savedinclusion.inclusionName[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        inclusionType: [
          {
            inclusionType: savedinclusion.inclusionType[0].inclusionType,
            logId: savedinclusion.inclusionType[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        chargeRule: [
          {
            chargeRule: savedinclusion.chargeRule[0].chargeRule,
            logId: savedinclusion.chargeRule[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        postingRule: [
          {
            postingRule: savedinclusion.postingRule[0].postingRule,
            logId: savedinclusion.chargeRule[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
      })
      await addInclusionLogs.save();

      return res.status(200).json({ message: "New Inclusion added successfully", statuscode: 200 });

    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });

    }
  }
  catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postInclusion;