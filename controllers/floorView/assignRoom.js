import roomStatusModel from "../../models/roomInFloor.js";
import verifiedUser from '../../models/verifiedUsers.js';
import { uploadImageToS3, getCurrentUTCTimestamp, findUserByUserIdAndToken } from '../../helpers/helper.js';

const roomStatus = async (req, res) => {
    try {
      const { userId, propertyId, floorId, roomId, roomStatus } = req.body;
      const authCodeValue = req.headers['authcode'];
  
      const findUser = await verifiedUser.findOne({ userId }); // Assuming verifiedUser is the correct model for user data
  
      if (!findUser) {
        return res.status(404).json({ message: "User not found or invalid userId", statuscode: 404 });
      }
  
      const result = await findUserByUserIdAndToken(userId, authCodeValue);
      if (result.success) {
        // Find the specific floor and room using Mongoose
        const foundFloor = await roomStatusModel.findOne({
          propertyId: propertyId,
          'floorData.floorId': floorId,
          'floorData.room.roomId': roomId,
        });
  console.log(foundFloor)
        if (foundFloor) {
          const floorToUpdate = foundFloor.floorData.find(floor => floor.floorId === floorId);
          if (floorToUpdate) {
            const roomToUpdate = floorToUpdate.room.find(room => room.roomId === roomId);
            if (roomToUpdate) {
              roomToUpdate.roomStatus.push({ roomStatus: roomStatus, date: getCurrentUTCTimestamp() });
  
              // Save the changes
              await foundFloor.save();
  
              return res.status(200).json({ message: "Room status updated successfully", statuscode: 200 });
            } else {
              return res.status(404).json({ message: "Room not found", statuscode: 404 });
            }
          } else {
            return res.status(404).json({ message: "Floor not found", statuscode: 404 });
          }
        } else {
          return res.status(404).json({ message: "Floor or room not found", statuscode: 404 });
        }
      } else {
        return res.status(result.statuscode).json({ message: result.message, statuscode: result.statuscode });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
  };
  
  export default roomStatus;