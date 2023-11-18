import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import mealPlanModel from "../../models/mealPlan.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";

const postMealPlan = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      propertyId,
      mealPlanName,
      chargesPerOccupancy,
    } = req.body;

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    if (!findUser) {
      return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
    }
    const result = await findUserByUserIdAndToken(userId, authCodeValue)

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
          logId: Randomstring.generate(10)
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
      await newMealPlan.save();
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