import companyRateModel from "../../models/companyRatePlane.js"
import Randomstring from "randomstring"
import requestIP from "request-ip"
import verifiedUser from "../../models/verifiedUsers.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js'
import companyLogs from "../../models/LogModels/compnayRatePlanLogs.js"

export const companyRatePlan = async (req, res) => {
  try {

    const { userId, propertyId, rateType, createdBy, roomTypeId, companyId, shortCode, ratePlanInclusion, ratePlanName, inclusionTotal, ratePlanTotal, ipAddress, deviceType, roomBaseRate, mealCharge, inclusionCharge, roundUp, extraAdultRate, extraChildRate, mealPlanId } = req.body
    const authCodeValue = req.headers["authcode"]
    const findUser = await verifiedUser.findOne({ userId: userId });

    if (!findUser) {
      return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    const currentUTCTime= await getCurrentUTCTimestamp();

    let userRole = findUser.role[0].role;

    var clientIp = requestIP.getClientIp(req)

    const companyRatePlanId = Randomstring.generate(10)
    if (result.success) {
      const companyRate = new companyRateModel({
        propertyId,

        companyRatePlanId: companyRatePlanId,

        rateType: rateType,

        companyId: companyId,
        roomTypeId: roomTypeId,
        mealPlanId: mealPlanId,

        createdBy: userRole,

        createdOn: await getCurrentUTCTimestamp(),


        ratePlanName: [{
          ratePlanName: ratePlanName,
          logId: Randomstring.generate(10),
        }],

        shortCode: [{
          shortCode: shortCode,
          logId: Randomstring.generate(10),
        }],

        inclusionTotal: [{
          inclusionTotal: inclusionTotal,
          logId: Randomstring.generate(10),
        }],

        ratePlanInclusion: [{
          ratePlanInclusion: ratePlanInclusion,
          logId: Randomstring.generate(10),
        }],


        barRates: {
          roomBaseRate: [{
            roomBaseRate: roomBaseRate,
            logId: Randomstring.generate(10),
          }],

          mealCharge: [{
            mealCharge: mealCharge,
            logId: Randomstring.generate(10),
          }],

          inclusionCharge: [{
            inclusionCharge: inclusionCharge,
            logId: Randomstring.generate(10),
          }],

          roundUp: [{
            roundUp: roundUp,
            logId: Randomstring.generate(10),
          }],
          extraAdultRate: [{
            extraAdultRate: extraAdultRate,
            logId: Randomstring.generate(10),
          }],
          extraChildRate: [{
            extraChildRate: extraChildRate,
            logId: Randomstring.generate(10),
          }],

          ratePlanTotal: [{
            ratePlanTotal: ratePlanTotal,
            logId: Randomstring.generate(10),
          }],
        },
        displayStatus: [{
          displayStatus: "1", 
          logId: Randomstring.generate(10) 
         }],

      })

      const result = await companyRate.save();


      //logs
      const companyRatePlanLogs = new companyLogs({
        rateType: result.rateType,
        propertyId: result.propertyId,
        roomTypeId: result.roomTypeId,
        companyRatePlanId: result.companyRatePlanId,
        mealPlanId: result.mealPlanId,
        companyId: result.companyId,

        ratePlanName: [{
          logId: result.ratePlanName[0].logId,
          ratePlanName: result.ratePlanName[0].ratePlanName,
          deviceType: deviceType,
          ipAddress: clientIp,
          userId: userId,
          modifiedOn:currentUTCTime
        }],
        shortCode: [{
          logId: result.shortCode[0].logId,
          shortCode: result.shortCode[0].shortCode,
          deviceType: deviceType,
          ipAddress: clientIp,
          userId: userId,
          modifiedOn: currentUTCTime
        }],
  
        ratePlanInclusion: [{
          logId: result.ratePlanInclusion[0].logId,
          ratePlanInclusion: result.ratePlanInclusion[0].ratePlanInclusion,
          deviceType: deviceType,
          ipAddress: clientIp,
          userId: userId,
          modifiedOn:currentUTCTime
        }],
        inclusionTotal: [{
          logId: result.inclusionTotal[0].logId,
          inclusionTotal: result.inclusionTotal[0].inclusionTotal,
          deviceType: deviceType,
          ipAddress: clientIp,
          userId: userId,
          modifiedOn:currentUTCTime
        }],

        barRates: {
          roomBaseRate: [{
            logId: result.barRates.roomBaseRate[0].logId,
            roomBaseRate:result.barRates.roomBaseRate[0].roomBaseRate,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],

          mealCharge: [{
            logId: result.barRates.mealCharge[0].logId,
            mealCharge:result.barRates.mealCharge[0].mealCharge,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],

          inclusionCharge: [{
            logId: result.barRates.inclusionCharge[0].logId,
            inclusionCharge:result.barRates.inclusionCharge[0].inclusionCharge,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],

          roundUp: [{
            logId: result.barRates.roundUp[0].logId,
            roundUp:result.barRates.roundUp[0].roundUp,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
          extraAdultRate: [{
            logId: result.barRates.extraAdultRate[0].logId,
            extraAdultRate:result.barRates.extraAdultRate[0].extraAdultRate,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
          extraChildRate: [{
            logId: result.barRates.extraChildRate[0].logId,
            extraChildRate:result.barRates.extraChildRate[0].extraChildRate,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],

          ratePlanTotal: [{
            logId: result.barRates.ratePlanTotal[0].logId,
            ratePlanTotal:result.barRates.ratePlanTotal[0].ratePlanTotal,
            deviceType: deviceType,
            ipAddress: clientIp,
            userId: userId,
            modifiedOn:currentUTCTime
          }],
        },
        displayStatus:[{
          logId: result.displayStatus[0].logId,
          displayStatus:result.displayStatus[0].displayStatus,
          deviceType: deviceType,
          ipAddress: clientIp,
          userId: userId,
          modifiedOn:currentUTCTime
        }]
      
       
      });

      await companyRatePlanLogs.save();

      // console.log('Successfully updated:', result);
      return res.status(200).json({ message: 'company Rate Plan Successfully added', statuscode: 200 });
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (error) {
    console.error('Error occurred while aading:', error);
    return res.status(500).json({ message: 'Internal server error', statuscode: 500 });
  }
};






//update company patch api
export const updateCompanyRatePlan = async (req, res) => {
  try {
    const { userId, ratePlanName, shortCode, ratePlanInclusion, inclusionTotal, ratePlanTotal, deviceType, ipAddress, roomBaseRate, mealCharge, inclusionCharge, roundUp, extraAdultRate, extraChildRate,displayStatus } = req.body;
    const companyRatePlan = await companyRateModel.findOne({ companyRatePlanId: req.query.companyRatePlanId })

    if (!companyRatePlan) {
      return res.status(404).JSON({ message: "No company rate plan", statuscode: 404 })
    }
    // console.log(companyRatePlan)

    const companyRatePlanLogs = await companyLogs.findOne({ companyRatePlanId: req.query.companyRatePlanId });
    var clientIp = requestIP.getClientIp(req)


    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser) {
      return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 })
    }

    // let userRole = findUser.role[0].role;
    const authCodeValue = req.headers["authcode"]

    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if (result.success) {
      const shortcodeLog = Randomstring.generate(10)
      const ratePlanNameLog = Randomstring.generate(10)
      const ratePlanInclusionLog = Randomstring.generate(10)
      const inclusionTotalLog = Randomstring.generate(10)
      const ratePlanTotalLog = Randomstring.generate(10)
      const roomBaseRateLog = Randomstring.generate(10)
      const mealChargeLog = Randomstring.generate(10)
      const inclusionChargeLog = Randomstring.generate(10)
      const roundUpLog = Randomstring.generate(10)
      const extraAdultRateLog = Randomstring.generate(10)
      const extraChildRateLog = Randomstring.generate(10)
      const displayStatusLog = Randomstring.generate(10)

      if (ratePlanName) {
        const ratePlanNameObject = { ratePlanName: ratePlanName, logId: ratePlanNameLog, ipAddress: clientIp, deviceType: deviceType };
        companyRatePlan.ratePlanName.unshift(ratePlanNameObject);
      }

      if (shortCode) {
        const shortCodeObject = { shortCode: shortCode, logId: shortcodeLog, ipAddress: clientIp, deviceType: deviceType, };
        companyRatePlan.shortCode.unshift(shortCodeObject);

      }

      if (ratePlanInclusion) {
        const ratePlanInclusionObject = {
          ratePlanInclusion: ratePlanInclusion,
          ipAddress: clientIp,
          deviceType: deviceType,
          logId: ratePlanInclusionLog
        }
        companyRatePlan.ratePlanInclusion.unshift(ratePlanInclusionObject);
      }

      if (inclusionTotal) {
        const inclusionTotalObject = {
          inclusionTotal: inclusionTotal,
          ipAddress: clientIp,
          deviceType: deviceType,
          logId: inclusionTotalLog
        }
        companyRatePlan.inclusionTotal.unshift(inclusionTotalObject);
      }

      if (ratePlanTotal) {
        const ratePlanTotalObject = {
          ratePlanTotal: ratePlanTotal,
          ipAddress: clientIp,
          deviceType: deviceType,
          logId: ratePlanTotalLog
        }
        companyRatePlan.barRates.ratePlanTotal.unshift(ratePlanTotalObject);
      }


      if (roomBaseRate) {
        const roomBaseRateObject = {
          roomBaseRate: roomBaseRate,
          logId: roomBaseRateLog,
          ipAddress: clientIp,
          deviceType: deviceType,
        }
        companyRatePlan.barRates.roomBaseRate.unshift(roomBaseRateObject);
      }


      if (mealCharge) {
        const mealChargeObject = {
          mealCharge: mealCharge,
          logId: mealChargeLog,
          ipAddress: clientIp,
          deviceType: deviceType,
        }
        companyRatePlan.barRates.mealCharge.unshift(mealChargeObject);
      }


      if (inclusionCharge) {
        const inclusionChargeObject = {
          inclusionCharge: inclusionCharge,
          logId: inclusionChargeLog,
          ipAddress: clientIp,
          deviceType: deviceType,
        }
        companyRatePlan.barRates.inclusionCharge.unshift(inclusionChargeObject);
      }

      if (roundUp) {
        const roundUpObject = {
          roundUp: roundUp,
          logId: roundUpLog,
          ipAddress: clientIp,
          deviceType: deviceType,
        }
        companyRatePlan.barRates.roundUp.unshift(roundUpObject);
      }

      if (extraAdultRate) {
        const extraAdultRateObject = {
          extraAdultRate: extraAdultRate,
          logId: extraAdultRateLog,
          ipAddress: clientIp,
          deviceType: deviceType,
        }
        companyRatePlan.barRates.extraAdultRate.unshift(extraAdultRateObject);
      }


      if (extraChildRate) {
        const extraChildRateObject = {
          extraChildRate: extraChildRate,
          logId: extraChildRateLog,
          ipAddress: clientIp,
          deviceType: deviceType,
        }
        companyRatePlan.barRates.extraChildRate.unshift(extraChildRateObject);
      }
      if (displayStatus) {
        const displayStatusObject = {
          displayStatus: displayStatus,
          logId: displayStatusLog,
          ipAddress: clientIp,
          deviceType: deviceType,
        }
        companyRatePlan.displayStatus.unshift(displayStatusObject);
      }


      const updateCompanyPlan = await companyRatePlan.save()

      const requestData = {
        body: req.body,
        // Add other request data you want to store
      };
      const requestDataString = JSON.stringify(requestData)


      const responseData = {
        message: "updated successfully", // Store the response message
        statuscode: 200, // Store the response status code
        // Add other response data you want to store
      };
      const responseString = JSON.stringify(responseData)

      const currentUTCTime = await getCurrentUTCTimestamp();

      //save data in logs

      if (companyRatePlanLogs){

      if (ratePlanName) {
        const ratePlanNameObject = { ratePlanName: ratePlanName, logId: ratePlanNameLog, modifiedOn: currentUTCTime, userId: userId, deviveType: deviceType, ipAddress: clientIp,};
        companyRatePlanLogs.ratePlanName.unshift(ratePlanNameObject);
      }

      if (shortCode) {
        const shortCodeObject = { shortCode: shortCode, logId: shortcodeLog, modifiedOn: currentUTCTime, userId: userId, deviveType: deviceType, ipAddress: clientIp, };
        companyRatePlanLogs.shortCode.unshift(shortCodeObject);

      }

      if (ratePlanInclusion) {
        const ratePlanInclusionObject = {
          ratePlanInclusion: ratePlanInclusion,
          logId: ratePlanInclusionLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          request: requestDataString,
          response: responseString,
          deviveType: deviceType,
          ipAddress: clientIp
        }
        companyRatePlanLogs.ratePlanInclusion.unshift(ratePlanInclusionObject);
      }
      if (displayStatus) {
        const displayStatusObject = {
          displayStatus: displayStatus,
          logId: displayStatusLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp
        }
        companyRatePlanLogs.displayStatus.unshift(displayStatusObject);
      }

      if (inclusionTotal) {
        const inclusionTotalObject = {
          inclusionTotal: inclusionTotal,
          logId: inclusionTotalLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp,
        }
        companyRatePlanLogs.inclusionTotal.unshift(inclusionTotalObject);
      }

      if (ratePlanTotal) {
        const ratePlanTotalObject = {
          ratePlanTotal: ratePlanTotal,
          logId: ratePlanTotalLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp,
        }
        companyRatePlanLogs.barRates.ratePlanTotal.unshift(ratePlanTotalObject);
      }
      if (roomBaseRate) {
        const roomBaseRateObject = {
          roomBaseRate: roomBaseRate,
          logId: roomBaseRateLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp,
        }
        companyRatePlanLogs.barRates.roomBaseRate.unshift(roomBaseRateObject);
      }
      if (mealCharge) {
        const mealChargeObject = {
          mealCharge: mealCharge,
          logId: mealChargeLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp,
        }
        companyRatePlanLogs.barRates.mealCharge.unshift(mealChargeObject);
      }
      if (inclusionCharge) {
        const inclusionChargeObject = {
          inclusionCharge: inclusionCharge,
          logId: inclusionChargeLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp,
        }
        companyRatePlanLogs.barRates.inclusionCharge.unshift(inclusionChargeObject);
      }
      if (roundUp) {
        const roundUpObject = {
          roundUp: roundUp,
          logId: roundUpLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp,
        }
        companyRatePlanLogs.barRates.roundUp.unshift(roundUpObject);
      }
      if (extraAdultRate) {
        const extraAdultRateObject = {
          extraAdultRate: extraAdultRate,
          logId: extraAdultRateLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp,
        }
        companyRatePlanLogs.barRates.extraAdultRate.unshift(extraAdultRateObject);
      }
      if (extraChildRate) {
        const extraChildRateObject = {
          extraChildRate: extraChildRate,
          logId: extraChildRateLog,
          modifiedOn: currentUTCTime,
          userId: userId,
          deviveType: deviceType,
          ipAddress: clientIp,
        }
        companyRatePlanLogs.barRates.extraChildRate.unshift(extraChildRateObject);
      }
    }
      await companyRatePlanLogs.save();


      return res.status(200).json({ message: "Company Rate plan  successfully updated", statuscode: 200 });
    }
    else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

  } catch (error) {
    console.error('Error occurred while updating:', error);
    return res.status(500).json({ message: 'Internal server error', statuscode: 500 });
  }
};



