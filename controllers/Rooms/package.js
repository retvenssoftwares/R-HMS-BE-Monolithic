import packageRatePlanModel from "../../models/package.js";
import Randomstring from "randomstring";
import requestIP from "request-ip";
import verifiedUser from "../../models/verifiedUsers.js";
import {
  findUserByUserIdAndToken,
  getCurrentUTCTimestamp,
} from "../../helpers/helper.js";
import packageRatePlanLog from "../../models/LogModels/packageLogs.js";

export const packageRatePlan = async (req, res) => {
  try {
    const {
      userId,
      propertyId,
      rateType,
      roomTypeId,
      ratePlanId,
      shortCode,
      ratePlanInclusion,
      ratePlanName,
      minimumNights,
      maximumNights,
      packageRateAdjustment,
      packageTotal,
      extraAdultRate,
      extraChildRate,
      ipAddress,
      deviceType,
    } = req.body;

    const findUser = await verifiedUser.findOne({ userId });

    if (!findUser) {
      return res
        .status(404)
        .json({ message: "User not found or invalid userid", statusCode: 404 });
    }

    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    let userRole = findUser.role[0].role;

    var clientIp = requestIP.getClientIp(req);

    const currentUTCTime= await getCurrentUTCTimestamp();

    const packageId = Randomstring.generate(10);

    if (result.success) {
      const packageRatePlan = new packageRatePlanModel({
        propertyId: propertyId,

        packageId: packageId,

        rateType: rateType,

        roomTypeId: roomTypeId,

        createdBy: userRole,

        ratePlanId: ratePlanId,

        createdOn: currentUTCTime,

        ratePlanName: [
          {
            ratePlanName: ratePlanName,
            logId: Randomstring.generate(10),
          },
        ],

        shortCode: [
          {
            shortCode: shortCode,
            logId: Randomstring.generate(10),
          },
        ],

        minimumNights: [
          {
            minimumNights: minimumNights,
            logId: Randomstring.generate(10),
          },
        ],

        maximumNights: [
          {
            maximumNights: maximumNights,
            logId: Randomstring.generate(10),
          },
        ],

        packageRateAdjustment: [
          {
            packageRateAdjustment: packageRateAdjustment,
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

          packageTotal: [{
            packageTotal: packageTotal,
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
      const packageplan = await packageRatePlan.save();

      //save data in logs

      const addPackageLogs=new packageRatePlanLog({
        propertyId: propertyId,

        packageId: packageId,

        rateType: rateType,

        roomTypeId: roomTypeId,

        createdBy: userRole,

        ratePlanId: ratePlanId,

        createdOn: currentUTCTime,

        shortCode: [{
          shortCode: packageplan.shortCode[0].shortCode,
          logId: packageplan.shortCode[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
        displayStatus: [{
          displayStatus: packageplan.displayStatus[0].displayStatus,
          logId: packageplan.displayStatus[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      ratePlanName: [{
        ratePlanName: packageplan.ratePlanName[0].ratePlanName,
          logId: packageplan.ratePlanName[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      minimumNights: [{
        minimumNights: packageplan.minimumNights[0].minimumNights,
          logId: packageplan.minimumNights[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      maximumNights: [{
        maximumNights: packageplan.maximumNights[0].maximumNights,
          logId: packageplan.maximumNights[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      packageRateAdjustment: [{
        packageRateAdjustment: packageplan.packageRateAdjustment[0].packageRateAdjustment,
          logId: packageplan.packageRateAdjustment[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      
      barRates: {
        extraAdultRate: [{
          logId: packageplan.barRates.extraAdultRate[0].logId,
          extraAdultRate:packageplan.barRates.extraAdultRate[0].extraAdultRate,
          deviceType: deviceType,
          ipAddress: clientIp,
          userId: userId,
          modifiedOn:currentUTCTime
        }],
        extraChildRate: [{
          logId: packageplan.barRates.extraChildRate[0].logId,
          extraChildRate:packageplan.barRates.extraChildRate[0].extraChildRate,
          deviceType: deviceType,
          ipAddress: clientIp,
          userId: userId,
          modifiedOn:currentUTCTime
        }],

        packageTotal: [{
          logId: packageplan.barRates.packageTotal[0].logId,
          packageTotal:packageplan.barRates.packageTotal[0].packageTotal,
          deviceType: deviceType,
          ipAddress: clientIp,
          userId: userId,
          modifiedOn:currentUTCTime
        }],
      },
   
      ratePlanInclusion: [{
        ratePlanInclusion: packageplan.ratePlanInclusion[0].ratePlanInclusion,
          logId: packageplan.ratePlanInclusion[0].logId,
          userId: userId,
          deviceType: deviceType,
          ipAddress:ipAddress,
          modifiedOn:currentUTCTime,
      }],
      })
      await addPackageLogs.save();
      return res.status(200).json({message: "package rate Plan added successfully",statusCode: 200,});
    } else {
      return res
        .status(result.statuscode)
        .json({ message: result.message, statusCode: result.statuscode });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};



//patch Package rate plan
export const updatePackageRatePlan = async (req, res) => {
  try {
    const {
      userId,
      ratePlanName,
      shortCode,
      ratePlanInclusion,
      inclusionTotal,
      ratePlanTotal,
      minimumNights,
      maximumNights,
      packageRateAdjustment,
      deviceType,
      displayStatus,
      ipAddress,
    } = req.body;

    const authCode = req.headers["authcode"];
    const userToken = await findUserByUserIdAndToken(userId, authCode);
    const currentUTCTime= await getCurrentUTCTimestamp();

    if (!userToken) {
      return res
        .status(404)
        .json({ message: "Invalid token ", statusCode: 404 });
    }

    const packageRatePlan = await packageRatePlanModel.findOne({ packageId: req.query.packageId });
    const addpackageRateLog= await packageRatePlanLog.findOne({packageId:req.query.packageId})

    if (!packageRatePlan) {
      return res
        .status(404)
        .json({ message: "Data not found", statusCode: 404 });
    }

    var clientIp = requestIP.getClientIp(req);

    const shortcodeLog = Randomstring.generate(10);
    const ratePlanNameLog = Randomstring.generate(10);
    const ratePlanInclusionLog = Randomstring.generate(10);
    const inclusionTotalLog = Randomstring.generate(10);
    const ratePlanTotalLog = Randomstring.generate(10);
    const minimumNightsLog = Randomstring.generate(10);
    const maximumNightsLog = Randomstring.generate(10);
    const packageRateAdjustmentLog = Randomstring.generate(10);
    const displayStatusLog = Randomstring.generate(10);

    if (ratePlanName) {
      const ratePlanNameObject = {
        ratePlanName: ratePlanName,
        logId: ratePlanNameLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        userId: userId,
      };
      packageRatePlan.ratePlanName.unshift(ratePlanNameObject);

    }

    if (shortCode) {
      const shortCodeObject = {
        shortCode: shortCode,
        logId: shortcodeLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        
      };
      packageRatePlan.shortCode.unshift(shortCodeObject);
    }
    if (displayStatus) {
      const displayStatusObject = {
        displayStatus: displayStatus,
        logId: displayStatusLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        
      };
      packageRatePlan.displayStatus.unshift(displayStatusObject);
    }

    if (ratePlanInclusion) {
      const ratePlanInclusionObject = {
        ratePlanInclusion: ratePlanInclusion,
        ipAddress: clientIp,
        deviceType: deviceType,
        logId: ratePlanInclusionLog,
      };
      packageRatePlan.ratePlanInclusion.unshift(ratePlanInclusionObject);
    }

    if (inclusionTotal) {
      const inclusionTotalObject = {
        inclusionTotal: inclusionTotal,
        ipAddress: clientIp,
        deviceType: deviceType,
        logId: inclusionTotalLog,
      };
      packageRatePlan.inclusionTotal.unshift(inclusionTotalObject);
    }

    if (ratePlanTotal) {
      const ratePlanTotalObject = {
        ratePlanTotal: ratePlanTotal,
        ipAddress: clientIp,
        deviceType: deviceType,
        logId: ratePlanTotalLog,
      };
      packageRatePlan.ratePlanTotal.unshift(ratePlanTotalObject);
    }

    if (minimumNights) {
      const minimumNightsObject = {
        minimumNights: minimumNights,
        ipAddress: clientIp,
        deviceType: deviceType,
        logId: minimumNightsLog,
      };
      packageRatePlan.minimumNights.unshift(minimumNightsObject);
    }

    if (maximumNights) {
      const maximumNightsObject = {
        maximumNights: maximumNights,
        ipAddress: clientIp,
        deviceType: deviceType,
        logId: maximumNightsLog,
      };
      packageRatePlan.maximumNights.unshift(maximumNightsObject);
    }

    if (packageRateAdjustment) {
      const packageRateAdjustmentObject = {
        packageRateAdjustment: packageRateAdjustment,
        ipAddress: clientIp,
        deviceType: deviceType,
        logId: packageRateAdjustmentLog,
      };
      packageRatePlan.packageRateAdjustment.unshift(
        packageRateAdjustmentObject
      );
    }

    await packageRatePlan.save();
    const requestData = {
      body: req.body,
    };
    const requestDataString = JSON.stringify(requestData)


    const responseData = {
      message: "updated successfully", 
      statuscode: 200, }
    const responseString = JSON.stringify(responseData)

    //save data in logs

    if(addpackageRateLog){
    if (shortCode) {
      const shortCodeObject = {
        shortCode: shortCode,
        logId: shortcodeLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
        userId: userId,
      };
      addpackageRateLog.shortCode.unshift(shortCodeObject);
    }
    if (displayStatus) {
      const displayStatusObject = {
        displayStatus: displayStatus,
        logId: displayStatusLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
        userId: userId,
      };
      addpackageRateLog.displayStatus.unshift(displayStatusObject);
    }
    if (ratePlanName) {
      const ratePlanNameObject = {
        ratePlanName: ratePlanName,
        logId: ratePlanNameLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
        userId: userId,
      };
      addpackageRateLog.ratePlanName.unshift(ratePlanNameObject);
    }
    if (ratePlanInclusion) {
      const ratePlanInclusionObject = {
        ratePlanInclusion: ratePlanInclusion,
        logId: ratePlanInclusionLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        request: requestDataString,
        response: responseString,
        modifiedOn: currentUTCTime,
        userId: userId,
      };
      addpackageRateLog.ratePlanInclusion.unshift(ratePlanInclusionObject);
    }
    if (inclusionTotal) {
      const inclusionTotalObject = {
        inclusionTotal: inclusionTotal,
        logId: inclusionTotalLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
        userId: userId,
      };
      addpackageRateLog.inclusionTotal.unshift(inclusionTotalObject);
    }
    if (ratePlanTotal) {
      const ratePlanTotalObject = {
        ratePlanTotal: ratePlanTotal,
        logId: ratePlanTotalLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
        userId: userId,
      };
      addpackageRateLog.ratePlanTotal.unshift(ratePlanTotalObject);
    }
    if (minimumNights) {
      const minimumNightsObject = {
        minimumNights: minimumNights,
        logId: minimumNightsLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
        userId: userId,
      };
      addpackageRateLog.minimumNights.unshift(minimumNightsObject);
    }
    if (maximumNights) {
      const maximumNightsObject = {
        maximumNights: maximumNights,
        logId: maximumNightsLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
        userId: userId,
      };
      addpackageRateLog.maximumNights.unshift(maximumNightsObject);
    }
    if (packageRateAdjustment) {
      const packageRateAdjustmentObject = {
        packageRateAdjustment: packageRateAdjustment,
        logId: packageRateAdjustmentLog,
        ipAddress: clientIp,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
        request: requestDataString,
        response: responseString,
        userId: userId,
      };
      addpackageRateLog.packageRateAdjustment.unshift(packageRateAdjustmentObject);
    }
  }
  await addpackageRateLog.save()

    return res
      .status(200)
      .json({
        message: "packageRatePlan updated successfully",
        statusCode: 200,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal Server error", statusCode: 500 });
  }
};
