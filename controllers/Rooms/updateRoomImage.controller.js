import RoomImageModel from "../../models/roomTypeImages.js";
import { getCurrentUTCTimestamp } from "../../helpers/helper.js";

const updateRoomImage = async (req, res) => {
  try {
    const { roomTypeId } = req.query;
    const { imageId, displayStatus } = req.body;

    // Find the room image by roomTypeId and imageId
    const roomImage = await RoomImageModel.findOne({ roomTypeId, "Room.imageId": imageId });

    if (!roomImage) {
      return res.status(404).json({ message: "Room image not found" });
    }

    // Update the displayStatus of the matched image
    const updatedRoomImage = await RoomImageModel.findOneAndUpdate(
      { roomTypeId, "Room.imageId": imageId },
      { $set: { "Room.$.displayStatus": displayStatus } },
      { new: true }
    );



    if (!updatedRoomImage) {
      return res.status(404).json({ message: "Failed to update room image" });
    }

    return res.status(200).json({ message: "Image updated successfully", statuscode: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error",statuscode:500 });
  }
};

export default updateRoomImage;
