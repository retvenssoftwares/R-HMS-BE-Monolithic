import mongoose, { model, mongo } from "mongoose"
import floor from "../../models/floor.js"
import roomModel from "../../models/roomInFloor.js"
import randomstring from 'randomstring'
import verifiedUser from "../../models/verifiedUsers.js"
import { findUserByUserIdAndToken } from "../../helpers/helper.js"

export const addRoomInfloor = async (req, res) => {

  try {
    const { floorDetails, floorInHotel, floorCountStart, propertyId, userId } = req.body;

    const findUser = await verifiedUser.findOne({ userId: userId });
    if (!findUser) {
      return res.status(404).json({ message: "User not found or invalid userid", statuscode: 404 });
    }

    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if (result.success === false) {
      return res.status(400).json({ message: "Invalid authentication token", statuscode: 400 });
    }

    const floorDataArray = floorDetails.map(floorDetail => {
      const floorId = randomstring.generate({ charset: 'numeric', length: 6 });

      return {
        floorId: floorId,
        floorName: floorDetail.floorName || '',
        roomsInFloor: floorDetail.roomsInFloor || '',
        roomNumberPrefix: floorDetail.roomNumberPrefix || '',
        floorType:floorDetail.floorType || '',
        amenities: [] // Set your desired value here
      };
    });

     // Check if propertyId exists in floor model
     const existingFloor = await floor.findOne({ propertyId: propertyId });

     if (existingFloor) {
       // If propertyId exists, update the existing record by adding floor details
       existingFloor.floorDetails.push(...floorDataArray);
       await existingFloor.save();
     } else {
       // If propertyId doesn't exist, create a new floor record with floor details
       const newFloor = new floor({
         propertyId: propertyId,
         floorCountStart: [{ floorCountStart: floorCountStart }],
         floorInHotel: [{ floorInHotel: floorInHotel }],
         floorDetails: floorDataArray
       });
 
       await newFloor.save();
     }

  // Creating room models for each floor
  for (const floorDetail of floorDataArray) {
    // Check if propertyId exists in roomModel
    const existingRoom = await roomModel.findOne({ propertyId: propertyId });

    if (existingRoom) {
      // If propertyId exists, update the existing record by adding floorId
      existingRoom.floorData.push({ floorId: floorDetail.floorId });
      await existingRoom.save();
    } else {
      // If propertyId doesn't exist, create a new roomModel with floorId
      const roomSchema = roomModel({
        propertyId: propertyId,
        floorData: [{ floorId: floorDetail.floorId }], // Passing the floorId to roomModel
        // Add other room details as needed
      });

      await roomSchema.save();
    }
  }

  
    
    return res.status(200).json({ message: "Floors added successfully", statusCode: 200 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }




}



