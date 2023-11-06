import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken } from "../../helpers/helper.js";
const getRoom = async (req, res) => {
  try {
    const { propertyId, userId } = req.query
    const authCodeValue = req.headers['authcode']

    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (result.success) {
      const findRoom = await roomTypeModel.find({ propertyId: propertyId }).select("roomTypeName.roomTypeName propertyId roomTypeId").lean();

      if (findRoom.length > 0) {
        const foundRoomData = findRoom.map((roomData) => {
          return {
            ...roomData._doc,
            propertyId: roomData.propertyId || "",
            roomTypeId: roomData.roomTypeId || '',
            roomTypeName: roomData.roomTypeName[0].roomTypeName || ''
          }
        })
        return res.status(200).json({ data: foundRoomData, statuscode: 200 });

      } else {
        return res.status(404).json({ message: "No rooms found", status: 404 });
      }
    } else {
      return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
    }

  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};

export default getRoom;
