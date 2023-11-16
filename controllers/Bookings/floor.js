import mongoose, { model, mongo } from "mongoose"
import floor from "../../models/floor.js"
import Randomstring from "randomstring"
import roomFloorData from "../../models/roomInFloor.js"
import verifiedUser from "../../models/verifiedUsers.js"
import { findUserByUserIdAndToken } from "../../helpers/helper.js"

export const addRoomInfloor = async (req, res) => {

  try {

    const { floorInHotel, propertyId , userId } = req.body

    const findUser = await verifiedUser.findOne({ userId: userId });

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

    var floorData = new floor({
      propertyId: propertyId,
      floorInHotel: floorInHotel
    })

    await floorData.save()
    // await floorData.save()
    return res.status(200).json({ message: "Floor added successfully", statusCode: 200 })

  } catch (err) {

    console.log(err)
    return res.status(500).json({ message: "Internal server error", statusCode: 500 })
  }




}



