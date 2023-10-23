import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import inclusionModel from "../../models/inclusion.js";
import { getCurrentUTCTimestamp } from "../../helpers/helper.js";

const postInclusion = async (req, res) => {
  try {
    const {
      userId,
      shortCode,
      propertyId,
      charge,
      inclusionName,
      inclusionType,
      chargeRule,
      postingRule
    } = req.body;

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    if (!findUser) {
      return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
    }
    const userToken = findUser.authCode

    if (authCodeValue !== userToken) {
      return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
    }
    let userRole = findUser.role[0].role

    const newSeason = new inclusionModel({

      propertyId,
      inclusionId: Randomstring.generate(8),
      shortCode: shortCode,
      charge: [{
        charge: charge
      }],
      inclusionName: [{
        inclusionName: inclusionName
      }],
      inclusionType: [{
        inclusionType: inclusionType
      }],
      chargeRule: [{
        chargeRule: chargeRule
      }],
      postingRule: [{
        postingRule: postingRule
      }],
      createdBy: userRole,

      createdOn: await getCurrentUTCTimestamp(),

      modifiedBy: [],
      modifiedOn: [],
      days: [],

    });
    await newSeason.save();
    return res.status(200).json({ message: "New Inclusion added successfully", statuscode: 200 });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postInclusion;