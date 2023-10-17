import Randomstring from "randomstring";
import * as dotenv from "dotenv";
dotenv.config();
import roomModel from "../../models/roomType.js";
import roomImageModel from "../../models/roomTypeImages.js";
import userModel from "../../models/verifiedUsers.js";
import {
  getCurrentUTCTimestamp,
  getCurrentLocalTimestamp,
  uploadMultipleImagesToS3
} from "../../helpers/helper.js";

//upload Room controller
const postRoom = async (req, res) => {
  try {
    const {
      
      userId,
      roomTypeId,
      propertyId,
      baseAdult,
      baseChild,
      shortCode,
      roomDescription,
      bedType,
      roomTypeName,
      maxAdult,
      maxChild,
      maxOccupancy,
      baseRate,
      minimumRate,
      maximumRate,
      extraAdultRate,
      extraChildRate
    } = req.body;
    
    const authCodeValue = req.headers['authcode']

    const user = await userModel.findOne({userId:req.body.userId})
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
     const {authCode}= user
    // console.log(authCode)

    if(authCodeValue!==authCode){
      return res.status(404).json({message:"invalid authCode"})
    }

    const currentUTCTime = await getCurrentUTCTimestamp();
    //create record
    const newRoom = new roomModel({
      userId,
      shortCode,
      propertyId,
      roomTypeId: Randomstring.generate(8),
      baseAdult: [
        {
          baseAdult,
          modifiedDate: currentUTCTime,
        },
      ],
      baseChild: [
        {
          baseChild,
          modifiedDate: currentUTCTime,
        },
      ],
      roomDescription: [
        {
          roomDescription,
          modifiedDate: currentUTCTime,
        },
      ],
      bedType: [
        {
          bedType,
          modifiedDate: currentUTCTime,
        },
      ],
      roomTypeName: [
        {
          roomTypeName: roomTypeName,
          modifiedDate: currentUTCTime,
        },
      ],
      maxAdult: [
        {
          maxAdult: maxAdult,
          modifiedDate: currentUTCTime,
        },
      ],
      maxChild: [
        {
          maxChild: maxChild,
          modifiedDate: currentUTCTime,
        },
      ],
      maxOccupancy: [
        {
          maxOccupancy:maxOccupancy,
          modifiedDate: currentUTCTime,
        },
      ],
      baseRate: [
        {
          baseRate: baseRate,
          modifiedDate: currentUTCTime,
        },
      ],
      minimumRate: [
        {
          minimumRate: minimumRate,
          modifiedDate: currentUTCTime,
        },
      ],
      maximumRate: [
        {
          maximumRate: maximumRate,
          modifiedDate: currentUTCTime,
        },
      ],
      extraAdultRate: [
        {
          extraAdultRate: extraAdultRate,
          modifiedDate: currentUTCTime,
        },
      ],
      extraChildRate: [
        {
          extraChildRate: extraChildRate,
          modifiedDate: currentUTCTime,
        },
      ],
      dateUTC: currentUTCTime,
      dateLocal: getCurrentLocalTimestamp(),
    });

   
    // Save the Room record
    const savedRoom = await newRoom.save();

    // Create a roomImage record and associate it with the room
    const roomImages = new roomImageModel({
      roomTypeId: savedRoom.roomTypeId, 
      propertyId:savedRoom.propertyId,
    });

    // Save the propertyImages record
    await roomImages.save();


    return res.status(200).json({ message: "New room added successfully", statuscode: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};



export default postRoom;
