import * as dotenv from "dotenv";
import Randomstring from 'randomstring'
import roomImageModel from "../../models/roomTypeImages.js";
import {
  getCurrentUTCTimestamp,
  uploadImageToS3,
} from "../../helpers/helper.js";

dotenv.config();

const postProperty = async (req, res) => {
  try {
    const roomTypeId = req.params.roomTypeId; // Assuming you get the roomTypeId from the request parameters

    const currentUTCTime = await getCurrentUTCTimestamp();

    // Find the existing record by roomTypeId
    const existingRecord = await roomImageModel.findOne({ roomTypeId });

    if (!existingRecord) {
      return res.status(404).json({ message: "Room type not found", statuscode: 404 });
    }

    // Upload Room images
    if (req.files["roomImage"]) {
      const roomImageUrls = [];

      for (const roomImage of req.files["roomImage"]) {
        const imageUrl = await uploadImageToS3(roomImage);
        roomImageUrls.push({
          imageId: Randomstring.generate(8),
          image:imageUrl,
          modifiedDate: currentUTCTime,
        });
      }

      // Append the uploaded room images to the existing record
      existingRecord.Room = existingRecord.Room.concat(roomImageUrls);
    }

    // Upload View images
    if (req.files["viewImage"]) {
      const viewImageUrls = [];

      for (const viewImage of req.files["viewImage"]) {
        const imageUrl = await uploadImageToS3(viewImage);
        viewImageUrls.push({
          imageId: Randomstring.generate(8),
          image:imageUrl,
          modifiedDate: currentUTCTime,
        });
      }

      // Append the uploaded view images to the existing record
      existingRecord.View = existingRecord.View.concat(viewImageUrls);
    }

    //upload bathRoom
    if (req.files["bathRoomImage"]) {
        const viewImageUrls = [];
  
        for (const viewImage of req.files["bathRoomImage"]) {
          const imageUrl = await uploadImageToS3(viewImage);
          viewImageUrls.push({
            imageId: Randomstring.generate(8),
            image:imageUrl,
            modifiedDate: currentUTCTime,
          });
        }
  
        // Append the uploaded view images to the existing record
        existingRecord.bathRoom = existingRecord.bathRoom.concat(viewImageUrls);
      }

      //upload bed
      if (req.files["bedImage"]) {
        const viewImageUrls = [];
  
        for (const viewImage of req.files["bedImage"]) {
          const imageUrl = await uploadImageToS3(viewImage);
          viewImageUrls.push({
            imageId: Randomstring.generate(8),
            image:imageUrl,
            modifiedDate: currentUTCTime,
          });
        }
  
        // Append the uploaded view images to the existing record
        existingRecord.bed = existingRecord.bed.concat(viewImageUrls);
      }


    // Save the updated roomImages record
    const updatedRoomImages = await existingRecord.save();

    return res.status(200).json({ message: "Images uploaded successfully", statuscode: 200 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", statuscode: 500 });
  }
};

export default postProperty
