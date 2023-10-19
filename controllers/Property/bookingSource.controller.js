import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import bookingModel from "../../models/bookingSource.js";
import userModel from '../../models/verifiedUsers.js'

import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
} from "../../helpers/helper.js";


const postBookingSource = async (req, res) => {
  try {
    const {
      userId,
      bookingSourceId,  
      propertyId,
      shortCode,
      sourceName,
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
    const newBookingSource = new bookingModel({
      propertyId,
      shortCode,
      bookingSourceId:Randomstring.generate(8),
      dateUTC: currentUTCTime,
      dateLocal: getCurrentLocalTimestamp(),
      createdBy:userRole,
      createdOn:currentUTCTime,
      bookingSource: [
        {
          sourceName:sourceName,
          
        },
      ],
     
    });

    // Save the reservation record
    const savedReservation = await newBookingSource.save();
    return res.status(200).json({ message: "New booking Source added successfully", statuscode: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};



export default postBookingSource;
