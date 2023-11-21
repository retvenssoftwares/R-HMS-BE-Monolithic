import mongoose from "mongoose";
import floor from "../../models/floor.js";
import verifiedUser from "../../models/verifiedUsers.js";
import Randomstring from "randomstring";
import roomFloorData from "../../models/roomInFloor.js";
import {findUserByUserIdAndToken} from "../../helpers/helper.js"

export const roomDetails = async (req, res) => {
  try {
    const { roomTypeId, roomNumber } = req.body;
const {floorId,userId,propertyId} = req.query
    const findUser = await verifiedUser.findOne({ userId: userId });
    const property = await roomFloorData.findOne({ propertyId: propertyId });

    if (!property) {
      return res
        .status(404)
        .json({ message: "PropertyId is invalid", statuscode: 404 });
    }

    if (!findUser) {
      return res
        .status(404)
        .json({ message: "User not found or invalid userid", statuscode: 404 });
    }

    const authCodeValue = req.headers["authcode"];
    const result = await findUserByUserIdAndToken(userId, authCodeValue);

    if (result.success === false) {
      return res
        .status(400)
        .json({ message: "Invalid authentication token", statuscode: 400 });
    }

  // Find the specific floor by floorId
  const foundFloor = property.floorData.find((floor) => floor.floorId === floorId);


    if (!foundFloor) {
      return res
        .status(404)
        .json({ message: "FloorId is invalid", statuscode: 404 });
    }

    // Find the specific room within the found floor by roomNumber
    foundFloor.room.push({
      roomNumber: roomNumber,
      roomTypeId:roomTypeId,
      roomId:Randomstring.generate(8)

    });


    await property.save();

    return res
      .status(200)
      .json({ message: "Room number updated successfully", statusCode: 200 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error", statusCode: 500 });
  }
};
