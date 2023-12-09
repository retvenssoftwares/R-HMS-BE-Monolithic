import RoomImageModel from "../../models/roomTypeImages.js";
import roomImagesLog from "../../models/LogModels/roomTypeImagesLog.js";
import { getCurrentUTCTimestamp,findUserByUserIdAndToken } from "../../helpers/helper.js";

const updateRoomImage = async (req, res) => {
  try {
    const { userId,roomTypeId,imageId } = req.query;
    const authCodeValue = req.headers["authcode"]
    //const { imageId, displayStatus } = req.body;
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
if(result.success){
    // Find the room image by roomTypeId and imageId
    const roomImage = await RoomImageModel.findOne({ roomTypeId, "roomImages.imageId": imageId });
    // const roomImageLog = await roomImagesLog.findOne({ roomTypeId, "roomImages.imageId": imageId });
    const currentUTCTime = await getCurrentUTCTimestamp();
    if (!roomImage) {
      return res.status(404).json({ message: "Room image not found",statuscode:404 });
    }

    // Update the displayStatus to '0' in the matched image
    roomImage.roomImages.forEach((image) => {
      if (image.imageId === imageId) {
        image.displayStatus = '0';
      }
    });
    // roomImageLog.roomImages.forEach((image) => {
    //   if (image.imageId === imageId) {
    //     image.displayStatus = '0';
    //   }
    // });

    // Push the matched image to the deletedRoomImages array
    const deletedImage = roomImage.roomImages.find((image) => image.imageId === imageId);
    deletedImage.modifiedDate = await getCurrentUTCTimestamp(); // Set the modifiedDate
    roomImage.deletedRoomImages.push(deletedImage);

    // const deletedImageLog = roomImageLog.roomImages.find((image) => image.imageId === imageId);
    // deletedImageLog.modifiedDate = await getCurrentUTCTimestamp(); // Set the modifiedDate
    // roomImageLog.deletedRoomImages.push(deletedImageLog);

    // Remove the matched image from the roomImages array
    roomImage.roomImages = roomImage.roomImages.filter((image) => image.imageId !== imageId);
    // roomImageLog.roomImages = roomImageLog.roomImages.filter((image) => image.imageId !== imageId);

    // Save the updated document
    const updatedRoomImage = await roomImage.save();

    if (!updatedRoomImage) {
      // roomImageLog.save();
      return res.status(404).json({ message: "Failed to update room image" });
    }

    return res.status(200).json({ message: "Image updated and moved to deletedRoomImages successfully", statuscode: 200 });
  }else{
    return res.status(result.statuscode).json({ message: result.message });
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error", statuscode: 500 });
  }
};

export default updateRoomImage;
