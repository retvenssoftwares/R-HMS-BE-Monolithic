import packageRatePlanModel from "../../models/package.js";
import Randomstring from "randomstring";
import requestIP from "request-ip";
import verifiedUser from "../../models/verifiedUsers.js";
import {
  findUserByUserIdAndToken,
  getCurrentUTCTimestamp,
} from "../../helpers/helper.js";

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
      inclusionTotal,
      ratePlanTotal,
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

    const packageId = Randomstring.generate(10);

    if (result.success) {
      const packageRatePlan = new packageRatePlanModel({
        propertyId: propertyId,

        packageId: packageId,

        rateType: rateType,

        roomTypeId: roomTypeId,

        createdBy: userRole,

        ratePlanId: ratePlanId,

        createdOn: await getCurrentUTCTimestamp(),

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

        inclusionTotal: [
          {
            inclusionTotal: inclusionTotal,
            logId: Randomstring.generate(10),
          },
        ],

        ratePlanTotal: [
          {
            ratePlanTotal: ratePlanTotal,
            logId: Randomstring.generate(10),
          },
        ],

        ratePlanInclusion: [
          {
            ratePlanInclusion: ratePlanInclusion,
            logId: Randomstring.generate(10),
          },
        ],
      });
      const packageplan = await packageRatePlan.save();
      return res
        .status(200)
        .json({
          message: "package rate Plan added successfully",
          statusCode: 200,
        });
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
      ipAddress,
    } = req.body;

    const authCode = req.headers["authcode"];
    const userToken = await findUserByUserIdAndToken(userId, authCode);

    if (!userToken) {
      return res
        .status(404)
        .json({ message: "Invalid token ", statusCode: 404 });
    }

    const packageRatePlan = await packageRatePlanModel.findOne({ packageId: req.query.packageId });

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

    if (ratePlanName) {
      const ratePlanNameObject = {
        ratePlanName: ratePlanName,
        logId: ratePlanNameLog,
        ipAddress: clientIp,
        deviceType: deviceType,
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
