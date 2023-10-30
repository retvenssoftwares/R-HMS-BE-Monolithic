import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import bookingModel from "../../models/bookingSource.js";
import userModel from '../../models/verifiedUsers.js'
import {
  getCurrentUTCTimestamp,
  findUserByUserIdAndToken
} from "../../helpers/helper.js";

const postBookingSource = async (req, res) => {
  try {
    const { userId } = req.body
    const {
      propertyId,
      shortCode,
      bookingSource
    } = req.body;

    const authCodeValue = req.headers['authcode']

    const findUser = await userModel.findOne({ userId })

    if (!findUser) {
      return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 })
    }

    const result = await findUserByUserIdAndToken(userId, authCodeValue)

    if (result.success) {
      let userRole = findUser.role[0].role
      const currentUTCTime = await getCurrentUTCTimestamp();
      //create record
      const newBookingSource = new bookingModel({
        propertyId,
        shortCode: [{
          shortCode: shortCode,
          logId: Randomstring.generate(10)
        }],
        bookingSourceId: Randomstring.generate(8),
        dateUTC: currentUTCTime,
        createdBy: userRole,
        createdOn: currentUTCTime,
        modifiedBy: [],
        modifiedOn: [],
        bookingSource: [
          {
            bookingSource: bookingSource,
            logId: Randomstring.generate(10)
          },
        ],

      });

      // Save the reservation record
      const savedReservation = await newBookingSource.save();
      return res.status(200).json({ message: "New booking Source added successfully", statuscode: 200 });
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};



export default postBookingSource;
