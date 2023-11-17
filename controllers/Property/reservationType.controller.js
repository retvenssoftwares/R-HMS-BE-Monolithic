import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import verifiedUser from "../../models/verifiedUsers.js";
import reservationModel from "../../models/reservationType.js";
import { getCurrentUTCTimestamp,findUserByUserIdAndToken } from "../../helpers/helper.js";
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
        logId:Randomstring.generate(10)
      }],
      status: [{
        status: status,
        logId:Randomstring.generate(10)
      }],
      createdBy: userRole,

      createdOn: currentUTCTime,
      modifiedBy: [],
      modifiedOn: [],

    });
    const savedreservation= await newReservation.save();

    // save data in logs

    const addreservationLogs =new reservationLog({
      userId:savedreservation.userId,
      propertyId:savedreservation.propertyId,
      createdOn:savedreservation.createdOn,
      createdBy:savedreservation.createdBy,
      reservationTypeId:savedreservation.reservationTypeId,
      reservationName:[{
        reservationName:savedreservation.reservationName[0].reservationName,
        logId: savedreservation.reservationName[0].logId,
        userId: userId,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
      }],
      status:[{
        status: savedreservation.status[0].status,
        logId: savedreservation.status[0].logId,
        userId: userId,
        deviceType: deviceType,
        modifiedOn: currentUTCTime,
      }]
    })

    await addreservationLogs.save();

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