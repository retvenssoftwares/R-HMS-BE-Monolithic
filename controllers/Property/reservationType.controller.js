import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import reservationModel from "../../models/reservationType.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";

const postReservationType = async (req, res) => {
  try {
    const {
      userId,
      propertyId,
      reservationName,
      status
    } = req.body;

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    if (!findUser) {
      return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
    }

    let userRole = findUser.role[0].role
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (result.success) {
      const newReservation = new reservationModel({

        propertyId,
        reservationTypeId: Randomstring.generate(8),
        reservationName: [{
          reservationName: reservationName
        }],
        status: [{
          status: status
        }],
        createdBy: userRole,
        displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(10) }],
        createdOn: await getCurrentUTCTimestamp(),
        modifiedBy: [],
        modifiedOn: [],

      });
      await newReservation.save();
      return res.status(200).json({ message: "New reservation added successfully", statuscode: 200 });
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postReservationType;