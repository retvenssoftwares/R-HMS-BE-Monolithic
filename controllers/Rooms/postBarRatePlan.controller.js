import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import barRatePlan from "../../models/barRatePlan.js";
import barPlanLogsModel from "../../models/LogModels/barRatePlanLogs.js";
import { getCurrentUTCTimestamp,findUserByUserIdAndToken } from "../../helpers/helper.js";

const postBarRatePlan = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      propertyId,
      rateType,
      roomTypeId,
      mealPlanId,
      ratePlanName,
      inclusionPlan,
      roomBaseRate,
      mealCharge,
      inclusionCharge,
      roundUp,
      extraAdultRate,
      extraChildRate,
      ratePlanTotal,
      deviceType,
      ipAddress,
    } = req.body;

    const authCodeValue = req.headers["authcode"];
    const findUser = await verifiedUser.findOne({ userId });
    const currentUTCTime=await getCurrentUTCTimestamp()
    if (!findUser) {
      return res
        .status(400)
        .json({ message: "User not found or invalid userId", statuscode: 400 });
    }
   
    let userRole = findUser.role[0].role;
    const barRatePlanId =Randomstring.generate(8)
    const result = await findUserByUserIdAndToken(userId, authCodeValue)
    if(result.success){
    const newBarRatePlan = new barRatePlan({
      propertyId,
      barRatePlanId: barRatePlanId,
      shortCode: [
        {
          shortCode: shortCode,
          logId: Randomstring.generate(10),
        },
      ],
      displayStatus: [
        {
          displayStatus: "1",
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
      mealPlan: [
        {
          mealPlanId: mealPlanId,
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

      barRates:{
        roomBaseRate:[{
          roomBaseRate:roomBaseRate,
          logId: Randomstring.generate(10),
        }],

        mealCharge:[{
          mealCharge:mealCharge,
          logId: Randomstring.generate(10),
        }],

        inclusionCharge:[{
          inclusionCharge:inclusionCharge,
          logId: Randomstring.generate(10),
        }],

        roundUp:[{
          roundUp:roundUp,
          logId: Randomstring.generate(10),
        }],
        extraAdultRate:[{
          extraAdultRate:extraAdultRate,
          logId: Randomstring.generate(10),
        }],
        extraChildRate:[{
          extraChildRate:extraChildRate,
          logId: Randomstring.generate(10),
        }],
        ratePlanTotal:[{
          ratePlanTotal:ratePlanTotal,
          logId: Randomstring.generate(10),
        }],
      },

     createdBy: userRole,

      createdOn: await getCurrentUTCTimestamp(),
    });

   const savedBarRatePlan= await newBarRatePlan.save();


    //save data in logs model
    const barRatePlanLogs = new barPlanLogsModel({
      
      barRatePlanId: barRatePlanId,
      rateType:rateType,
      propertyId:propertyId,
      createdBy: userRole,
      createdOn: await getCurrentUTCTimestamp(),
      shortCode: [
        {
          shortCode: shortCode,
          logId:savedBarRatePlan.shortCode[0].logId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          userId:userId,
          modifiedOn:currentUTCTime
        },
      ],
      displayStatus: [
        {
          displayStatus: savedBarRatePlan.displayStatus[0].displayStatus[0],
          logId:savedBarRatePlan.shortCode[0].logId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          userId:userId,
          modifiedOn:currentUTCTime
        },
      ],
      ratePlanName: [
        {
          ratePlanName: ratePlanName,
          logId:savedBarRatePlan.ratePlanName[0].logId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          userId:userId,
          modifiedOn:currentUTCTime
        }],
        roomType: [{
          roomTypeId: roomTypeId,
          logId:savedBarRatePlan.roomType[0].logId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          userId:userId,
          modifiedOn:currentUTCTime
        }],
        mealPlan: [{
          mealPlanId: mealPlanId,
          logId:savedBarRatePlan.mealPlan[0].logId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          userId:userId,
          modifiedOn:currentUTCTime
        }],
        inclusion: [{
          inclusionPlan: inclusionPlan,
          logId:savedBarRatePlan.inclusion[0].logId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          userId:userId,
          modifiedOn:currentUTCTime
        }],
        barRates: {
          roomBaseRate: [{
            logId: savedBarRatePlan.barRates.roomBaseRate[0].logId,
            roomBaseRate:savedBarRatePlan.barRates.roomBaseRate[0].roomBaseRate,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
          mealCharge: [{
            logId: savedBarRatePlan.barRates.mealCharge[0].logId,
            mealCharge:savedBarRatePlan.barRates.mealCharge[0].mealCharge,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
  
          inclusionCharge: [{
            logId: savedBarRatePlan.barRates.inclusionCharge[0].logId,
            inclusionCharge:savedBarRatePlan.barRates.inclusionCharge[0].inclusionCharge,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
          roundUp: [{
            logId: savedBarRatePlan.barRates.roundUp[0].logId,
            roundUp:savedBarRatePlan.barRates.roundUp[0].roundUp,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
          extraAdultRate: [{
            logId: savedBarRatePlan.barRates.extraAdultRate[0].logId,
            extraAdultRate:savedBarRatePlan.barRates.extraAdultRate[0].extraAdultRate,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
          extraChildRate: [{
            logId: savedBarRatePlan.barRates.extraChildRate[0].logId,
            extraAdultRate:savedBarRatePlan.barRates.extraChildRate[0].extraChildRate,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
          ratePlanTotal: [{
            logId: savedBarRatePlan.barRates.ratePlanTotal[0].logId,
            ratePlanTotal:savedBarRatePlan.barRates.ratePlanTotal[0].ratePlanTotal,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
        },
  
    });
    await barRatePlanLogs.save();

    return res
      .status(200)
      .json({
        message: "New bar ratePlan added successfully",
        statuscode: 200,
      });
    }
    else{
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode  });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postBarRatePlan;
