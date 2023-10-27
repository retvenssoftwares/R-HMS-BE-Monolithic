import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import barRatePlan from "../../models/barRatePlan.js";
import barPlanLogsModel from "../../models/LogModels/barRatePlanLogs.js";
import { getCurrentUTCTimestamp } from "../../helpers/helper.js";

const postBarRatePlan = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      propertyId,
      rateType,
      roomTypeId,
      ratePlanName,
      inclusionPlan,
      inclusionTotal,
      totalRatePlanPrice,
    } = req.body;

    const authCodeValue = req.headers["authcode"];
    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser) {
      return res
        .status(400)
        .json({ message: "User not found or invalid userId", statuscode: 400 });
    }
    const userToken = findUser.authCode;

    if (authCodeValue !== userToken) {
      return res
        .status(400)
        .json({ message: "Invalid authentication token", statuscode: 400 });
    }
    let userRole = findUser.role[0].role;
    const barRatePlanId =Randomstring.generate(8)

    const newBarRatePlan = new barRatePlan({
      propertyId,
      barRatePlanId: barRatePlanId,
      shortCode: [
        {
          shortCode: shortCode,
          logId: Randomstring.generate(10),
        },
      ],
      rateType: rateType,

      roomType: [
        {
          roomTypeId: roomTypeId,
          logId: Randomstring.generate(10),
        },
      ],
      ratePlanName: [
        {
          ratePlanName: ratePlanName,
          logId: Randomstring.generate(10),
        },
      ],
      inclusion: [
        {
          inclusionPlan: inclusionPlan,
          logId: Randomstring.generate(10),
        },
      ],

      inclusionTotal: [
        {
          inclusionTotal: inclusionTotal,
          logId: Randomstring.generate(10),
        },
      ],
      totalRatePlanPrice: [
        {
          totalRatePlanPrice: totalRatePlanPrice,
          logId: Randomstring.generate(10),
        },
      ],
     createdBy: userRole,

      createdOn: await getCurrentUTCTimestamp(),
    });


      
    await newBarRatePlan.save();


    //save data in logs model
    const barRatePlanLogs = new barPlanLogsModel({
      
      ratePlanName: req.body,
       barRatePlanId: barRatePlanId,
      shortCode:req.body,
      rateType:rateType,
      propertyId:propertyId,
      roomType:req.body,
      ratePlanName:req.body,
      inclusionTotal:req.body,
      totalRatePlanPrice:req.body,
      createdBy: userRole,
      createdOn: await getCurrentUTCTimestamp(),
      inclusion: {
        ...req.body, // Include all fields from req.body
      },
    });

    await barRatePlanLogs.save();

    return res
      .status(200)
      .json({
        message: "New bar ratePlan added successfully",
        statuscode: 200,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postBarRatePlan;
