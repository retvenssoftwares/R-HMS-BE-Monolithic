import Randomstring from "randomstring";
import requestIp from "request-ip"
import discountPlanModel from "../../models/discountPlan.js";
import userModel from "../../models/verifiedUsers.js";
import discountPlanLogsModel from "../../models/LogModels/discountPlanLogs.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js"
const createDiscountPlan = async (req, res) => {
    try {
        const { userId } = req.query
        const {
            rateType,
            roomTypeId,
            ratePlanId,
            propertyId,
            discountName,
            shortCode,
            discountType,
            discountPercent,
            discountPrice,
            validityPeriodFrom,
            validityPeriodTo,
            blackOutDates,
            ratePlanInclusion,
            discountTotal,
            extraAdultRate,
            extraChildRate,
            deviceType,
            ipAddress
        } = req.body;
        const authCodeValue = req.headers['authcode']

        const user = await userModel.findOne({ userId: userId })
        if (!user) {
            return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
        }
        let userRole = user.role[0].role;
        const result = await findUserByUserIdAndToken(userId, authCodeValue)
        const discountPlanId = Randomstring.generate(10);
        const currentUTCTime= await getCurrentUTCTimestamp();
        const blackOutDatesArray = blackOutDates.map(dateString => dateString.trim());
        if (result.success) {
            const discountRatePlan = new discountPlanModel({
                propertyId: propertyId,
        
                discountPlanId: discountPlanId,
        
                rateType: rateType,
        
                roomTypeId: roomTypeId,
        
                createdBy: userRole,
        
                ratePlanId: ratePlanId,
        
                createdOn: currentUTCTime,
        
                discountName: [
                  {
                    discountName: discountName,
                    logId: Randomstring.generate(10),
                  },
                ],
        
                shortCode: [
                  {
                    shortCode: shortCode,
                    logId: Randomstring.generate(10),
                  },
                ],
        
                discountType: [
                  {
                    discountType: discountType,
                    logId: Randomstring.generate(10),
                  },
                ],
        
                discountPercent: [
                  {
                    discountPercent: discountPercent,
                    logId: Randomstring.generate(10),
                  },
                ],
        
                discountPrice: [
                  {
                    discountPrice: discountPrice,
                    logId: Randomstring.generate(10),
                  },
                ],

                validityPeriodFrom: [
                    {
                        validityPeriodFrom: validityPeriodFrom,
                      logId: Randomstring.generate(10),
                    },
                  ],
                  validityPeriodTo: [
                    {
                        validityPeriodTo: validityPeriodTo,
                      logId: Randomstring.generate(10),
                    },
                  ],

                  blackOutDates: [
                    {
                        blackOutDates: blackOutDatesArray,
                      logId: Randomstring.generate(10),
                    },
                  ],
        
            
                barRates: {
                 
                  extraAdultRate: [{
                    extraAdultRate: extraAdultRate,
                    logId: Randomstring.generate(10),
                  }],
                  extraChildRate: [{
                    extraChildRate: extraChildRate,
                    logId: Randomstring.generate(10),
                  }],
        
                  discountTotal: [{
                    discountTotal: discountTotal,
                    logId: Randomstring.generate(10),
                  }],
                },
             
        
                displayStatus: [{
                  displayStatus: "1", 
                  logId: Randomstring.generate(10) 
                 }],
        
        
                ratePlanInclusion: [
                  {
                    ratePlanInclusion: ratePlanInclusion,
                    logId: Randomstring.generate(10),
                  },
                ],
              });
              const discountPlan = await discountRatePlan.save();

              //save logs
                 //save data in logs

      const discountLogs=new discountPlanLogsModel({
        propertyId: propertyId,

        discountPlanId: discountPlanId,

        rateType: rateType,

        roomTypeId: roomTypeId,

        createdBy: userRole,

        ratePlanId: ratePlanId,

        createdOn: currentUTCTime,

        discountName:[{
            discountName:discountPlan.discountName[0].discountName,
            logId:discountPlan.discountName[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
        }],        
        shortCode: [{
          shortCode: discountPlan.shortCode[0].shortCode,
          logId: discountPlan.shortCode[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
        displayStatus: [{
          displayStatus: discountPlan.displayStatus[0].displayStatus,
          logId: discountPlan.displayStatus[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      discountType: [{
        discountType: discountPlan.discountType[0].discountType,
          logId: discountPlan.discountType[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      discountPercent: [{
        discountPercent: discountPlan.discountPercent[0].discountPercent,
          logId: discountPlan.discountPercent[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      discountPrice: [{
        discountPrice: discountPlan.discountPrice[0].discountPrice,
          logId: discountPlan.discountPrice[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      validityPeriodFrom: [{
        validityPeriodFrom: discountPlan.validityPeriodFrom[0].validityPeriodFrom,
          logId: discountPlan.validityPeriodFrom[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      validityPeriodTo: [{
        validityPeriodTo: discountPlan.validityPeriodTo[0].validityPeriodTo,
          logId: discountPlan.validityPeriodTo[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],

      blackOutDates: [{
        blackOutDates: discountPlan.blackOutDates[0].blackOutDates,
          logId: discountPlan.blackOutDates[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      
      barRates: {
        extraAdultRate: [{
          logId: discountPlan.barRates.extraAdultRate[0].logId,
          extraAdultRate:discountPlan.barRates.extraAdultRate[0].extraAdultRate,
          deviceType: deviceType,
          ipAddress: ipAddress,
          userId: userId,
          modifiedOn:currentUTCTime
        }],
        extraChildRate: [{
          logId: discountPlan.barRates.extraChildRate[0].logId,
          extraChildRate:discountPlan.barRates.extraChildRate[0].extraChildRate,
          deviceType: deviceType,
          ipAddress: ipAddress,
          userId: userId,
          modifiedOn:currentUTCTime
        }],

        discountTotal: [{
          logId: discountPlan.barRates.discountTotal[0].logId,
          discountTotal:discountPlan.barRates.discountTotal[0].discountTotal,
          deviceType: deviceType,
          ipAddress: ipAddress,
          userId: userId,
          modifiedOn:currentUTCTime
        }],
      },
   
      ratePlanInclusion: [{
        ratePlanInclusion: discountPlan.ratePlanInclusion[0].ratePlanInclusion,
          logId: discountPlan.ratePlanInclusion[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      })

      await discountLogs.save();

            return res.status(200).json({ message: "Discount rate plan created", statuscode: 200 });
        } else {
            return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
    }
};

export default createDiscountPlan;
