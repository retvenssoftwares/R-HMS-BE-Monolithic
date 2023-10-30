import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import seasonModel from "../../models/season.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";

const postSeason = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      propertyId,
      seasonName,
      startDate,
      endDate,
      days
    } = req.body;

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    if (!findUser) {
      return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
    }
    const result = await findUserByUserIdAndToken(userId, authCodeValue)

    if (result.success) {
      let userRole = findUser.role[0].role

      const daysArray = days.map(dayString => dayString.trim());
      const newSeason = new seasonModel({

        propertyId,
        seasonId: Randomstring.generate(8),
        seasonShortCode: seasonShortCode,
        seasonName: [{
          seasonName: seasonName,
          logId: Randomstring.generate(10)
        }],
        startDate: [{
          startDate: startDate,
          logId: Randomstring.generate(10)
        }],
        endDate: [{
          endDate: endDate,
          logId: Randomstring.generate(10)
        }],
        createdBy: userRole,

        createdOn: await getCurrentUTCTimestamp(),

        modifiedBy: [],
        modifiedOn: [],
        days: [{ days: daysArray, logId: Randomstring.generate(10) }],

      });
      await newSeason.save();
      return res.status(200).json({ message: "New season added successfully", statuscode: 200 });

    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postSeason;