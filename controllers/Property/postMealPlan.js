import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import mealPlanModel from "../../models/mealPlan.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";
import mealPLanLog from "../../models/LogModels/mealPlanLogs.js";

const postMealPlan = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      propertyId,
      mealPlanName,
      chargesPerOccupancy,
      deviceType,
      ipAddress,
    } = req.body;

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    if (!findUser) {
      return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
    }
    const result = await findUserByUserIdAndToken(userId, authCodeValue)
    const currentUTCTime = await getCurrentUTCTimestamp();

    if (result.success) {
      let userRole = findUser.role[0].role

      const newMealPlan = new mealPlanModel({

        propertyId,
        mealPlanId: Randomstring.generate(8),
        shortCode: [{
          shortCode: shortCode,
          logId: Randomstring.generate(10)
      }],
      mealPlanName: [{
        mealPlanName: mealPlanName,
          logId: Randomstring.generate(10),
          
        }],
        chargesPerOccupancy: [{
            chargesPerOccupancy: chargesPerOccupancy,
              logId: Randomstring.generate(10)
            }],
       
        displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(10) }],
        createdBy: userRole,

        createdOn: await getCurrentUTCTimestamp(),

        modifiedBy: [],
        modifiedOn: [],
      });
      const savedMealPlan= await newMealPlan.save();

      //save data in logs

      const addMealPlanLogs=new mealPLanLog({
        userId:savedMealPlan.userId,
        propertyId:savedMealPlan.propertyId,
        mealPlanId: savedMealPlan.mealPlanId,
        createdBy: savedMealPlan.createdBy,
        createdOn: savedMealPlan.createdOn,
        shortCode: [{
          shortCode: savedMealPlan.shortCode[0].shortCode,
          logId: savedMealPlan.shortCode[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      displayStatus: [{
        displayStatus: savedMealPlan.displayStatus[0].displayStatus,
          logId: savedMealPlan.displayStatus[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      mealPlanName: [{
        mealPlanName: savedMealPlan.mealPlanName[0].mealPlanName,
        logId: savedMealPlan.mealPlanName[0].logId,
        userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
        }],
        chargesPerOccupancy: [{
            chargesPerOccupancy: savedMealPlan.chargesPerOccupancy[0].chargesPerOccupancy,
              logId: savedMealPlan.chargesPerOccupancy[0].logId,
              userId: userId,
              deviceType: deviceType,
              ipAddress:ipAddress,
              modifiedOn:currentUTCTime,
            }],
      })

      await addMealPlanLogs.save();

      return res.status(200).json({ message: "New meal plan added successfully", statuscode: 200 });

    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postMealPlan;