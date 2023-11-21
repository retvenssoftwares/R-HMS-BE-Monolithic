import roomTypeModel from "../../models/roomType.js";
import { findUserByUserIdAndToken, validateHotelCode } from "../../helpers/helper.js";
const getRoom = async (req, res) => {
  try {
    const { propertyId, userId } = req.query
    const authCodeValue = req.headers['authcode']

    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (result.success) {
      if (!propertyId) {
        return res.status(400).json({ message: "Please enter propertyId", statuscode: 400 })
      }

      const result = await validateHotelCode(userId, propertyId)
      if (!result.success) {
        return res.status(result.statuscode).json({ message: "Invalid propertyId entered", statuscode: result.statuscode })
      }
      const findRoom = await roomTypeModel.find({ propertyId: propertyId }).select("roomTypeName.roomTypeName propertyId roomTypeId baseAdult.baseAdult baseChild.baseChild extraAdultRate.extraAdultRate baseRate.baseRate extraChildRate.extraChildRate ").lean();

      if (findRoom.length > 0) {
        const foundRoomData = findRoom.map((roomData) => {
          return {
            ...roomData._doc,
            propertyId: roomData.propertyId || "",
            roomTypeId: roomData.roomTypeId || '',
            roomTypeName: roomData.roomTypeName[0].roomTypeName || '',
            baseAdult: roomData.baseAdult[0].baseAdult || '',
            baseChild: roomData.baseChild[0].baseChild || '',
            extraAdultRate: roomData.extraAdultRate[0].extraAdultRate || '',
            extraChildRate: roomData.extraChildRate[0].extraChildRate || '',
            baseRate: roomData.baseRate[0].baseRate || ''
          }
        })
        return res.status(200).json({ data: foundRoomData, statuscode: 200 });

      } else {
        return res.status(200).json({ message: "No rooms found", status: 200 });
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
