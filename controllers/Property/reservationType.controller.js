import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import reservationModel from "../../models/reservationType.js";

import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
} from "../../helpers/helper.js";

//upload property controller
const postProperty = async (req, res) => {
  try {
    const {
      reservationTypeId,  
      propertyId,
      reservationName,
      status,
      createdBy,
      createdOn,
      modifiedBy,
      modifiedOn,
    } = req.body;

    const currentUTCTime = await getCurrentUTCTimestamp();
    //create record
    const newReservation = new reservationModel({
      propertyId,
      reservationTypeId:Randomstring.generate(8),
      dateUTC: currentUTCTime,
      dateLocal: getCurrentLocalTimestamp(),
      reservationType: [
        {
          reservationName:reservationName,
          status:status,
          createdBy:createdBy,
          createdOn:currentUTCTime,
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
