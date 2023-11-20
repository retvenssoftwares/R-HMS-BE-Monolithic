import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import seasonModel from "../../models/season.js";
import {
  getCurrentUTCTimestamp,
  findUserByUserIdAndToken,
} from "../../helpers/helper.js";
import seasonsLog from "../../models/LogModels/seasonsLog.js";

const postSeason = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      propertyId,
      seasonName,
      startDate,
      endDate,
      days,
      deviceType,
      ipAddress,
    } = req.body;

    const authCodeValue = req.headers["authcode"];
    const findUser = await verifiedUser.findOne({ userId });
    if (!findUser) {
      return res
        .status(400)
        .json({ message: "User not found or invalid userId", statuscode: 400 });
    }
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    const currentUTCTime = await getCurrentUTCTimestamp();

    if (result.success) {
      let userRole = findUser.role[0].role;

      const daysArray = days.map((dayString) => dayString.trim());
      const newSeason = new seasonModel({
        propertyId,
        seasonId: Randomstring.generate(8),
        shortCode: [
          {
            shortCode: shortCode,
            logId: Randomstring.generate(10),
          },
        ],
        seasonName: [
          {
            seasonName: seasonName,
            logId: Randomstring.generate(10),
          },
        ],
        startDate: [
          {
            startDate: startDate,
            logId: Randomstring.generate(10),
          },
        ],
        endDate: [
          {
            endDate: endDate,
            logId: Randomstring.generate(10),
          },
        ],
        createdBy: userRole,

        createdOn: await getCurrentUTCTimestamp(),
        displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(10) }],
        createdOn: currentUTCTime,

        modifiedBy: [],
        modifiedOn: [],
        days: [{ days: daysArray, logId: Randomstring.generate(10) }],
      });
      const savedSeasons = await newSeason.save();
      //save data in logs

      const addSeasonsLogs = new seasonsLog({
        userId: savedSeasons.userId,
        propertyId: savedSeasons.propertyId,
        createdBy: savedSeasons.createdBy,
        createdOn: savedSeasons.createdOn,
        seasonId: savedSeasons.seasonId,
        shortCode: [
          {
            shortCode: savedSeasons.shortCode[0].shortCode,
            logId: savedSeasons.shortCode[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        displayStatus: [
          {
            displayStatus: savedSeasons.displayStatus[0].displayStatus,
            logId: savedSeasons.displayStatus[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        seasonName: [
          {
            seasonName: savedSeasons.seasonName[0].seasonName,
            logId: savedSeasons.seasonName[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        startDate: [
          {
            startDate: savedSeasons.startDate[0].startDate,
            logId: savedSeasons.startDate[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
        endDate: [
          {
            endDate: savedSeasons.endDate[0].endDate,
            logId: savedSeasons.endDate[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],


        days: [
          {
            days: savedSeasons.days[0].days,
            logId: savedSeasons.days[0].logId,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,
          },
        ],
      });
      //

      await addSeasonsLogs.save();
      return res
        .status(200)
        .json({ message: "New season added successfully", statuscode: 200 });
    } else {
      return res
        .status(result.statuscode)
        .json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postSeason;
