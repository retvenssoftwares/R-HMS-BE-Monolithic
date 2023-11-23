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

      // Auto-generate roomId for each room
      const roomsWithId = floorDetail.room.map(room => ({
        ...room,
        roomId: randomstring.generate({ charset: 'alphanumeric', length: 8 })
      }));

      return {
        floorId: floorId,
        floorName: floorDetail.floorName || '',
        roomsInFloor: floorDetail.roomsInFloor || '',
        roomNumberPrefix: floorDetail.roomNumberPrefix || '',
        floorType: floorDetail.floorType || '',
        room: roomsWithId || [],
        amenities: [] // Set your desired value here
      };
    });

    const existingFloor = await floor.findOne({ propertyId: propertyId });

    if (existingFloor) {
      existingFloor.floorDetails.push(...floorDataArray);
      await existingFloor.save();
    } else {
      const newFloor = new floor({
        propertyId: propertyId,
        floorCountStart: [{ floorCountStart: floorCountStart }],
        floorInHotel: [{ floorInHotel: floorInHotel }],
        floorDetails: floorDataArray
      });

      await newFloor.save();
    }

    for (const floorDetail of floorDataArray) {
      const existingRoom = await roomModel.findOne({ propertyId: propertyId });

      if (existingRoom) {
        existingRoom.floorData.push({ floorId: floorDetail.floorId, room: floorDetail.room });
        await existingRoom.save();
      } else {
        const roomSchema = roomModel({
          propertyId: propertyId,
          floorData: [{ floorId: floorDetail.floorId, room: floorDetail.room }],
        });

        await roomSchema.save();
      }
    }

    return res.status(200).json({ message: "Floors and room added successfully", statusCode: 200 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};
