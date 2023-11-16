import mongoose, { model, mongo } from "mongoose"
import floor from "../../models/floor.js"
import Randomstring from "randomstring"
import roomFloorData from "../../models/roomInFloor.js"

export const roomDetails = async (req, res) => {
  try {

    const { propertyId, floorData, userId } = req.body

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

    var data = new roomFloorData({

      propertyId: propertyId,
      floorData: floorData,

    })

    await data.save()

    return res.status(200).json({ message: "room Added Successfully", statusCode: 200 })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Internal Server error", statusCode: 500 })
  }
}



