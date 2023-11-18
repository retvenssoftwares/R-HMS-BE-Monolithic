import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import reservationModel from "../../models/reservationType.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";
import reservationLog from "../../models/LogModels/reservationLogs.js";

const postReservationType = async (req, res) => {
  try {
    const {
      userId,
      propertyId,
      reservationName,
      status,
      deviceType,
      ipAddress,
    } = req.body;

    const authCodeValue = req.headers['authcode']
    const findUser = await verifiedUser.findOne({ userId })
    if (!findUser) {
      return res.status(400).json({ message: "User not found or invalid userId", statuscode: 400 })
    }

    let userRole = findUser.role[0].role
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    const currentUTCTime=await getCurrentUTCTimestamp();
    if (result.success) {
      const newReservation = new reservationModel({

        propertyId,
        reservationTypeId: Randomstring.generate(8),
        reservationName: [{
          reservationName: reservationName,
          logId:Randomstring.generate()
        }],
        status: [{
          status: status,
          logId:Randomstring.generate()
        }],
        createdBy: userRole,
        displayStatus: [{ displayStatus: "1", logId: Randomstring.generate(10) }],
        createdOn: await getCurrentUTCTimestamp(),
        modifiedBy: [],
        modifiedOn: [],

      });
      const savedReservation= await newReservation.save();

      //save data in logs
      const addReservationLogs=new reservationLog({
        userId:savedReservation.userId,
        propertyId:savedReservation.propertyId,
        reservationTypeId:savedReservation.reservationTypeId,
        createdBy:savedReservation.createdBy,
        createdOn:savedReservation.createdOn,
        reservationName: [{
            logId:savedReservation.reservationName[0].logId,
            reservationName: savedReservation.reservationName[0].reservationName,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,                 
           }],
        status: [{
            logId:savedReservation.status[0].logId,
            status: savedReservation.status[0].status,
            userId: userId,
            deviceType: deviceType,
            ipAddress:ipAddress,
            modifiedOn: currentUTCTime,                 
           }],
      })
      await addReservationLogs.save();

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