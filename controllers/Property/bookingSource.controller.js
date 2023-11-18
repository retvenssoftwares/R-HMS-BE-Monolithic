import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import bookingModel from "../../models/bookingSource.js";
import userModel from '../../models/verifiedUsers.js'
import {
  getCurrentUTCTimestamp,
  findUserByUserIdAndToken
} from "../../helpers/helper.js";
import bookingSourceLog from "../../models/LogModels/bookingSourcesLog.js";

const postBookingSource = async (req, res) => {
  try {
    const { userId } = req.body
    const {
      propertyId,
      shortCode,
      bookingSource,
      deviceType,
      ipAddress
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
      const savedBookingSourecs = await newBookingSource.save();

      // save data in logs

      const addBookingSourceLog =new bookingSourceLog({
        userId:savedBookingSourecs.userId,
        bookingSourceId:savedBookingSourecs.bookingSourceId,
        createdBy:savedBookingSourecs.createdBy,
        createdOn:savedBookingSourecs.createdOn,
        propertyId:savedBookingSourecs.propertyId,
        shortCode: [
          {
            logId: savedBookingSourecs.shortCode[0].logId,
            shortCode: savedBookingSourecs.shortCode[0].shortCode,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
          },
        ],
        bookingSource: [
          {
            logId: savedBookingSourecs.bookingSource[0].logId,
            bookingSource: savedBookingSourecs.bookingSource[0].bookingSource,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn:currentUTCTime,
          },
        ],
      })

      await addBookingSourceLog.save();

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
