import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import reservationModel from "../../models/reservationType.js";
import { getCurrentUTCTimestamp } from "../../helpers/helper.js";

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
    const userToken = findUser.authCode

    if (authCodeValue !== userToken) {
      return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
    }
    let userRole = findUser.role[0].role

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

      createdOn: await getCurrentUTCTimestamp(),
      modifiedBy: [],
      modifiedOn: [],

    });
    await newReservation.save();
    return res.status(200).json({ message: "New reservation added successfully", statuscode: 200 });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postReservationType;