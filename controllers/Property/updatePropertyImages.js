import propertyImageModel from "../../models/propertyImages.js";
import { getCurrentUTCTimestamp, findUserByUserIdAndToken } from "../../helpers/helper.js";

const updateRoomImage = async (req, res) => {
  try {
    const { userId, propertyId, imageId } = req.query;
    const authCodeValue = req.headers["authcode"]
    //const { imageId, displayStatus } = req.body;
    const result = await findUserByUserIdAndToken(userId, authCodeValue);
    if (result.success) {
      // Find the room image by roomTypeId and imageId
      const propertyImage = await propertyImageModel.findOne({ propertyId, "propertyImages.imageId": imageId });
      const currentUTCTime = await getCurrentUTCTimestamp();
      if (!propertyImage) {
        return res.status(404).json({ message: "property image not found", statuscode: 404 });
      }

      // Update the displayStatus to '0' in the matched image
      propertyImage.propertyImages.forEach((image) => {
        if (image.imageId === imageId) {
          image.displayStatus = '0';
        }
      });

      // Push the matched image to the deletedRoomImages array
      const deletedImage = propertyImage.propertyImages.find((image) => image.imageId === imageId);
      deletedImage.modifiedDate = await getCurrentUTCTimestamp(); // Set the modifiedDate
      propertyImage.deletedPropertyImages.push(deletedImage);

      // Remove the matched image from the roomImages array
      propertyImage.propertyImages = propertyImage.propertyImages.filter((image) => image.imageId !== imageId);

      // Save the updated document
      const updatedRoomImage = await propertyImage.save();

      if (!updatedRoomImage) {
        return res.status(404).json({ message: "Failed to update room image", statuscode: 404 });
      }

      return res.status(200).json({ message: "Image updated and moved to deletedPropertyImages successfully", statuscode: 200 });
    } else {
      return res.status(result.statuscode).json({ message: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error", statuscode: 500 });
  }
};

export default updateRoomImage;
