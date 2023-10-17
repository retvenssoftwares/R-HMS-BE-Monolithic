import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import reservationModel from "../../models/reservationType.js";
import userModel from '../../models/user.js'

import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
} from "../../helpers/helper.js";

//upload property controller
const postProperty = async (req, res) => {
  try {
    const {
      userId,
      reservationTypeId,  
      propertyId,
      reservationName,
      status,
      createdBy,
      createdOn,
      modifiedOn,
    } = req.body;

    const authCodeValue = req.headers['authcode']

    const findUser = await userModel.findOne({ userId })

    if(!findUser){
      return res.status(404).json({message:"user not found"})
    }
    const {authCode}= findUser

    if(authCodeValue!==authCode){
      return res.status(404).json({message:"invalid authCode"})
    }
  
    let userRole = findUser.role[0].role
    const currentUTCTime = await getCurrentUTCTimestamp();
    //create record
    const newReservation = new reservationModel({
      propertyId,
      reservationTypeId:Randomstring.generate(8),
      dateUTC: currentUTCTime,
      dateLocal: getCurrentLocalTimestamp(),
      createdBy:userRole,
      createdOn:currentUTCTime,
      reservationType: [
        {
          reservationName:reservationName,
          status:status,
        },
      ],
     
    });

    // Save the reservation record
    const savedReservation = await newReservation.save();
    return res.status(200).json({ message: "New reservation added successfully", statuscode: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};



export default postProperty;
